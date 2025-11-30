import { useState } from "react";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: "Стартуем!",
    excerpt: "Мы рады объявить о запуске платформы РемонтПроводник - вашего надежного спутника в мире ремонта и перепланировки.",
    content: `
      <h2>Добро пожаловать в РемонтПроводник!</h2>
      <p>Мы рады объявить о запуске нашей платформы, которая станет вашим надежным спутником на всех этапах ремонта и перепланировки жилья.</p>
      
      <h3>Что мы предлагаем?</h3>
      <p>РемонтПроводник - это комплексная платформа, которая поможет вам:</p>
      <ul>
        <li><strong>Планировать ремонт</strong> - используйте наш 3D планировщик для визуализации будущего интерьера</li>
        <li><strong>Согласовывать документы</strong> - получайте помощь с оформлением всех необходимых документов для перепланировки</li>
        <li><strong>Выбирать мебель и товары</strong> - покупайте напрямую у производителей в нашем магазине</li>
        <li><strong>Находить мастеров</strong> - получайте рекомендации проверенных специалистов</li>
        <li><strong>Получать консультации</strong> - общайтесь с нашим AI-ассистентом и экспертами</li>
      </ul>
      
      <h3>Наши преимущества</h3>
      <p>Мы понимаем, что ремонт - это сложный процесс, требующий много времени и сил. Поэтому мы создали платформу, которая:</p>
      <ul>
        <li>Сопровождает вас на каждом этапе</li>
        <li>Помогает с бюрократией и документами</li>
        <li>Экономит ваше время и деньги</li>
        <li>Предоставляет доступ к проверенным специалистам</li>
      </ul>
      
      <h3>Что дальше?</h3>
      <p>Начните свой путь к идеальному ремонту уже сегодня! Зарегистрируйтесь на платформе и получите доступ ко всем нашим инструментам и услугам.</p>
      <p>Мы постоянно работаем над улучшением платформы и добавлением новых функций. Следите за нашими обновлениями!</p>
    `,
    date: "15 января 2025",
    author: "Команда РемонтПроводник",
    category: "Новости"
  },
  {
    id: 2,
    title: "Новый 3D планировщик интерьеров",
    excerpt: "Представляем обновленный 3D планировщик с расширенными возможностями визуализации и планирования пространства.",
    content: `
      <h2>Новый 3D планировщик интерьеров</h2>
      <p>Мы рады представить обновленную версию нашего 3D планировщика интерьеров с множеством новых возможностей!</p>
      
      <h3>Что нового?</h3>
      <ul>
        <li><strong>Улучшенная графика</strong> - более реалистичная визуализация интерьеров</li>
        <li><strong>Расширенная библиотека мебели</strong> - более 1000 моделей мебели и предметов интерьера</li>
        <li><strong>Новые инструменты измерения</strong> - точные расчеты площадей и объемов</li>
        <li><strong>Экспорт в различные форматы</strong> - сохраняйте свои проекты в PDF, PNG и других форматах</li>
        <li><strong>Совместная работа</strong> - приглашайте дизайнеров и консультантов к работе над проектом</li>
      </ul>
      
      <h3>Как использовать?</h3>
      <p>Планировщик доступен всем зарегистрированным пользователям. Просто перейдите в раздел "Планировщик" и начните создавать свой проект!</p>
      
      <h3>Советы для начинающих</h3>
      <ul>
        <li>Начните с загрузки плана вашей квартиры</li>
        <li>Используйте инструменты для расстановки стен и перегородок</li>
        <li>Добавляйте мебель из библиотеки</li>
        <li>Экспериментируйте с цветами и материалами</li>
        <li>Сохраняйте несколько вариантов планировки для сравнения</li>
      </ul>
    `,
    date: "20 января 2025",
    author: "Команда разработки",
    category: "Обновления"
  },
  {
    id: 3,
    title: "Помощь с согласованием перепланировки",
    excerpt: "Теперь мы помогаем с полным циклом согласования перепланировки в БТИ и жилинспекции.",
    content: `
      <h2>Помощь с согласованием перепланировки</h2>
      <p>Одним из самых сложных этапов ремонта является согласование перепланировки. Мы решили упростить этот процесс для вас!</p>
      
      <h3>Что мы делаем?</h3>
      <p>Наша команда специалистов поможет вам:</p>
      <ul>
        <li><strong>Подготовить документы</strong> - соберем все необходимые справки и документы</li>
        <li><strong>Составить техническое заключение</strong> - наши инженеры подготовят все необходимые расчеты</li>
        <li><strong>Подать документы в БТИ</strong> - сопроводим весь процесс подачи документов</li>
        <li><strong>Согласовать в жилинспекции</strong> - поможем пройти все проверки и согласования</li>
        <li><strong>Получить разрешение</strong> - доведем процесс до получения официального разрешения</li>
      </ul>
      
      <h3>Почему это важно?</h3>
      <p>Несогласованная перепланировка может привести к серьезным проблемам:</p>
      <ul>
        <li>Штрафы от контролирующих органов</li>
        <li>Проблемы при продаже квартиры</li>
        <li>Требования вернуть все в исходное состояние</li>
        <li>Сложности с получением кредитов и ипотеки</li>
      </ul>
      
      <h3>Как начать?</h3>
      <p>Свяжитесь с нами через форму обратной связи или по телефону, и мы проконсультируем вас по всем вопросам согласования перепланировки.</p>
    `,
    date: "25 января 2025",
    author: "Юридический отдел",
    category: "Услуги"
  },
  {
    id: 4,
    title: "Открытие магазина товаров для ремонта",
    excerpt: "Теперь вы можете покупать мебель, посуду, текстиль и другие товары для дома напрямую у производителей.",
    content: `
      <h2>Открытие магазина товаров для ремонта</h2>
      <p>Мы рады объявить об открытии нашего магазина товаров для ремонта и обустройства дома!</p>
      
      <h3>Что мы предлагаем?</h3>
      <p>В нашем магазине вы найдете:</p>
      <ul>
        <li><strong>Мебель</strong> - от производителей с гарантией качества</li>
        <li><strong>Посуда и кухонная утварь</strong> - широкий ассортимент для вашей кухни</li>
        <li><strong>Текстиль</strong> - шторы, постельное белье, ковры и многое другое</li>
        <li><strong>Освещение</strong> - люстры, бра, светильники различных стилей</li>
        <li><strong>Декор</strong> - картины, вазы, статуэтки и другие элементы декора</li>
        <li><strong>Техника</strong> - бытовая техника от проверенных брендов</li>
        <li><strong>Сантехника</strong> - все для ванной комнаты и кухни</li>
        <li><strong>Стройматериалы</strong> - краски, обои, плитка и многое другое</li>
      </ul>
      
      <h3>Наши преимущества</h3>
      <ul>
        <li>Прямые поставки от производителей - без наценок посредников</li>
        <li>Гарантия качества на все товары</li>
        <li>Быстрая доставка по всей России</li>
        <li>Удобная система фильтрации и поиска</li>
        <li>Отзывы и рейтинги от других покупателей</li>
      </ul>
      
      <h3>Специальное предложение</h3>
      <p>В честь открытия магазина мы дарим скидку 10% на первый заказ всем новым покупателям! Используйте промокод WELCOME10 при оформлении заказа.</p>
    `,
    date: "1 февраля 2025",
    author: "Команда магазина",
    category: "Новости"
  },
  {
    id: 5,
    title: "AI-ассистент для консультаций",
    excerpt: "Запущен интеллектуальный помощник, который поможет вам с вопросами по ремонту, планировке и выбору материалов.",
    content: `
      <h2>AI-ассистент для консультаций</h2>
      <p>Мы запустили интеллектуального помощника, который готов ответить на все ваши вопросы о ремонте и перепланировке!</p>
      
      <h3>Что умеет наш AI-ассистент?</h3>
      <ul>
        <li><strong>Консультации по планировке</strong> - поможет спланировать оптимальное расположение комнат и мебели</li>
        <li><strong>Советы по выбору материалов</strong> - подскажет, какие материалы лучше использовать для вашего проекта</li>
        <li><strong>Расчеты и оценки</strong> - поможет рассчитать необходимое количество материалов и примерную стоимость</li>
        <li><strong>Ответы на вопросы</strong> - ответит на любые вопросы о ремонте, согласовании и обустройстве</li>
        <li><strong>Рекомендации мастеров</strong> - подскажет, каких специалистов лучше привлечь для вашего проекта</li>
      </ul>
      
      <h3>Как использовать?</h3>
      <p>AI-ассистент доступен в разделе "Чат-бот". Просто начните диалог, задав свой вопрос, и получите подробный ответ с рекомендациями.</p>
      
      <h3>Преимущества</h3>
      <ul>
        <li>Доступен 24/7 - получайте консультации в любое время</li>
        <li>Быстрые ответы - не нужно ждать ответа специалиста</li>
        <li>Бесплатно - консультации доступны всем пользователям</li>
        <li>Постоянное обучение - ассистент становится умнее с каждым днем</li>
      </ul>
      
      <h3>Попробуйте прямо сейчас!</h3>
      <p>Перейдите в раздел "Чат-бот" и задайте свой первый вопрос нашему AI-ассистенту. Мы уверены, что он поможет вам найти ответы на все ваши вопросы!</p>
    `,
    date: "5 февраля 2025",
    author: "Команда разработки",
    category: "Обновления"
  }
];

export default function Articles() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const openArticle = (article: Article) => {
    setSelectedArticle(article);
    document.body.style.overflow = 'hidden';
  };

  const closeArticle = () => {
    setSelectedArticle(null);
    document.body.style.overflow = 'unset';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Новости":
        return "bg-green-500/20 text-green-400";
      case "Обновления":
        return "bg-blue-500/20 text-blue-400";
      case "Услуги":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <>
      <section className="relative bg-[#0B0F19] text-white overflow-hidden min-h-screen">
        {/* Top green blurred shapes */}
        <div
          aria-hidden="true"
          className="absolute inset-0 transform-gpu overflow-hidden blur-3xl pointer-events-none"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="absolute left-1/2 top-0 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/4 rotate-[30deg] bg-gradient-to-tr from-[#86efac] to-[#4ade80] opacity-30"
          ></div>
        </div>

        <div className="container mx-auto px-6 py-32 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-block mb-6 px-4 py-1 rounded-full bg-[rgba(0,255,100,0.1)] text-green-400 text-sm font-medium">
                Новости и статьи
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Статьи РемонтПроводник
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                Читайте последние новости о нашем сервисе, обновлениях и полезные советы по ремонту
              </p>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => openArticle(article)}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-green-400/50 transition-all hover:shadow-xl hover:shadow-green-500/10 cursor-pointer group flex flex-col"
                >
                  {/* Article Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                      <span className="text-gray-400 text-xs">{article.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-green-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Article Footer */}
                  <div className="p-6 pt-0 mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">{article.author}</span>
                      <div className="flex items-center gap-2 text-green-400 text-sm font-medium group-hover:gap-3 transition-all">
                        <span>Читать</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom green blurred shapes */}
        <div
          aria-hidden="true"
          className="absolute inset-0 transform-gpu overflow-hidden blur-3xl pointer-events-none"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="absolute left-1/2 bottom-0 w-[300%] h-[300%] -translate-x-1/2 translate-y-1/4 rotate-[-30deg] bg-gradient-to-tr from-[#86efac] to-[#4ade80] opacity-30"
          ></div>
        </div>
      </section>

      {/* Article Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={closeArticle}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>

          {/* Modal Content */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-[#0B0F19] rounded-2xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedArticle.category)}`}>
                        {selectedArticle.category}
                      </span>
                      <span className="text-gray-400 text-xs">{selectedArticle.date}</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-2 text-white">{selectedArticle.title}</h2>
                    <p className="text-gray-400 text-sm">Автор: {selectedArticle.author}</p>
                  </div>
                  <button
                    onClick={closeArticle}
                    className="ml-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={closeArticle}
                  className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold"
                >
                  Закрыть
                </button>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {selectedArticle.author}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

