import { Link } from "react-router-dom";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthRequiredModal({ isOpen, onClose }: AuthRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#0B0F19] border border-white/20 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Закрыть"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            Требуется авторизация
          </h3>
          <p className="text-gray-300 mb-6">
            Эта функция доступна только для авторизованных пользователей.
            Пожалуйста, войдите в систему или зарегистрируйтесь.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              onClick={onClose}
              className="rounded-md bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-green-400 transition text-center"
            >
              Войти
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition backdrop-blur-sm text-center"
            >
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


