import express from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob } from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);

router.post('/', authMiddleware, roleMiddleware('employer'), createJob);
router.put('/:id', authMiddleware, roleMiddleware('employer'), updateJob);
router.delete('/:id', authMiddleware, roleMiddleware('employer'), deleteJob);

export default router;
