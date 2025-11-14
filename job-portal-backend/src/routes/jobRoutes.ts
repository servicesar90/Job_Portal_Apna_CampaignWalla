import express from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob } from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/allJobs', getJobs);
router.get('/jobById/:id', getJobById);

router.post('/', authMiddleware, roleMiddleware('employer'), createJob);
router.put('/updateJob/:id', authMiddleware, roleMiddleware('employer'), updateJob);
router.delete('/deleteJob/:id', authMiddleware, roleMiddleware('employer'), deleteJob);

export default router;
