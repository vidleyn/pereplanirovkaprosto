import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";

// --- Login Page ---
export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Перенаправление если уже авторизован
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      await login(data.username, data.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-[#0B0F19] text-white overflow-hidden min-h-screen flex items-center justify-center p-4">
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

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-[rgba(0,255,100,0.1)] text-green-400 text-sm font-medium">
              Добро пожаловать
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">Вход в РемонтПроводник</h2>
            <p className="text-gray-400 text-sm">Войдите в свой аккаунт для продолжения</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">Логин</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                placeholder="Введите логин"
                {...register("username", { required: "Введите логин" })}
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">Пароль</label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                placeholder="Введите пароль"
                {...register("password", { required: "Введите пароль" })}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Вход...
                </span>
              ) : (
                "Войти"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Нет аккаунта?{" "}
              <Link to="/register" className="text-green-400 hover:text-green-300 font-semibold transition">
                Зарегистрируйтесь
              </Link>
            </p>
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
  );
}

// --- Register Page ---
export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Перенаправление если уже авторизован
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Ошибка при регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-[#0B0F19] text-white overflow-hidden min-h-screen flex items-center justify-center p-4">
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

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-[rgba(0,255,100,0.1)] text-green-400 text-sm font-medium">
              Создание аккаунта
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">
              Регистрация в РемонтПроводник
            </h2>
            <p className="text-gray-400 text-sm">Создайте аккаунт и начните планировать ремонт</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Имя пользователя *</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  placeholder="Введите логин"
                  {...register("username", {
                    required: "Введите имя пользователя",
                  })}
                />
                {errors.username && (
                  <p className="text-red-400 text-sm mt-2">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Email *</label>
                <input
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  placeholder="example@mail.com"
                  {...register("email", { required: "Введите email" })}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">Пароль *</label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                placeholder="Введите пароль"
                {...register("password", { required: "Введите пароль" })}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-2">{errors.password.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Имя</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  placeholder="Ваше имя"
                  {...register("firstName")}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Фамилия</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  placeholder="Ваша фамилия"
                  {...register("lastName")}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Регистрация...
                </span>
              ) : (
                "Зарегистрироваться"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold transition">
                Войдите
              </Link>
            </p>
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
  );
}

// --- Dashboard (simple version) ---
export function Dashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = React.useState(null);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { authAPI } = await import("../services/api");
        const data = await authAPI.getDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <section className="relative bg-[#0B0F19] text-white overflow-hidden min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <p className="mt-4 text-gray-300">Загрузка...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const userData = dashboardData?.user || user;

  return (
    <section className="relative bg-[#0B0F19] text-white overflow-hidden min-h-screen">
      {/* Top green blurred shapes */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#86efac] to-[#4ade80] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
        ></div>
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-block mb-6 px-4 py-1 rounded-full bg-[rgba(0,255,100,0.1)] text-green-400 text-sm font-medium">
              Личный кабинет
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4">
              Добро пожаловать, {userData.firstName || userData.first_name || userData.username || "Пользователь"}!
            </h1>
            <p className="text-gray-300 text-lg">
              Управляйте своим профилем и настройками
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-3xl font-bold">
                {(userData.firstName || userData.first_name || userData.username || "U")[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-1">
                  {userData.firstName || userData.first_name || ""} {userData.lastName || userData.last_name || ""}
                </h2>
                <p className="text-gray-400">@{userData.username || user.username}</p>
              </div>
            </div>

            {/* User Info Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm text-gray-400 uppercase tracking-wide">Email</span>
                </div>
                <p className="text-lg font-medium">{userData.email || "Не указан"}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-400 uppercase tracking-wide">Имя пользователя</span>
                </div>
                <p className="text-lg font-medium">{userData.username || user.username}</p>
              </div>

              {userData.firstName || userData.first_name ? (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-sm text-gray-400 uppercase tracking-wide">Имя</span>
                  </div>
                  <p className="text-lg font-medium">{userData.firstName || userData.first_name}</p>
                </div>
              ) : null}

              {userData.lastName || userData.last_name ? (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-sm text-gray-400 uppercase tracking-wide">Фамилия</span>
                  </div>
                  <p className="text-lg font-medium">{userData.lastName || userData.last_name}</p>
                </div>
              ) : null}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
              <Link
                to="/planner"
                className="rounded-md bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-green-400 transition"
              >
                Перейти в планировщик
              </Link>
              <Link
                to="/floorplan-analyzer"
                className="flex items-center gap-2 rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition backdrop-blur-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                Анализ планировки
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-md bg-red-500/20 px-6 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/30 transition border border-red-500/30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm8 4a1 1 0 10-2 0v4a1 1 0 102 0V7zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom green blurred shapes */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] pointer-events-none"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-[#86efac] to-[#4ade80] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72rem]"
        ></div>
      </div>
    </section>
  );
}
