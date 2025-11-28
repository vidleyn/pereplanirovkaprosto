import bcrypt from 'bcrypt';
import { User, Role } from '../models/User.js';
import { JwtService } from './jwtService.js';

export class AuthService {
  static async registerUser(registerData) {
    const { username, email, password, firstName, lastName } = registerData;

    // Проверка существования пользователя
    if (await User.existsByUsername(username)) {
      throw new Error('Пользователь с таким именем уже существует');
    }

    if (await User.existsByEmail(email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: Role.USER
    });

    return {
      message: 'Регистрация прошла успешно! Теперь вы можете войти в систему.',
      username: user.username
    };
  }

  static async loginUser(loginData) {
    const { username, password } = loginData;

    // Поиск пользователя
    const user = await User.findByUsername(username);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Неверный пароль');
    }

    // Проверка активности
    if (!user.active) {
      throw new Error('Пользователь в оффлайне');
    }

    // Генерация токена
    const token = JwtService.generateToken(user);

    return {
      message: 'Вход выполнен успешно',
      token,
      username: user.username
    };
  }
}

