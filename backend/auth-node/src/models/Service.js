import pool from '../config/database.js';

export class Service {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        category VARCHAR(100) NOT NULL,
        duration VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
    `;
    
    await pool.query(query);
    console.log('Services table created or already exists');
    
    // Добавляем тестовые данные, если таблица пустая
    const countResult = await pool.query('SELECT COUNT(*) FROM services');
    if (parseInt(countResult.rows[0].count) === 0) {
      await this.insertSampleData();
    }
  }

  static async insertSampleData() {
    const sampleServices = [
      // Планировка и проектирование
      { name: 'Консультация по планировке квартиры', description: 'Профессиональная консультация по планировке и перепланировке квартиры. Анализ возможностей, рекомендации по размещению комнат и зон.', price: 3000, category: 'планировка', duration: '1-2 часа' },
      { name: 'Разработка дизайн-проекта', description: 'Полный дизайн-проект квартиры с планировочными решениями, расстановкой мебели и визуализацией.', price: 50000, category: 'планировка', duration: '2-3 недели' },
      { name: '3D визуализация интерьера', description: 'Создание 3D визуализации интерьера с детальной проработкой всех помещений.', price: 25000, category: 'планировка', duration: '1-2 недели' },
      { name: 'Планировочное решение', description: 'Разработка планировочного решения с учетом ваших пожеланий и возможностей перепланировки.', price: 15000, category: 'планировка', duration: '1 неделя' },
      { name: 'Обмерный план квартиры', description: 'Выезд специалиста для обмера квартиры и создания точного плана помещений.', price: 5000, category: 'планировка', duration: '1 день' },
      
      // Согласование и документы
      { name: 'Подготовка документов для перепланировки', description: 'Полная подготовка всех необходимых документов для согласования перепланировки в БТИ и жилинспекции.', price: 15000, category: 'согласование', duration: '2-3 недели' },
      { name: 'Согласование перепланировки в БТИ', description: 'Сопровождение процесса согласования перепланировки в Бюро технической инвентаризации.', price: 20000, category: 'согласование', duration: '1-2 месяца' },
      { name: 'Получение технического заключения', description: 'Помощь в получении технического заключения о возможности перепланировки от проектной организации.', price: 25000, category: 'согласование', duration: '2-3 недели' },
      { name: 'Согласование в жилинспекции', description: 'Сопровождение согласования перепланировки в жилищной инспекции с полным пакетом документов.', price: 18000, category: 'согласование', duration: '1-2 месяца' },
      { name: 'Восстановление документов БТИ', description: 'Помощь в восстановлении утерянных документов БТИ и технических паспортов.', price: 8000, category: 'согласование', duration: '2-4 недели' },
      
      // Подбор и покупка
      { name: 'Подбор мебели под интерьер', description: 'Профессиональный подбор мебели с учетом стиля интерьера, размеров помещений и вашего бюджета.', price: 10000, category: 'подбор', duration: '1-2 недели' },
      { name: 'Расстановка мебели в планировке', description: 'Разработка вариантов расстановки мебели с учетом эргономики и дизайна интерьера.', price: 8000, category: 'подбор', duration: '1 неделя' },
      { name: 'Закупка материалов у производителей', description: 'Организация закупки отделочных материалов и мебели напрямую у производителей со скидками.', price: 0, category: 'подбор', duration: 'по запросу' },
      { name: 'Подбор отделочных материалов', description: 'Подбор отделочных материалов (обои, плитка, краска) с учетом стиля и бюджета проекта.', price: 5000, category: 'подбор', duration: '1 неделя' },
      { name: 'Комплектация сантехники', description: 'Подбор и комплектация сантехнического оборудования для ванной комнаты и кухни.', price: 7000, category: 'подбор', duration: '1 неделя' },
      
      // Поиск мастеров
      { name: 'Поиск проверенных мастеров', description: 'Подбор проверенных мастеров для выполнения ремонтных работ с гарантией качества.', price: 5000, category: 'мастера', duration: '3-5 дней' },
      { name: 'Контроль качества работ', description: 'Контроль качества выполнения ремонтных работ с регулярными проверками и отчетами.', price: 15000, category: 'мастера', duration: 'на весь период работ' },
      { name: 'Составление сметы на ремонт', description: 'Детальная смета на все виды ремонтных работ с указанием материалов и стоимости.', price: 8000, category: 'мастера', duration: '3-5 дней' },
      { name: 'Координация работ бригады', description: 'Полная координация работы бригады мастеров, контроль сроков и качества выполнения.', price: 20000, category: 'мастера', duration: 'на весь период работ' },
      
      // Консультации
      { name: 'Консультация по выбору материалов', description: 'Консультация по выбору отделочных материалов, их характеристикам и применению.', price: 3000, category: 'консультации', duration: '1-2 часа' },
      { name: 'Консультация по перепланировке', description: 'Детальная консультация по вопросам перепланировки, законодательству и возможностям.', price: 5000, category: 'консультации', duration: '2-3 часа' },
      { name: 'Консультация по дизайну интерьера', description: 'Консультация по дизайну интерьера, выбору стиля, цветовой гаммы и декора.', price: 4000, category: 'консультации', duration: '2 часа' },
      { name: 'Онлайн-консультация', description: 'Удобная онлайн-консультация по видеосвязи по любым вопросам ремонта и перепланировки.', price: 2000, category: 'консультации', duration: '1 час' }
    ];

    const insertQuery = `
      INSERT INTO services (name, description, price, category, duration)
      VALUES ($1, $2, $3, $4, $5)
    `;

    for (const service of sampleServices) {
      await pool.query(insertQuery, [
        service.name,
        service.description,
        service.price,
        service.category,
        service.duration
      ]);
    }

    console.log(`Inserted ${sampleServices.length} sample services`);
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM services WHERE 1=1';
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
    const query = 'SELECT * FROM services WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCategory(category) {
    const query = 'SELECT * FROM services WHERE category = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [category]);
    return result.rows;
  }
}


