import cv2
import numpy as np
import json
from typing import List, Tuple, Dict
import uuid
try:
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    print("⚠️ pytesseract не установлен. Запустите: pip install pytesseract")
    print("   Также нужен Tesseract OCR: sudo apt-get install tesseract-ocr")

class FloorplanAnalyzer:
    """
    Анализатор планировок квартир - НОВЫЙ ПОДХОД
    Ищет только ТОЛСТЫЕ ДВОЙНЫЕ ЛИНИИ (стены), игнорирует тонкие линии (текст, цифры)
    """
    
    def __init__(self, image_path: str):
        self.image_path = image_path
        self.image = cv2.imread(image_path)
        
        if self.image is None:
            raise ValueError(f"Не удалось загрузить изображение: {image_path}")
        
        # ПРЕДОБРАБОТКА: Очистка неоднородного фона
        self.image = self.preprocess_image(self.image)
        
        self.gray = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)
        self.walls = []
        self.corners = {}
        self.scale = 1.0
        self.text_regions = []  # Области с текстом/цифрами
    
    def preprocess_image(self, image):
        """
        Предобработка: удаление неоднородного фона, теней, шума
        """
        print("\n=== Предобработка изображения ===")
        
        # Конвертируем в LAB для работы с освещенностью
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        
        # ЭТАП 1: Адаптивная коррекция освещения (убираем тени)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        l_corrected = clahe.apply(l)
        
        # Собираем обратно
        lab_corrected = cv2.merge([l_corrected, a, b])
        corrected = cv2.cvtColor(lab_corrected, cv2.COLOR_LAB2BGR)
        
        # ЭТАП 2: Bilateral filter - сглаживает фон, сохраняя границы
        denoised = cv2.bilateralFilter(corrected, d=9, sigmaColor=75, sigmaSpace=75)
        
        # ЭТАП 3: Адаптивная бинаризация
        gray_temp = cv2.cvtColor(denoised, cv2.COLOR_BGR2GRAY)
        binary_adaptive = cv2.adaptiveThreshold(
            gray_temp, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, blockSize=51, C=15
        )
        
        # ЭТАП 4: Морфологическая очистка - удаляем мелкий шум
        kernel_small = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        cleaned = cv2.morphologyEx(binary_adaptive, cv2.MORPH_OPEN, kernel_small)
        
        # Конвертируем обратно в BGR
        result = cv2.cvtColor(cleaned, cv2.COLOR_GRAY2BGR)
        
        # Сохраняем для отладки
        cv2.imwrite("preprocessed_image.png", result)
        print("  ✓ Фон очищен, тени удалены")
        
        return result
    
    def detect_text_regions(self):
        """
        Обнаружение областей с текстом и цифрами - ТОЧНЫЕ КОНТУРЫ
        """
        print("\n=== Поиск областей с текстом/цифрами ===")
        
        text_boxes = []
        
        # Бинаризация для поиска контуров
        _, binary = cv2.threshold(self.gray, 200, 255, cv2.THRESH_BINARY_INV)
        
        # Находим связные компоненты (отдельные символы/цифры)
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(binary, connectivity=8)
        
        # МЕТОД 1: OCR для проверки что это действительно текст/цифры
        ocr_regions = set()
        if TESSERACT_AVAILABLE:
            try:
                custom_config = r'--oem 3 --psm 11 -c tessedit_char_whitelist=0123456789.,'
                data = pytesseract.image_to_data(self.gray, config=custom_config, output_type=pytesseract.Output.DICT)
                
                n_boxes = len(data['text'])
                for i in range(n_boxes):
                    text = data['text'][i].strip()
                    conf = int(data['conf'][i])
                    
                    if conf > 30 and text and any(c.isdigit() for c in text):
                        x, y, w, h = data['left'][i], data['top'][i], data['width'][i], data['height'][i]
                        # Сохраняем область где OCR нашел цифры
                        ocr_regions.add((x, y, x+w, y+h))
                        print(f"  OCR найден текст: '{text}' в ({x}, {y})")
            except Exception as e:
                print(f"  OCR ошибка: {e}")
        
        # МЕТОД 2: Берем ТОЧНЫЕ контуры компонентов, которые попадают в OCR области
        for i in range(1, num_labels):
            x, y, w, h, area = stats[i]
            
            # Характеристики текста/цифр
            aspect_ratio = max(w, h) / max(min(w, h), 1)
            
            is_text = False
            
            # Проверка 1: попадает ли в OCR область?
            cx, cy = x + w//2, y + h//2
            for (ox1, oy1, ox2, oy2) in ocr_regions:
                if ox1 <= cx <= ox2 and oy1 <= cy <= oy2:
                    is_text = True
                    break
            
            # Проверка 2: морфологические признаки текста
            if not is_text and (area < 300 and area > 15 and 
                               aspect_ratio < 6 and 
                               w < 50 and h < 50):
                is_text = True
            
            if is_text:
                # МАЛЕНЬКИЙ padding для точности
                padding = 3  # Минимальный padding!
                text_boxes.append({
                    'x': max(0, x - padding),
                    'y': max(0, y - padding),
                    'w': w + 2*padding,
                    'h': h + 2*padding,
                    'text': '',
                    'method': 'Контур'
                })
        
        # НЕ объединяем - оставляем отдельные маленькие боксы
        # text_boxes = self._merge_overlapping_boxes(text_boxes)
        
        print(f"  Найдено текстовых областей (точных): {len(text_boxes)}")
        
        # Сохраняем для отладки
        debug_img = self.image.copy()
        for box in text_boxes:
            cv2.rectangle(debug_img, 
                         (box['x'], box['y']), 
                         (box['x'] + box['w'], box['y'] + box['h']), 
                         (255, 0, 255), 1)  # Тонкие линии
        cv2.imwrite("debug_text_regions.png", debug_img)
        
        self.text_regions = text_boxes
        return text_boxes
    
    def _merge_overlapping_boxes(self, boxes, iou_threshold=0.3):
        """Объединение перекрывающихся боксов"""
        if not boxes:
            return []
        
        merged = []
        used = set()
        
        for i, box1 in enumerate(boxes):
            if i in used:
                continue
            
            x1, y1, w1, h1 = box1['x'], box1['y'], box1['w'], box1['h']
            group = [box1]
            
            for j, box2 in enumerate(boxes[i+1:], i+1):
                if j in used:
                    continue
                
                x2, y2, w2, h2 = box2['x'], box2['y'], box2['w'], box2['h']
                
                # Проверяем перекрытие
                x_overlap = max(0, min(x1+w1, x2+w2) - max(x1, x2))
                y_overlap = max(0, min(y1+h1, y2+h2) - max(y1, y2))
                overlap_area = x_overlap * y_overlap
                
                area1 = w1 * h1
                area2 = w2 * h2
                union_area = area1 + area2 - overlap_area
                
                iou = overlap_area / union_area if union_area > 0 else 0
                
                if iou > iou_threshold or overlap_area > 0:
                    group.append(box2)
                    used.add(j)
            
            # Объединяем группу в один большой бокс
            all_x = [b['x'] for b in group]
            all_y = [b['y'] for b in group]
            all_x2 = [b['x'] + b['w'] for b in group]
            all_y2 = [b['y'] + b['h'] for b in group]
            
            merged.append({
                'x': min(all_x),
                'y': min(all_y),
                'w': max(all_x2) - min(all_x),
                'h': max(all_y2) - min(all_y),
                'text': box1.get('text', ''),
                'method': box1.get('method', '')
            })
            used.add(i)
        
        return merged
    
    def is_line_in_text_region(self, x1, y1, x2, y2):
        """Проверка: пересекается ли линия с текстовой областью (точная)"""
        line_length = np.sqrt((x2-x1)**2 + (y2-y1)**2)
        
        for region in self.text_regions:
            rx, ry, rw, rh = region['x'], region['y'], region['w'], region['h']
            
            # Для КОРОТКИХ линий (<60px) - больший margin (они могут быть частями цифр)
            # Для ДЛИННЫХ линий - минимальный margin
            if line_length < 60:
                margin = 8  # Расширенная зона для коротких линий
            else:
                margin = 2  # Минимальная зона для длинных стен
            
            rx -= margin
            ry -= margin
            rw += 2*margin
            rh += 2*margin
            
            # Проверяем 5 точек линии
            for t in [0, 0.25, 0.5, 0.75, 1.0]:
                px = int(x1 + t * (x2 - x1))
                py = int(y1 + t * (y2 - y1))
                
                if rx <= px <= rx+rw and ry <= py <= ry+rh:
                    return True
        
        return False
    
    def detect_thick_lines(self):
        """
        НОВЫЙ АЛГОРИТМ: Поиск ТОЛЬКО толстых двойных линий (стен)
        Стены на плане БТИ = две параллельные линии на расстоянии 5-15 пикселей
        """
        print("\n=== НОВЫЙ АЛГОРИТМ: Поиск толстых двойных линий ===")
        
        # СНАЧАЛА находим текстовые области
        self.detect_text_regions()
        
        # 1. Бинаризация
        _, binary = cv2.threshold(self.gray, 200, 255, cv2.THRESH_BINARY_INV)
        cv2.imwrite("step1_binary.png", binary)
        
        # 2. Находим ВСЕ линии с помощью HoughLinesP
        edges = cv2.Canny(binary, 50, 150, apertureSize=3)
        cv2.imwrite("step2_edges.png", edges)
        
        # Оптимальные параметры (баланс между точностью и полнотой)
        lines = cv2.HoughLinesP(edges, 
                                rho=1, 
                                theta=np.pi/180, 
                                threshold=45,      # Средне-строгий
                                minLineLength=35,  # Средняя длина
                                maxLineGap=12)     # Средний разрыв
        
        if lines is None:
            print("Линии не найдены!")
            return [], []
        
        print(f"Найдено линий Hough: {len(lines)}")
        
        # 3. Классифицируем линии на горизонтальные и вертикальные
        h_lines = []
        v_lines = []
        
        for line in lines:
            x1, y1, x2, y2 = line[0]
            
            # ФИЛЬТР: Проверяем что линия НЕ пересекается с текстом
            if self.is_line_in_text_region(x1, y1, x2, y2):
                continue
            
            # Вычисляем угол линии
            angle = np.abs(np.arctan2(y2 - y1, x2 - x1) * 180 / np.pi)
            length = np.sqrt((x2-x1)**2 + (y2-y1)**2)
            
            # Горизонтальная линия (угол близок к 0 или 180)
            if angle < 15 or angle > 165:
                h_lines.append({
                    'x1': min(x1, x2), 'x2': max(x1, x2),
                    'y': (y1 + y2) // 2,
                    'length': length
                })
            # Вертикальная линия (угол близок к 90)
            elif 75 < angle < 105:
                v_lines.append({
                    'y1': min(y1, y2), 'y2': max(y1, y2),
                    'x': (x1 + x2) // 2,
                    'length': length
                })
        
        print(f"Горизонтальных линий: {len(h_lines)}")
        print(f"Вертикальных линий: {len(v_lines)}")
        
        # 4. КЛЮЧЕВОЙ ШАГ: Ищем ПАРЫ параллельных линий (это и есть стены!)
        h_walls = self._find_wall_pairs(h_lines, is_horizontal=True)
        v_walls = self._find_wall_pairs(v_lines, is_horizontal=False)
        
        print(f"\n=== НАЙДЕННЫЕ СТЕНЫ (двойные линии) ===")
        print(f"Горизонтальных стен: {len(h_walls)}")
        print(f"Вертикальных стен: {len(v_walls)}")
        
        return h_walls, v_walls
    
    def _find_wall_pairs(self, lines, is_horizontal=True, min_distance=6, max_distance=18):
        """
        Ищем пары параллельных линий на расстоянии 6-18 пикселей
        (Дроби обычно 2-4px, стены 6-18px)
        """
        walls = []
        used = set()
        
        for i, line1 in enumerate(lines):
            if i in used:
                continue
            
            # Находим параллельные линии
            parallel_group = [line1]
            
            for j, line2 in enumerate(lines):
                if j <= i or j in used:
                    continue
                
                if is_horizontal:
                    # Для горизонтальных: проверяем расстояние по Y и перекрытие по X
                    y_dist = abs(line1['y'] - line2['y'])
                    x1_overlap = max(line1['x1'], line2['x1'])
                    x2_overlap = min(line1['x2'], line2['x2'])
                    overlap = x2_overlap - x1_overlap
                    
                    if (min_distance <= y_dist <= max_distance and 
                        overlap > 25):  # Баланс
                        parallel_group.append(line2)
                        used.add(j)
                else:
                    # Для вертикальных: проверяем расстояние по X и перекрытие по Y
                    x_dist = abs(line1['x'] - line2['x'])
                    y1_overlap = max(line1['y1'], line2['y1'])
                    y2_overlap = min(line1['y2'], line2['y2'])
                    overlap = y2_overlap - y1_overlap
                    
                    if (min_distance <= x_dist <= max_distance and 
                        overlap > 25):  # Баланс
                        parallel_group.append(line2)
                        used.add(j)
            
            # Если нашли хотя бы 2 параллельные линии - это стена!
            if len(parallel_group) >= 2:
                if is_horizontal:
                    # Объединяем в одну толстую стену
                    all_x1 = [l['x1'] for l in parallel_group]
                    all_x2 = [l['x2'] for l in parallel_group]
                    all_y = [l['y'] for l in parallel_group]
                    
                    wall = {
                        'x1': min(all_x1),
                        'x2': max(all_x2),
                        'y': int(np.mean(all_y)),
                        'thickness': max(all_y) - min(all_y),
                        'length': max(all_x2) - min(all_x1),
                        'is_horizontal': True
                    }
                    
                    # Фильтр: стена должна быть достаточно длинной
                    if wall['length'] > 40:  # Баланс: 40px
                        walls.append(wall)
                        print(f"  Горизонтальная стена: Y={wall['y']}, X=[{wall['x1']}-{wall['x2']}], Длина={wall['length']}px, Толщина={wall['thickness']}px")
                else:
                    all_y1 = [l['y1'] for l in parallel_group]
                    all_y2 = [l['y2'] for l in parallel_group]
                    all_x = [l['x'] for l in parallel_group]
                    
                    wall = {
                        'y1': min(all_y1),
                        'y2': max(all_y2),
                        'x': int(np.mean(all_x)),
                        'thickness': max(all_x) - min(all_x),
                        'length': max(all_y2) - min(all_y1),
                        'is_horizontal': False
                    }
                    
                    if wall['length'] > 40:  # Баланс: 40px
                        walls.append(wall)
                        print(f"  Вертикальная стена: X={wall['x']}, Y=[{wall['y1']}-{wall['y2']}], Длина={wall['length']}px, Толщина={wall['thickness']}px")
                
                used.add(i)
        
        return walls
    
    def merge_close_walls(self, walls, is_horizontal=True, tolerance=25):
        """Объединение близких стен"""
        if not walls:
            return []
        
        merged = []
        used = set()
        
        for i, wall1 in enumerate(walls):
            if i in used:
                continue
            
            group = [wall1]
            
            for j, wall2 in enumerate(walls[i+1:], i+1):
                if j in used:
                    continue
                
                if is_horizontal:
                    # Проверяем близость по Y и перекрытие/близость по X
                    if (abs(wall1['y'] - wall2['y']) < tolerance):
                        x1_overlap = max(wall1['x1'], wall2['x1'])
                        x2_overlap = min(wall1['x2'], wall2['x2'])
                        gap = x1_overlap - x2_overlap
                        
                        if gap < tolerance:  # Перекрываются или близко
                            group.append(wall2)
                            used.add(j)
                else:
                    # Проверяем близость по X и перекрытие/близость по Y
                    if (abs(wall1['x'] - wall2['x']) < tolerance):
                        y1_overlap = max(wall1['y1'], wall2['y1'])
                        y2_overlap = min(wall1['y2'], wall2['y2'])
                        gap = y1_overlap - y2_overlap
                        
                        if gap < tolerance:
                            group.append(wall2)
                            used.add(j)
            
            # Объединяем группу
            if is_horizontal:
                all_x1 = [w['x1'] for w in group]
                all_x2 = [w['x2'] for w in group]
                all_y = [w['y'] for w in group]
                all_thickness = [w['thickness'] for w in group]
                
                merged.append({
                    'x1': min(all_x1),
                    'x2': max(all_x2),
                    'y': int(np.mean(all_y)),
                    'thickness': int(np.mean(all_thickness)),
                    'length': max(all_x2) - min(all_x1),
                    'is_horizontal': True
                })
            else:
                all_y1 = [w['y1'] for w in group]
                all_y2 = [w['y2'] for w in group]
                all_x = [w['x'] for w in group]
                all_thickness = [w['thickness'] for w in group]
                
                merged.append({
                    'y1': min(all_y1),
                    'y2': max(all_y2),
                    'x': int(np.mean(all_x)),
                    'thickness': int(np.mean(all_thickness)),
                    'length': max(all_y2) - min(all_y1),
                    'is_horizontal': False
                })
            
            used.add(i)
        
        return merged
    
    def create_corners_from_walls(self, h_walls, v_walls):
        """Создание углов из пересечений стен + концов стен"""
        corners = {}
        corner_map = {}  # (x, y) -> corner_id для быстрого поиска
        
        tolerance = 25  # Допуск для объединения близких углов
        
        print(f"\n=== Поиск углов ===")
        print(f"Горизонтальных стен: {len(h_walls)}")
        print(f"Вертикальных стен: {len(v_walls)}")
        
        # ЭТАП 1: Находим все пересечения
        intersections = []
        for h_wall in h_walls:
            for v_wall in v_walls:
                hx1, hx2, hy = h_wall['x1'], h_wall['x2'], h_wall['y']
                vy1, vy2, vx = v_wall['y1'], v_wall['y2'], v_wall['x']
                
                # Проверяем пересечение
                if (hx1 - tolerance <= vx <= hx2 + tolerance) and (vy1 - tolerance <= hy <= vy2 + tolerance):
                    intersections.append((vx, hy))
        
        # ЭТАП 2: Добавляем концы всех стен как потенциальные углы
        for h_wall in h_walls:
            intersections.append((h_wall['x1'], h_wall['y']))
            intersections.append((h_wall['x2'], h_wall['y']))
        
        for v_wall in v_walls:
            intersections.append((v_wall['x'], v_wall['y1']))
            intersections.append((v_wall['x'], v_wall['y2']))
        
        print(f"Найдено потенциальных углов: {len(intersections)}")
        
        # ЭТАП 3: Объединяем близкие углы в кластеры
        used = set()
        for i, (x1, y1) in enumerate(intersections):
            if i in used:
                continue
            
            # Находим все близкие точки
            cluster = [(x1, y1)]
            for j, (x2, y2) in enumerate(intersections[i+1:], i+1):
                if j in used:
                    continue
                if abs(x1 - x2) < tolerance and abs(y1 - y2) < tolerance:
                    cluster.append((x2, y2))
                    used.add(j)
            
            # Усредняем координаты кластера
            avg_x = int(np.mean([x for x, y in cluster]))
            avg_y = int(np.mean([y for x, y in cluster]))
            
            # Преобразуем в метры
            x_meters = avg_x * self.scale
            y_meters = avg_y * self.scale
            
            corner_id = str(uuid.uuid4())
            corners[corner_id] = {
                "x": round(x_meters, 2),
                "y": round(y_meters, 2),
                "elevation": 2.5
            }
            corner_map[(avg_x, avg_y)] = corner_id
            print(f"  Угол: ({avg_x}, {avg_y}) -> ({x_meters:.2f}м, {y_meters:.2f}м)")
            used.add(i)
        
        self.corner_map = corner_map  # Сохраняем для создания стен
        return corners
    
    def create_walls_from_detected_with_index(self, h_walls, v_walls, corners, corner_index_px):
        """
        Создание стен НА ОСНОВЕ ОБНАРУЖЕННЫХ линий стен
        Каждая обнаруженная стена -> одна стена в blueprint3d
        """
        walls = []
        
        print(f"\n=== Создание стен из обнаруженных линий ===")
        
        tolerance = 30
        
        # Создаем стены из ГОРИЗОНТАЛЬНЫХ линий
        for h_wall in h_walls:
            x1, x2, y = h_wall['x1'], h_wall['x2'], h_wall['y']
            
            # Находим углы на концах этой стены
            corner1_id = None
            corner2_id = None
            
            for (cx, cy), cid in corner_index_px.items():
                # Левый конец стены
                if abs(cx - x1) < tolerance and abs(cy - y) < tolerance:
                    corner1_id = cid
                # Правый конец стены
                if abs(cx - x2) < tolerance and abs(cy - y) < tolerance:
                    corner2_id = cid
            
            if corner1_id and corner2_id and corner1_id != corner2_id:
                wall = self._create_wall_object(corner1_id, corner2_id, corners)
                walls.append(wall)
                print(f"  Горизонтальная стена: {x1}-{x2} at y={y}")
        
        # Создаем стены из ВЕРТИКАЛЬНЫХ линий
        for v_wall in v_walls:
            y1, y2, x = v_wall['y1'], v_wall['y2'], v_wall['x']
            
            # Находим углы на концах этой стены
            corner1_id = None
            corner2_id = None
            
            for (cx, cy), cid in corner_index_px.items():
                # Верхний конец стены
                if abs(cx - x) < tolerance and abs(cy - y1) < tolerance:
                    corner1_id = cid
                # Нижний конец стены
                if abs(cx - x) < tolerance and abs(cy - y2) < tolerance:
                    corner2_id = cid
            
            if corner1_id and corner2_id and corner1_id != corner2_id:
                wall = self._create_wall_object(corner1_id, corner2_id, corners)
                walls.append(wall)
                print(f"  Вертикальная стена: {y1}-{y2} at x={x}")
        
        print(f"  Создано стен: {len(walls)}")
        return walls
    
    def _create_wall_object(self, corner1_id, corner2_id, corners):
        """Создание объекта стены с вычислением координат a и b"""
        c1 = corners[corner1_id]
        c2 = corners[corner2_id]
        
        x1, y1 = c1['x'], c1['y']
        x2, y2 = c2['x'], c2['y']
        
        # Вычисляем угол и длину стены
        angle = np.arctan2(y2 - y1, x2 - x1)
        distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
        
        # Вычисляем координаты a и b для отображения
        half_length = distance * 50
        cos_a = np.cos(angle)
        sin_a = np.sin(angle)
        
        cx = (x1 + x2) / 2 * 100
        cy = (y1 + y2) / 2 * 100
        
        return {
            "corner1": corner1_id,
            "corner2": corner2_id,
            "frontTexture": {
                "url": "rooms/textures/wallmap.png",
                "stretch": True,
                "scale": 0
            },
            "backTexture": {
                "url": "rooms/textures/wallmap.png",
                "stretch": True,
                "scale": 0
            },
            "wallType": "STRAIGHT",
            "a": {
                "x": cx - half_length * cos_a,
                "y": cy - half_length * sin_a
            },
            "b": {
                "x": cx + half_length * cos_a,
                "y": cy + half_length * sin_a
            }
        }
    
    def calculate_scale(self, known_dimension_meters: float, known_dimension_pixels: float):
        """Вычисление масштаба"""
        self.scale = known_dimension_meters / known_dimension_pixels
    
    def visualize_detection(self, output_path: str):
        """Визуализация обнаруженных стен"""
        result = self.image.copy()
        
        # Обнаруживаем стены
        h_walls, v_walls = self.detect_thick_lines()
        
        # Объединяем близкие стены
        h_walls = self.merge_close_walls(h_walls, is_horizontal=True)
        v_walls = self.merge_close_walls(v_walls, is_horizontal=False)
        
        # Рисуем горизонтальные стены (ЗЕЛЕНЫЙ)
        for wall in h_walls:
            cv2.line(result, (wall['x1'], wall['y']), (wall['x2'], wall['y']), (0, 255, 0), 4)
            # Показываем толщину
            cv2.line(result, (wall['x1'], wall['y']-wall['thickness']//2), 
                    (wall['x2'], wall['y']-wall['thickness']//2), (0, 200, 0), 1)
            cv2.line(result, (wall['x1'], wall['y']+wall['thickness']//2), 
                    (wall['x2'], wall['y']+wall['thickness']//2), (0, 200, 0), 1)
        
        # Рисуем вертикальные стены (ЖЕЛТЫЙ)
        for wall in v_walls:
            cv2.line(result, (wall['x'], wall['y1']), (wall['x'], wall['y2']), (0, 255, 255), 4)
            # Показываем толщину
            cv2.line(result, (wall['x']-wall['thickness']//2, wall['y1']), 
                    (wall['x']-wall['thickness']//2, wall['y2']), (0, 200, 200), 1)
            cv2.line(result, (wall['x']+wall['thickness']//2, wall['y1']), 
                    (wall['x']+wall['thickness']//2, wall['y2']), (0, 200, 200), 1)
        
        cv2.imwrite(output_path, result)
        print(f"\nВизуализация сохранена: {output_path}")
    
    def generate_blueprint3d(self, output_path: str):
        """Генерация blueprint3d JSON"""
        # Обнаруживаем стены
        h_walls, v_walls = self.detect_thick_lines()
        
        if not h_walls and not v_walls:
            print("Стены не обнаружены!")
            return
        
        # Объединяем близкие
        h_walls = self.merge_close_walls(h_walls, is_horizontal=True)
        v_walls = self.merge_close_walls(v_walls, is_horizontal=False)
        
        print(f"\nФинальное количество стен:")
        print(f"  Горизонтальных: {len(h_walls)}")
        print(f"  Вертикальных: {len(v_walls)}")
        
        # Создаем углы
        corners = self.create_corners_from_walls(h_walls, v_walls)
        
        # Создаем индекс углов ПО ПИКСЕЛЬНЫМ КООРДИНАТАМ (до нормализации)
        corner_index_px = {}
        for corner_id, corner_data in corners.items():
            x_px = int(corner_data['x'] / self.scale)
            y_px = int(corner_data['y'] / self.scale)
            corner_index_px[(x_px, y_px)] = corner_id
        
        # НОРМАЛИЗАЦИЯ координат: сдвигаем чтобы минимум был близок к 0
        if corners:
            corner_coords = [(c['x'], c['y']) for c in corners.values()]
            min_x = min(x for x, y in corner_coords)
            min_y = min(y for x, y in corner_coords)
            
            # Сдвигаем все углы
            for corner in corners.values():
                corner['x'] = round(corner['x'] - min_x, 2)
                corner['y'] = round(corner['y'] - min_y, 2)
                corner['elevation'] = 2.5  # Стандартная высота потолка
        
        # Создаем стены используя ПИКСЕЛЬНЫЙ индекс
        walls_data = self.create_walls_from_detected_with_index(
            h_walls, v_walls, corners, corner_index_px
        )
        
        # СОЗДАНИЕ КОМНАТ
        rooms, new_floor_textures = self.create_rooms_from_walls(corners, walls_data)
        
        print(f"\nСоздано углов: {len(corners)}")
        print(f"Создано стен: {len(walls_data)}")
        print(f"Создано комнат: {len(rooms)}")
        
        blueprint = {
            "floorplan": {
                "version": "0.0.2a",
                "corners": corners,
                "walls": walls_data,
                "rooms": rooms,
                "wallTextures": [],
                "floorTextures": {},
                "newFloorTextures": new_floor_textures,
                "carbonSheet": {
                    "url": "",
                    "transparency": 1,
                    "x": 0,
                    "y": 0,
                    "anchorX": 0,
                    "anchorY": 0,
                    "width": 0.01,
                    "height": 0.01
                }
            },
            "items": []
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(blueprint, f, indent=2, ensure_ascii=False)
        
        print(f"\nBlueprint сохранен: {output_path}")
        
        return blueprint
    
    def create_rooms_from_walls(self, corners, walls):
        """Создание комнат из замкнутых контуров стен"""
        rooms = {}
        new_floor_textures = {}
        
        # Простая эвристика: если есть 4+ угла, создаем комнату
        if len(corners) >= 4:
            corner_ids = list(corners.keys())
            # Создаем одну большую комнату из всех углов
            room_key = ",".join(corner_ids)
            rooms[room_key] = {"name": "A New Room"}
            
            # Добавляем текстуру пола для комнаты
            new_floor_textures[room_key] = {
                "url": "rooms/textures/hardwood.png",  # Стандартная текстура паркета
                "scale": 400  # Масштаб текстуры
            }
        
        return rooms, new_floor_textures


def main():
    """Пример использования"""
    image_path = "photo.jpg"
    
    analyzer = FloorplanAnalyzer(image_path)
    
    # Устанавливаем масштаб (настройте под ваше изображение)
    analyzer.calculate_scale(5.0, 100.0)
    
    print("=== АНАЛИЗ ПЛАНИРОВКИ (только толстые двойные линии) ===\n")
    
    # Визуализация
    analyzer.visualize_detection("detected_walls.png")
    
    # Генерация blueprint
    blueprint = analyzer.generate_blueprint3d("generated_floorplan.blueprint3d")
    
    print("\n✓ Готово! Проверьте выходные файлы.")



# ============ FASTAPI МИКРОСЕРВИС ============
"""
FastAPI микросервис для анализа планировок БТИ
Весь код в одном файле
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os

app = FastAPI(title="BTI Floorplan Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "running", "service": "BTI Floorplan Analyzer"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/analyze")
async def analyze_floorplan(file: UploadFile = File(...)):
    """
    Анализ планировки БТИ
    Принимает: изображение (JPG, PNG)
    Возвращает: blueprint3d JSON
    """
    
    if not file.content_type.startswith('image/'):
        raise HTTPException(400, "Требуется изображение (JPG/PNG)")
    
    try:
        # Читаем файл
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(400, "Не удалось декодировать изображение")
        
        # Сохраняем временно
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
            cv2.imwrite(tmp.name, image)
            tmp_path = tmp.name
        
        # Анализируем
        analyzer = FloorplanAnalyzer(tmp_path)
        
        # Генерируем blueprint3d во временный файл
        with tempfile.NamedTemporaryFile(delete=False, suffix='.json', mode='w') as bp:
            bp_path = bp.name
        
        blueprint = analyzer.generate_blueprint3d(bp_path)
        
        # Читаем результат
        with open(bp_path, 'r') as f:
            result = json.load(f)
        
        # Удаляем временные файлы
        os.unlink(tmp_path)
        os.unlink(bp_path)
        
        # Добавляем статистику
        corners_count = len(result['floorplan']['corners'])
        walls_count = len(result['floorplan']['walls'])
        rooms_count = len(result['floorplan']['rooms'])
        
        return {
            "status": "success",
            "blueprint3d": result,
            "statistics": {
                "corners": corners_count,
                "walls": walls_count,
                "rooms": rooms_count
            }
        }
    
    except Exception as e:
        raise HTTPException(500, f"Ошибка анализа: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)