import { Request, Response, NextFunction } from 'express';
import { razorpay } from '../utils/payment';
import Transaction from '../models/Transaction';
import Job from '../models/Job';
import crypto from 'crypto';
import mongoose from 'mongoose'; 
import { IUserDocument } from '../models/User'; 
import dotenv from 'dotenv';


dotenv.config();

interface AuthRequest extends Request {
  user?: IUserDocument;
}

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'employer') {
    return res.status(403).json({ success: false, message: 'Forbidden: Only employers can create payment orders' });
  }

  try {
    const { amount, currency = 'INR', jobId } = req.body;
    const employerId = req.user._id;

    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    if (jobId && !mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }

    const razorpayAmount = Math.round(numericAmount * 100);
    const rece = `rcpt_${employerId}_${Date.now().toString().slice(-6)}` 
    console.log("employerid",rece.length);
    
    const options = {
      amount: razorpayAmount,
      currency,
      receipt: `rcpt_${employerId}_${Date.now().toString().slice(-6)}`, 
      payment_capture: 1 
    };
    
    const order = await razorpay.orders.create(options);

    
    const txn = new Transaction({
      employer: employerId,
      job: jobId || null, 
      amount: numericAmount, 
      currency,
      provider: 'razorpay',
      providerOrderId: order.id,
      status: 'created',
      meta: { order }
    });
    await txn.save();

    // 200 OK
    res.status(200).json({ 
      success: true, 
      order, 
      transactionId: txn._id, 
      keyId: process.env.RAZORPAY_KEY_ID 
    });
  } catch (err) {
    
    next(err);
    console.log(err);
    
  }
};


export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;

    
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
        const error = new Error('RAZORPAY_KEY_SECRET is not configured for signature verification.');
        return next(error); 
    }

   
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !transactionId) {
        return res.status(400).json({ success: false, message: 'Missing required payment verification fields' });
    }

    const generated_signature = crypto.createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      
      return res.status(400).json({ success: false, message: 'Invalid signature. Payment verification failed.' });
    }
    
    
    const txn = await Transaction.findById(transactionId);
    if (!txn) {
     
      return res.status(404).json({ success: false, message: 'Transaction record not found' });
    }

    
    if (txn.status === 'paid') {
      return res.status(200).json({ success: true, message: 'Payment already verified', transaction: txn });
    }

  
    if (txn.providerOrderId !== razorpay_order_id) {
        return res.status(400).json({ success: false, message: 'Order ID mismatch for this transaction record.' });
    }

    
    txn.providerPaymentId = razorpay_payment_id;
    txn.status = 'paid';
    await txn.save(); 
    if (txn.job) {
      const job = await Job.findById(txn.job);
      if (job) {
        
        if (req.user && job.postedBy.toString() !== txn.employer.toString()) {
            console.warn(`Auth mismatch: User ${req.user._id} attempting to verify payment for Job ${job.id}`);
        }
        
        job.isPremium = true;
        job.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
        await job.save();
      } else {
         console.warn(`Job ${txn.job} not found for transaction ${txn._id}. Job promotion skipped.`);
      }
    }

    // 200 OK
    res.status(200).json({ success: true, message: 'Payment successfully verified and processed', transaction: txn });
  } catch (err) {
    
    console.log(err);
    
    next(err);
  }
};


export const getTransactionHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  
  if (!req.user || req.user.role !== 'employer') {
    return res.status(403).json({ success: false, message: 'Forbidden: Access restricted to employers' });
  }
  
  try {
    
    const transactions = await Transaction.find({ employer: req.user._id })
        .sort({ createdAt: -1 })
        .populate('job', 'title'); 
        
    // 200 OK
    res.status(200).json({ success: true, transactions });
  } catch (err) {
    
    next(err);
  }
};