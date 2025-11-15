import express from 'express';
import { createOrder, verifyPayment, getTransactionHistory } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create-order', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);
router.get('/history', authMiddleware, getTransactionHistory);

export default router;
