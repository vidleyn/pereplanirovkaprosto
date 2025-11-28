import axios from 'axios';
import FormData from 'form-data';

export class FloorApiClient {
  constructor() {
    this.apiBaseUrl = process.env.FLOORPLAN_API_URL || 'http://localhost:8000';
  }

  async isHealthy() {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/health`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async analyzeFloorPlan(file) {
    if (!await this.isHealthy()) {
      throw new Error('Сервис недоступен');
    }

    try {
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
      });

      const response = await axios.post(
        `${this.apiBaseUrl}/analyze`,
        formData,
        {
          headers: {
            ...formData.getHeaders()
          },
          timeout: 60000
        }
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Ошибка связи с сервисом анализа: ${error.response.data?.message || error.message}`);
      }
      throw new Error(`Ошибка связи с сервисом анализа: ${error.message}`);
    }
  }
}

