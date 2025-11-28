const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Получить токен из localStorage
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Сохранить токен
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Получить текущего пользователя
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};

// Базовый fetch с авторизацией
const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Токен невалиден, удаляем его
    setToken(null);
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
};

// API методы
export const authAPI = {
  // Регистрация
  register: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      // Обработка ошибок валидации
      if (result.errors && Array.isArray(result.errors)) {
        const errorMessages = result.errors.map(err => err.msg || err.message).join(', ');
        throw new Error(errorMessages);
      }
      throw new Error(result.message || result.error || 'Ошибка при регистрации');
    }

    return result;
  },

  // Вход
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Неверное имя пользователя или пароль');
    }

    // Сохраняем токен
    if (result.token) {
      setToken(result.token);
    }

    return result;
  },

  // Выход
  logout: async () => {
    const token = getToken();
    if (token) {
      try {
        await fetchWithAuth('/api/auth/logout', {
          method: 'POST',
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    setToken(null);
  },

  // Получить текущего пользователя
  getCurrentUser: async () => {
    const response = await fetchWithAuth('/api/auth/user');
    
    if (!response.ok) {
      throw new Error('Не удалось получить данные пользователя');
    }

    return await response.json();
  },

  // Получить данные dashboard
  getDashboard: async () => {
    const response = await fetchWithAuth('/dashboard');
    
    if (!response.ok) {
      throw new Error('Не удалось получить данные dashboard');
    }

    return await response.json();
  },
};

export const floorPlanAPI = {
  // Проверка здоровья сервиса
  checkHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/api/floorplan/health`);
    return response.ok;
  },

  // Анализ планировки
  analyze: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getToken();
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/floorplan/analyze`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка при анализе' }));
      throw new Error(error.message || 'Ошибка при анализе планировки');
    }

    return await response.json();
  },
};

