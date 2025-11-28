import pool from '../config/database.js';

export class Product {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image_url VARCHAR(500),
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    `;
    
    await pool.query(query);
    console.log('Products table created or already exists');
    
    // Добавляем тестовые данные, если таблица пустая
    const countResult = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(countResult.rows[0].count) === 0) {
      await this.insertSampleData();
    }
  }

  static async insertSampleData() {
    const sampleProducts = [
      // Мебель
      { name: 'Диван угловой "Комфорт"', description: 'Удобный угловой диван с подушками, идеально подходит для гостиной. Размер: 240x180 см.', price: 45000, category: 'мебель', image_url: null, stock: 5 },
      { name: 'Стол обеденный "Семейный"', description: 'Деревянный обеденный стол на 6 персон. Материал: массив дуба.', price: 32000, category: 'мебель', image_url: null, stock: 8 },
      { name: 'Кровать двуспальная "Элегант"', description: 'Кровать с изголовьем и ящиками для хранения. Размер: 160x200 см.', price: 55000, category: 'мебель', image_url: null, stock: 3 },
      { name: 'Шкаф-купе 3-дверный', description: 'Вместительный шкаф-купе с зеркальными дверями. Ширина: 240 см.', price: 68000, category: 'мебель', image_url: null, stock: 4 },
      { name: 'Комод 5-ящичный', description: 'Комод из МДФ с 5 выдвижными ящиками. Размер: 120x80x50 см.', price: 18500, category: 'мебель', image_url: null, stock: 6 },
      { name: 'Стул офисный эргономичный', description: 'Офисный стул с регулировкой высоты и поддержкой поясницы.', price: 8500, category: 'мебель', image_url: null, stock: 12 },
      { name: 'Тумба под ТВ 180 см', description: 'Тумба под телевизор с полками и ящиками. Ширина: 180 см.', price: 22000, category: 'мебель', image_url: null, stock: 7 },
      { name: 'Кресло-качалка', description: 'Деревянное кресло-качалка для отдыха. Материал: массив сосны.', price: 15000, category: 'мебель', image_url: null, stock: 5 },
      // Посуда
      { name: 'Набор посуды "Классик" 12 предметов', description: 'Столовый набор из нержавеющей стали на 6 персон. Включает вилки, ложки, ножи.', price: 3500, category: 'посуда', image_url: null, stock: 15 },
      { name: 'Сервиз чайный "Англия" 15 предметов', description: 'Фарфоровый чайный сервиз на 6 персон. Включает чашки, блюдца, заварочный чайник.', price: 8500, category: 'посуда', image_url: null, stock: 10 },
      { name: 'Кастрюля набор 3 шт.', description: 'Набор кастрюль из нержавеющей стали с крышками. Объемы: 2л, 4л, 6л.', price: 4200, category: 'посуда', image_url: null, stock: 12 },
      { name: 'Сковорода антипригарная 28 см', description: 'Сковорода с антипригарным покрытием, подходит для всех типов плит.', price: 2800, category: 'посуда', image_url: null, stock: 20 },
      { name: 'Набор тарелок "Современный" 12 шт.', description: 'Набор глубоких и плоских тарелок из керамики на 6 персон.', price: 2400, category: 'посуда', image_url: null, stock: 18 },
      { name: 'Бокалы для вина набор 6 шт.', description: 'Набор хрустальных бокалов для красного и белого вина. Высота: 20 см.', price: 3200, category: 'посуда', image_url: null, stock: 14 },
      { name: 'Кофейный сервиз 4 предмета', description: 'Кофейный сервиз из фарфора: чашки, блюдца, сахарница, молочник.', price: 5500, category: 'посуда', image_url: null, stock: 11 },
      // Текстиль
      { name: 'Комплект постельного белья 1.5 спальный', description: 'Комплект из сатина: пододеяльник, простыня, 2 наволочки. Размер: 1.5 спальный.', price: 3200, category: 'текстиль', image_url: null, stock: 25 },
      { name: 'Ковер "Восточный" 200x300 см', description: 'Ковер ручной работы из натуральной шерсти. Цвет: бежевый с орнаментом.', price: 18000, category: 'текстиль', image_url: null, stock: 4 },
      { name: 'Шторы "Классик" 2 шт.', description: 'Плотные портьерные шторы с подкладкой. Ширина: 280 см каждая.', price: 6500, category: 'текстиль', image_url: null, stock: 9 },
      { name: 'Полотенце банное набор 4 шт.', description: 'Набор махровых полотенец: 2 банных, 2 лицевых. Размер: 70x140 см.', price: 2800, category: 'текстиль', image_url: null, stock: 16 },
      { name: 'Покрывало на кровать 160x200', description: 'Декоративное покрывало из микрофибры. Размер: 160x200 см.', price: 4200, category: 'текстиль', image_url: null, stock: 8 },
      { name: 'Подушки декоративные 2 шт.', description: 'Декоративные подушки с наполнителем из холлофайбера. Размер: 50x50 см.', price: 1800, category: 'текстиль', image_url: null, stock: 20 },
      // Освещение
      { name: 'Люстра "Хрусталь" 5 рожков', description: 'Потолочная люстра с хрустальными подвесками. Мощность: 5x60W.', price: 12500, category: 'освещение', image_url: null, stock: 7 },
      { name: 'Светильник настольный LED', description: 'Настольный светильник с LED-лампой и регулировкой яркости.', price: 3200, category: 'освещение', image_url: null, stock: 15 },
      { name: 'Бра настенное 2 шт.', description: 'Набор настенных бра с плафонами из стекла. Мощность: 2x40W.', price: 4500, category: 'освещение', image_url: null, stock: 10 },
      { name: 'Торшер напольный', description: 'Напольный торшер с абажуром. Высота: 160 см. Мощность: 60W.', price: 5500, category: 'освещение', image_url: null, stock: 6 },
      { name: 'Люстра потолочная LED', description: 'Современная потолочная люстра с LED-подсветкой. Диаметр: 60 см.', price: 9800, category: 'освещение', image_url: null, stock: 9 },
      // Декор
      { name: 'Зеркало напольное 180x60 см', description: 'Зеркало в деревянной раме для прихожей или спальни.', price: 8900, category: 'декор', image_url: null, stock: 5 },
      { name: 'Ваза напольная керамическая', description: 'Декоративная ваза из керамики высотой 80 см. Цвет: белый с золотым декором.', price: 4500, category: 'декор', image_url: null, stock: 6 },
      { name: 'Картина на холсте 60x80', description: 'Картина на холсте в деревянной раме. Абстрактная композиция.', price: 5500, category: 'декор', image_url: null, stock: 8 },
      { name: 'Статуэтка декоративная', description: 'Декоративная статуэтка из полистоуна. Высота: 35 см.', price: 3200, category: 'декор', image_url: null, stock: 12 },
      { name: 'Часы настенные', description: 'Настенные часы с кварцевым механизмом. Диаметр: 40 см.', price: 2800, category: 'декор', image_url: null, stock: 14 },
      { name: 'Подсвечники набор 2 шт.', description: 'Набор декоративных подсвечников из металла. Высота: 25 см.', price: 1800, category: 'декор', image_url: null, stock: 18 },
      // Техника
      { name: 'Холодильник двухкамерный', description: 'Двухкамерный холодильник с морозильником. Объем: 350 л. Класс энергопотребления: A+', price: 45000, category: 'техника', image_url: null, stock: 3 },
      { name: 'Стиральная машина автомат', description: 'Стиральная машина с фронтальной загрузкой. Загрузка: 6 кг. Класс энергопотребления: A++', price: 32000, category: 'техника', image_url: null, stock: 5 },
      { name: 'Плита электрическая 4 конфорки', description: 'Электрическая плита с духовым шкафом. 4 конфорки, стеклокерамическая панель.', price: 28000, category: 'техника', image_url: null, stock: 4 },
      { name: 'Посудомоечная машина', description: 'Встраиваемая посудомоечная машина. Загрузка: 12 комплектов. Класс энергопотребления: A++', price: 38000, category: 'техника', image_url: null, stock: 3 },
      { name: 'Микроволновая печь', description: 'Микроволновая печь с грилем. Объем: 25 л. Мощность: 800 Вт.', price: 8500, category: 'техника', image_url: null, stock: 8 },
      { name: 'Вытяжка кухонная', description: 'Вытяжка для кухни с угольным фильтром. Производительность: 600 м³/ч.', price: 12000, category: 'техника', image_url: null, stock: 6 },
      // Сантехника
      { name: 'Раковина накладная 60 см', description: 'Керамическая раковина накладная. Размер: 60x40 см. Цвет: белый.', price: 4500, category: 'сантехника', image_url: null, stock: 10 },
      { name: 'Унитаз подвесной', description: 'Подвесной унитаз с инсталляцией. Система слива: двойной. Цвет: белый.', price: 18000, category: 'сантехника', image_url: null, stock: 5 },
      { name: 'Ванна акриловая 170 см', description: 'Акриловая ванна с гидромассажем. Размер: 170x70 см. Цвет: белый.', price: 45000, category: 'сантехника', image_url: null, stock: 2 },
      { name: 'Смеситель для раковины', description: 'Смеситель однорычажный с изливом. Материал: латунь с хромовым покрытием.', price: 3200, category: 'сантехника', image_url: null, stock: 15 },
      { name: 'Душевая кабина 90x90', description: 'Угловая душевая кабина с раздвижными дверями. Размер: 90x90 см.', price: 28000, category: 'сантехника', image_url: null, stock: 4 },
      { name: 'Полотенцесушитель электрический', description: 'Электрический полотенцесушитель. Мощность: 200 Вт. Длина: 80 см.', price: 5500, category: 'сантехника', image_url: null, stock: 8 },
      // Стройматериалы
      { name: 'Обои виниловые 10 м²', description: 'Виниловые обои с фактурой. Ширина: 53 см. Длина рулона: 10 м.', price: 1200, category: 'стройматериалы', image_url: null, stock: 50 },
      { name: 'Плитка керамическая 30x30', description: 'Керамическая плитка для пола. Размер: 30x30 см. В упаковке: 1.44 м².', price: 850, category: 'стройматериалы', image_url: null, stock: 80 },
      { name: 'Краска водоэмульсионная 10 л', description: 'Водоэмульсионная краска для стен и потолков. Расход: 1 л на 7 м².', price: 1800, category: 'стройматериалы', image_url: null, stock: 30 },
      { name: 'Ламинат 8 м² класс 32', description: 'Ламинат класса износостойкости 32. Толщина: 8 мм. В упаковке: 2 м².', price: 3200, category: 'стройматериалы', image_url: null, stock: 25 },
      { name: 'Плинтус напольный 2.5 м', description: 'Пластиковый плинтус с кабель-каналом. Высота: 6 см. Длина: 2.5 м.', price: 280, category: 'стройматериалы', image_url: null, stock: 100 },
      { name: 'Гипсокартон 2500x1200', description: 'Лист гипсокартона стандартный. Размер: 2500x1200x12.5 мм.', price: 450, category: 'стройматериалы', image_url: null, stock: 60 }
    ];

    const insertQuery = `
      INSERT INTO products (name, description, price, category, image_url, stock)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    for (const product of sampleProducts) {
      await pool.query(insertQuery, [
        product.name,
        product.description,
        product.price,
        product.category,
        product.image_url,
        product.stock
      ]);
    }

    console.log(`Inserted ${sampleProducts.length} sample products`);
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.category) {
      query += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCategory(category) {
    const query = 'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [category]);
    return result.rows;
  }
}
