import express from 'express';
import multer from 'multer';
import { FloorPlanController } from '../controllers/floorPlanController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Настройка multer для загрузки файлов
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

router.get('/health', FloorPlanController.checkHealth);
router.post('/analyze', authenticateToken, upload.single('file'), FloorPlanController.analyzeFloorPlan);

export default router;

