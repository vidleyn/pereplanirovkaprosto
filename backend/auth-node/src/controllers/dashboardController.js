import { User } from '../models/User.js';

export class DashboardController {
  static async getDashboard(req, res) {
    try {
      const username = req.userDetails.username;
      const user = await User.findByUsername(username);

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Данные пользователя получены',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          active: user.active,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Ошибка при получении данных'
      });
    }
  }
}

