import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { useForm } from "react-hook-form";

// --- Login Page ---
export function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const form = new FormData();
    form.append("username", data.username);
    form.append("password", data.password);

    const res = await fetch("/auth/login", {
      method: "POST",
      body: form,
      credentials: "include",
    });

    if (res.ok) navigate("/dashboard");
    else alert("Неверный логин или пароль");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Вход в CRM</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Логин</label>
            <input
              className="w-full border px-3 py-2 rounded-lg"
              {...register("username", { required: "Введите логин" })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Пароль</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-lg"
              {...register("password", { required: "Введите пароль" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Войти
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/register" className="text-blue-600">
            Нет аккаунта? Зарегистрируйтесь
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- Register Page ---
export function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) navigate("/login");
    else alert("Ошибка при регистрации");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Регистрация в CRM
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Имя пользователя *</label>
            <input
              className="w-full border px-3 py-2 rounded-lg"
              {...register("username", {
                required: "Введите имя пользователя",
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Email *</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded-lg"
              {...register("email", { required: "Введите email" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Пароль *</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-lg"
              {...register("password", { required: "Введите пароль" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Имя</label>
            <input
              className="w-full border px-3 py-2 rounded-lg"
              {...register("firstName")}
            />
          </div>

          <div>
            <label className="block mb-1">Фамилия</label>
            <input
              className="w-full border px-3 py-2 rounded-lg"
              {...register("lastName")}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Зарегистрироваться
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600">
            Уже есть аккаунт? Войдите
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- Dashboard (simple version) ---
export function Dashboard() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/user/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Личный кабинет</h2>

        {!user ? (
          <p className="text-gray-500">Данные не доступны</p>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Имя пользователя:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "Не указан"}
            </p>
            <p>
              <strong>Имя:</strong> {user.firstName || "Не указано"}
            </p>
          </div>
        )}

        <Link to="/login" className="inline-block mt-4 text-red-600">
          Выйти
        </Link>
      </div>
    </div>
  );
}
