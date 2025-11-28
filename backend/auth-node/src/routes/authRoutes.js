import express from 'express';
import { body, validationResult } from 'express-validator';
import { AuthController } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({ 
      status: 'error',
      message: errorMessages,
      errors: errors.array()
    });
  }
  next();
};

// Регистрация
router.post(
  '/register',
  [
    body('username')
      .notEmpty().withMessage('Имя пользователя обязательно')
      .isLength({ min: 3, max: 50 }).withMessage('Имя пользователя должно быть от 3 до 50 символов'),
    body('email')
      .notEmpty().withMessage('Email обязателен')
      .isEmail().withMessage('Введите корректный email'),
    body('password')
      .notEmpty().withMessage('Пароль обязателен')
      .isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов')
  ],
  validate,
  AuthController.register
);

// Вход
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Имя пользователя обязательно'),
    body('password').notEmpty().withMessage('Пароль обязателен')
  ],
  validate,
  AuthController.login
);

// Получить текущего пользователя
router.get('/user', authenticateToken, AuthController.getCurrentUser);

// Выход
router.post('/logout', authenticateToken, AuthController.logout);

export default router;

