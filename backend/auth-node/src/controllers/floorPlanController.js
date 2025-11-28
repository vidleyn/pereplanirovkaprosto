import { FloorApiClient } from '../services/floorApiClient.js';

const floorApiClient = new FloorApiClient();

export class FloorPlanController {
  static async checkHealth(req, res) {
    try {
      const healthy = await floorApiClient.isHealthy();
      
      if (healthy) {
        return res.status(200).json({});
      } else {
        return res.status(503).json({});
      }
    } catch (error) {
      return res.status(503).json({});
    }
  }

  static async analyzeFloorPlan(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'Файл не может быть пустым'
        });
      }

      const contentType = req.file.mimetype;
      if (!contentType || !contentType.startsWith('image/')) {
        return res.status(400).json({
          status: 'error',
          message: 'Файл должен быть изображением (JPG, PNG)'
        });
      }

      console.log('Получен запрос на анализ планировки:', req.file.originalname);

      const response = await floorApiClient.analyzeFloorPlan(req.file);

      console.log('Анализ завершен. Комнат:', response.statistics?.rooms,
        ', Стен:', response.statistics?.walls,
        ', Углов:', response.statistics?.corners);

      return res.status(200).json({
        status: response.status,
        blueprint3d: response.blueprint3d,
        statistics: response.statistics
      });
    } catch (error) {
      console.error('Ошибка при анализе:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Ошибка при анализе планировки: ' + error.message
      });
    }
  }
}

