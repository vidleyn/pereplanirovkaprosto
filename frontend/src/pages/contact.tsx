import { ContactCard } from './components/ContactCard';
import { ContactHero } from './components/ContactHero';

export default function Contacts() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ContactHero />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-16">
            <div className="inline-block bg-orange-500 text-white px-4 py-1 mb-4 transform -rotate-1">
              <span>Онлайн-сервис</span>
            </div>
            <h1 className="mb-4 text-slate-900">Team X1</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Помогаем с перепланировкой квартир онлайн. 
              Оформляем все документы законно и без проблем с надзорными органами.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <ContactCard
              icon="phone"
              title="Телефон"
              value="+7 995 264 46 27"
              href="tel:+79952644627"
              description="Звоните с 9:00 до 21:00"
            />
            <ContactCard
              icon="mail"
              title="Email"
              value="edcftiz2@gmail.com"
              href="mailto:edcftiz2@gmail.com"
              description="Ответим в течение 24 часов"
            />
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white p-6 border-l-4 border-orange-500 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-slate-900">Документы</h3>
              <p className="text-slate-600 text-sm">Подготовка и оформление всех необходимых документов</p>
            </div>

            <div className="bg-white p-6 border-l-4 border-blue-500 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2 text-slate-900">Согласование</h3>
              <p className="text-slate-600 text-sm">Законное согласование перепланировки в БТИ и жилинспекции</p>
            </div>

            <div className="bg-white p-6 border-l-4 border-green-500 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-slate-900">Онлайн-консультация</h3>
              <p className="text-slate-600 text-sm">Удаленная помощь на всех этапах перепланировки</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-8 md:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`
              }}></div>
            </div>
            <div className="relative z-10">
              <h2 className="mb-4 text-white">Планируете перепланировку?</h2>
              <p className="mb-6 text-orange-50 max-w-2xl mx-auto">
                Получите бесплатную консультацию по законному оформлению перепланировки вашей квартиры
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+79952644627"
                  className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Позвонить сейчас
                </a>
                <a 
                  href="mailto:edcftiz2@gmail.com"
                  className="inline-block bg-orange-700 text-white px-8 py-3 rounded-lg hover:bg-orange-800 transition-colors"
                >
                  Написать email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Team X1. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
