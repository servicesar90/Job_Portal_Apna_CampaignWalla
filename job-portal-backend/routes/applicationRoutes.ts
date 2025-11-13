import express from 'express';
import {
  applyForJob,
  getCandidateApplications,
  getEmployerApplications,
  updateApplicationStatus,
  withdrawApplication
} from '../controllers/applicationController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = express.Router();

router.post('/apply/:jobId', authMiddleware, roleMiddleware('candidate'), applyForJob);
router.get('/me', authMiddleware, roleMiddleware('candidate'), getCandidateApplications);
router.get('/employer', authMiddleware, roleMiddleware('employer'), getEmployerApplications);
router.put('/:id/status', authMiddleware, roleMiddleware('employer'), updateApplicationStatus);
router.put('/:id/withdraw', authMiddleware, roleMiddleware('candidate'), withdrawApplication);

export default router;
