// Type declarations for api.js

export interface User {
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  [key: string]: any;
}

export interface LoginResponse {
  token: string;
  user?: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface DashboardData {
  user?: User;
  [key: string]: any;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number | null;
  category: string;
  duration: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

export interface ChatResponse {
  response: string;
}

export const setToken: (token: string | null) => void;
export const getCurrentUser: () => User | null;

export interface AuthAPI {
  login: (username: string, password: string) => Promise<LoginResponse>;
  register: (userData: RegisterData) => Promise<any>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User>;
  getDashboard: () => Promise<DashboardData>;
}

export interface ServicesAPI {
  getServices: () => Promise<Service[]>;
}

export interface ShopAPI {
  getProducts: () => Promise<Product[]>;
}

export interface AIChatAPI {
  sendMessage: (sessionId: string, message: string) => Promise<ChatResponse>;
}

export interface FloorPlanAPI {
  checkHealth: () => Promise<boolean>;
}

export const authAPI: AuthAPI;
export const servicesAPI: ServicesAPI;
export const shopAPI: ShopAPI;
export const aiChatAPI: AIChatAPI;
export const floorPlanAPI: FloorPlanAPI;

