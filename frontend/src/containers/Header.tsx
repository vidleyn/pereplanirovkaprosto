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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="text-white text-2xl font-semibold">РемонтПроводник</span>
          </Link>
        </div>

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
      </nav>
    </header>
  );
}
