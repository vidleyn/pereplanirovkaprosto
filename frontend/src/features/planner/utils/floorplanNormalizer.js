/**
 * Нормализатор планировок
 * Масштабирует координаты углов для приведения средней длины стен к заданному диапазону
 */

// Коэффициент нормализации - подбирается так, чтобы средняя длина стен была 3-5 единиц
// Можно быстро изменить для настройки размера помещения
// Для myhome2.json: средняя длина ~246.25, коэффициент для длины 4 = 0.016244
export const NORMALIZATION_SCALE = 0.016244; // Приводит среднюю длину стен к ~4 единицам

/**
 * Вычисляет длину стены по координатам двух углов
 * @param {Object} corner1 - Первый угол {x, y}
 * @param {Object} corner2 - Второй угол {x, y}
 * @returns {number} Длина стены
 */
function calculateWallLength(corner1, corner2) {
  const dx = corner2.x - corner1.x;
  const dy = corner2.y - corner1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Вычисляет среднюю длину стен в планировке
 * @param {Object} floorplanData - Данные планировки
 * @returns {number} Средняя длина стен
 */
function calculateAverageWallLength(floorplanData) {
  if (
    !floorplanData.floorplan ||
    !floorplanData.floorplan.walls ||
    !floorplanData.floorplan.corners
  ) {
    return 0;
  }

  const corners = floorplanData.floorplan.corners;
  const walls = floorplanData.floorplan.walls;

  if (walls.length === 0) {
    return 0;
  }

  let totalLength = 0;
  let validWalls = 0;

  walls.forEach((wall) => {
    const corner1 = corners[wall.corner1];
    const corner2 = corners[wall.corner2];

    if (corner1 && corner2) {
      const length = calculateWallLength(corner1, corner2);
      totalLength += length;
      validWalls++;
    }
  });

  return validWalls > 0 ? totalLength / validWalls : 0;
}

/**
 * Нормализует планировку - масштабирует координаты углов
 * @param {Object|string} floorplanData - Данные планировки (объект или JSON строка)
 * @param {number} targetAverageLength - Целевая средняя длина стен (по умолчанию 4 единицы)
 * @returns {string} Нормализованная планировка в виде JSON строки
 */
export function normalizeFloorplan(floorplanData, targetAverageLength = 4) {
  // Парсим входные данные, если это строка
  let data;
  if (typeof floorplanData === "string") {
    try {
      data = JSON.parse(floorplanData);
    } catch (error) {
      throw new Error("Неверный формат JSON: " + error.message);
    }
  } else {
    data = JSON.parse(JSON.stringify(floorplanData)); // Глубокая копия
  }

  if (!data.floorplan || !data.floorplan.corners || !data.floorplan.walls) {
    throw new Error("Неверная структура данных планировки");
  }

  // Вычисляем текущую среднюю длину стен
  const currentAverageLength = calculateAverageWallLength(data);

  if (currentAverageLength === 0) {
    throw new Error("Не удалось вычислить среднюю длину стен");
  }

  // Вычисляем коэффициент масштабирования
  const scale = targetAverageLength / currentAverageLength;

  // Масштабируем координаты всех углов
  const corners = data.floorplan.corners;
  for (const cornerId in corners) {
    const corner = corners[cornerId];
    if (corner.x !== undefined) {
      corner.x *= scale;
    }
    if (corner.y !== undefined) {
      corner.y *= scale;
    }
    // Масштабируем elevation, если оно есть
    if (corner.elevation !== undefined) {
      corner.elevation *= scale;
    }
  }

  // Масштабируем координаты a и b для криволинейных стен, если они есть
  if (data.floorplan.walls) {
    data.floorplan.walls.forEach((wall) => {
      if (wall.a) {
        if (wall.a.x !== undefined) wall.a.x *= scale;
        if (wall.a.y !== undefined) wall.a.y *= scale;
      }
      if (wall.b) {
        if (wall.b.x !== undefined) wall.b.x *= scale;
        if (wall.b.y !== undefined) wall.b.y *= scale;
      }
    });
  }

  // Масштабируем carbonSheet, если он есть
  if (data.floorplan.carbonSheet) {
    const cs = data.floorplan.carbonSheet;
    if (cs.x !== undefined) cs.x *= scale;
    if (cs.y !== undefined) cs.y *= scale;
    if (cs.width !== undefined) cs.width *= scale;
    if (cs.height !== undefined) cs.height *= scale;
  }

  // Масштабируем позиции предметов, если они есть
  if (data.items && Array.isArray(data.items)) {
    data.items.forEach((item) => {
      if (item.xpos !== undefined) item.xpos *= scale;
      if (item.ypos !== undefined) item.ypos *= scale;
      if (item.zpos !== undefined) item.zpos *= scale;
    });
  }

  // Возвращаем нормализованные данные как JSON строку
  return JSON.stringify(data, null, 2);
}

/**
 * Нормализует планировку с использованием предустановленного коэффициента
 * @param {Object|string} floorplanData - Данные планировки (объект или JSON строка)
 * @returns {string} Нормализованная планировка в виде JSON строки
 */
export function normalizeFloorplanWithScale(floorplanData) {
  // Парсим входные данные, если это строка
  let data;
  if (typeof floorplanData === "string") {
    try {
      data = JSON.parse(floorplanData);
    } catch (error) {
      throw new Error("Неверный формат JSON: " + error.message);
    }
  } else {
    data = JSON.parse(JSON.stringify(floorplanData)); // Глубокая копия
  }

  if (!data.floorplan || !data.floorplan.corners) {
    throw new Error("Неверная структура данных планировки");
  }

  // Применяем предустановленный коэффициент масштабирования
  const scale = NORMALIZATION_SCALE;

  // Масштабируем координаты всех углов
  const corners = data.floorplan.corners;
  for (const cornerId in corners) {
    const corner = corners[cornerId];
    if (corner.x !== undefined) {
      corner.x *= scale;
    }
    if (corner.y !== undefined) {
      corner.y *= scale;
    }
    // Масштабируем elevation, если оно есть
    if (corner.elevation !== undefined) {
      corner.elevation *= scale;
    }
  }

  // Масштабируем координаты a и b для криволинейных стен, если они есть
  if (data.floorplan.walls) {
    data.floorplan.walls.forEach((wall) => {
      if (wall.a) {
        if (wall.a.x !== undefined) wall.a.x *= scale;
        if (wall.a.y !== undefined) wall.a.y *= scale;
      }
      if (wall.b) {
        if (wall.b.x !== undefined) wall.b.x *= scale;
        if (wall.b.y !== undefined) wall.b.y *= scale;
      }
    });
  }

  // Масштабируем carbonSheet, если он есть
  if (data.floorplan.carbonSheet) {
    const cs = data.floorplan.carbonSheet;
    if (cs.x !== undefined) cs.x *= scale;
    if (cs.y !== undefined) cs.y *= scale;
    if (cs.width !== undefined) cs.width *= scale;
    if (cs.height !== undefined) cs.height *= scale;
  }

  // Масштабируем позиции предметов, если они есть
  if (data.items && Array.isArray(data.items)) {
    data.items.forEach((item) => {
      if (item.xpos !== undefined) item.xpos *= scale;
      if (item.ypos !== undefined) item.ypos *= scale;
      if (item.zpos !== undefined) item.zpos *= scale;
    });
  }

  // Возвращаем нормализованные данные как JSON строку
  return JSON.stringify(data, null, 2);
}
