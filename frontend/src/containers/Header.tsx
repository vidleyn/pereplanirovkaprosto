const navItems = [
  { label: "Планировщик", href: "/planner" },
  { label: "Блог", href: "/blog" },
  { label: "Чат-бот", href: "/chatbot" },
  { label: "Контакты", href: "/contact" },
];

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="text-white text-2xl font-semibold">N-Planner</span>
          </a>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-white hover:text-green-400 transition"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-x-4">
          <a href="/login" className="text-sm font-semibold text-white hover:text-green-400">
            Войти →
          </a>
          <a
            href="/register"
            className="rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-green-400"
          >
            Регистрация
          </a>
        </div>
      </nav>
    </header>
  );
}
