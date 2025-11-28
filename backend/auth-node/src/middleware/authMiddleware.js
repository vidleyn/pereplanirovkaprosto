import { JwtService } from '../services/jwtService.js';
import { User } from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Токен не предоставлен'
      });
    }

    const token = authHeader.substring(7);

    if (!token || token.trim().length === 0) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Токен не предоставлен'
      });
    }

    try {
      const decoded = JwtService.verifyToken(token);
      const user = await User.findByUsername(decoded.username);

      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Пользователь не найден'
        });
      }

      if (!user.active) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Пользователь неактивен'
        });
      }

      req.user = user;
      req.userDetails = {
        username: user.username,
        role: user.role,
        authorities: [`ROLE_${user.role}`]
      };

      next();
    } catch (error) {
      if (error.message === 'Token expired') {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Токен просрочен'
        });
      } else if (error.message === 'Invalid token format') {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Неверный формат токена'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Ошибка при проверке токена'
    });
  }
};

