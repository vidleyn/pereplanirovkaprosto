import { AuthService } from '../services/authService.js';
import { JwtService } from '../services/jwtService.js';
import { User } from '../models/User.js';

export class AuthController {
  static async register(req, res) {
    try {
      console.log('Register request body:', req.body);
      const response = await AuthService.registerUser(req.body);
      return res.status(200).json(response);
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Ошибка при регистрации'
      });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({
          error: 'Неверное имя пользователя или пароль'
        });
      }

      const result = await AuthService.loginUser({ username, password });

      return res.status(200).json({
        message: result.message,
        token: result.token,
        username: result.username
      });
    } catch (error) {
      if (error.message === 'Пользователь не найден' || error.message === 'Неверный пароль') {
        return res.status(401).json({
          error: 'Неверное имя пользователя или пароль'
        });
      }
      console.error('Ошибка при входе:', error);
      return res.status(500).json({
        error: 'Произошла ошибка при входе: ' + error.message
      });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      if (!req.userDetails) {
        return res.status(401).json({
          status: 'error',
          message: 'Не авторизован'
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Данные пользователя получены',
        username: req.userDetails.username,
        roles: req.userDetails.authorities,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Ошибка при получении данных пользователя'
      });
    }
  }

  static async logout(req, res) {
    return res.status(200).json({
      status: 'success',
      message: 'Выход выполнен успешно'
    });
  }
}

