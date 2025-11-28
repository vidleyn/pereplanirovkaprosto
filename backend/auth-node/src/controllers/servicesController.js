import { Service } from '../models/Service.js';
import pool from '../config/database.js';

export const getServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (search) filters.search = search;

    const services = await Service.findAll(filters);
    
    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Не удалось получить список услуг'
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Услуга не найдена'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Не удалось получить информацию об услуге'
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const query = 'SELECT DISTINCT category FROM services ORDER BY category';
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

