import express from 'express';
import { getProducts, getProductById, getCategories } from '../controllers/shopController.js';

const router = express.Router();

// Получить все товары (с фильтрами по категории и поиску)
router.get('/products', getProducts);

// Получить товар по ID
router.get('/products/:id', getProductById);

// Получить список категорий
router.get('/categories', getCategories);

export default router;

