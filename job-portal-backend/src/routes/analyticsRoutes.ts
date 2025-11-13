import express from 'express';
import { employerStats } from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/employer', authMiddleware, roleMiddleware('employer'), employerStats);

export default router;
