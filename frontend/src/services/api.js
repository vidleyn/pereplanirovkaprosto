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

// AI Chat API
const AI_CHAT_URL = import.meta.env.VITE_AI_CHAT_URL || 'http://localhost:3004';

export const aiChatAPI = {
  // Отправка сообщения в AI чат
  sendMessage: async (sessionId, message) => {
    const response = await fetch(`${AI_CHAT_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Ошибка при отправке сообщения' }));
      throw new Error(error.detail || error.message || 'Ошибка при отправке сообщения');
    }

    return await response.json();
  },

  // Проверка здоровья AI сервиса
  checkHealth: async () => {
    try {
      const response = await fetch(`${AI_CHAT_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};

// Shop API
export const shopAPI = {
  // Получить все товары
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);

    const response = await fetch(`${API_BASE_URL}/api/shop/products?${params.toString()}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка при загрузке товаров' }));
      throw new Error(error.message || 'Ошибка при загрузке товаров');
    }

    const result = await response.json();
    return result.data || [];
  },

  // Получить товар по ID
  getProductById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/shop/products/${id}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Товар не найден' }));
      throw new Error(error.message || 'Товар не найден');
    }

    const result = await response.json();
    return result.data;
  },

  // Получить список категорий
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/api/shop/categories`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка при загрузке категорий' }));
      throw new Error(error.message || 'Ошибка при загрузке категорий');
    }

    const result = await response.json();
    return result.data || [];
  },
};

// Services API
export const servicesAPI = {
  // Получить все услуги
  getServices: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);

    const response = await fetch(`${API_BASE_URL}/api/services/services?${params.toString()}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка при загрузке услуг' }));
      throw new Error(error.message || 'Ошибка при загрузке услуг');
    }

    const result = await response.json();
    return result.data || [];
  },

  // Получить услугу по ID
  getServiceById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/services/services/${id}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Услуга не найдена' }));
      throw new Error(error.message || 'Услуга не найдена');
    }

    const result = await response.json();
    return result.data;
  },

  // Получить список категорий
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/api/services/categories`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка при загрузке категорий' }));
      throw new Error(error.message || 'Ошибка при загрузке категорий');
    }

    const result = await response.json();
    return result.data || [];
  },
};

