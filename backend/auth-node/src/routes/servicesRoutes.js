import express from 'express';
import { getServices, getServiceById, getCategories } from '../controllers/servicesController.js';

const router = express.Router();

// Получить все услуги (с фильтрами по категории и поиску)
router.get('/services', getServices);

// Получить услугу по ID
router.get('/services/:id', getServiceById);

// Получить список категорий
router.get('/categories', getCategories);

export default router;



