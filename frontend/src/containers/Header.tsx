import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { label: "Планировщик", href: "/planner" },
  { label: "Справочник", href: "/documentation" },
  { label: "Услуги", href: "/services" },
  { label: "Магазин", href: "/shop" },
  { label: "Статьи", href: "/articles" },
  { label: "Чат-бот", href: "/chatbot" },
  { label: "Контакты", href: "/contact" },
];

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
            <span className="text-white text-2xl font-semibold">РемонтПроводник</span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-semibold text-white hover:text-green-400 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition backdrop-blur-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                {user?.username || "Профиль"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-white hover:text-green-400 transition"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-white hover:text-green-400 transition">
                Войти →
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-green-400 transition"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-6 pt-2 pb-6 space-y-1 bg-[#0B0F19]/95 backdrop-blur-md border-t border-white/10">
            {/* Navigation items */}
            <div className="space-y-1 py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block px-3 py-2 text-base font-semibold text-white hover:text-green-400 hover:bg-white/5 rounded-md transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Auth section */}
            <div className="pt-4 border-t border-white/10">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-md bg-white/10 text-sm font-semibold text-white hover:bg-white/20 transition backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {user?.username || "Профиль"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm font-semibold text-white hover:text-green-400 transition"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-semibold text-white hover:text-green-400 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Войти →
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-green-400 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
