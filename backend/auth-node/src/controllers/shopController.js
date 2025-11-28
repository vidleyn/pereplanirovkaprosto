import { Product } from '../models/Product.js';
import pool from '../config/database.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (search) filters.search = search;

    const products = await Product.findAll(filters);
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Не удалось получить список товаров'
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Товар не найден'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Не удалось получить информацию о товаре'
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const query = 'SELECT DISTINCT category FROM products ORDER BY category';
    const result = await pool.query(query);
    const categories = result.rows.map(row => row.category);
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Не удалось получить список категорий'
    });
  }
};

