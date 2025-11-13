import { Request, Response, NextFunction } from 'express';
import { razorpay } from '../utils/payment';
import Transaction from '../models/Transaction';
import Job from '../models/Job';
import crypto from 'crypto';
import mongoose from 'mongoose'; // Added for ObjectId validation
import { IUserDocument } from '../models/User'; // Assuming you have IUserDocument
import dotenv from 'dotenv';


dotenv.config();

// Define the custom Request type with the authenticated user object
interface AuthRequest extends Request {
  user?: IUserDocument;
}

// --- 1. Create Order Controller ---
export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Edge Case 1: Check for Authentication and Role (Only employer should pay)
  if (!req.user || req.user.role !== 'employer') {
    return res.status(403).json({ success: false, message: 'Forbidden: Only employers can create payment orders' });
  }

  try {
    const { amount, currency = 'INR', jobId } = req.body;
    const employerId = req.user._id;

    // Edge Case 2: Amount Validation (Client-side validation required, but server defense is crucial)
    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    // Edge Case 3: Job ID Validation (If provided)
    if (jobId && !mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }

    // Razorpay requires amount in smallest unit (e.g., paise for INR)
    const razorpayAmount = Math.round(numericAmount * 100); 

    const options = {
      amount: razorpayAmount,
      currency,
      receipt: `rcpt_${employerId}_${Date.now()}`, // More robust receipt ID
      payment_capture: 1 // Automatically capture the payment
    };
    
    // Edge Case 4: Razorpay API Failure (e.g., connectivity, rate limiting)
    const order = await razorpay.orders.create(options);

    // Edge Case 5: Transaction integrity (Ensure all data is saved)
    const txn = new Transaction({
      employer: employerId,
      job: jobId || null, // Handle case where payment is for something else (e.g., wallet top-up)
      amount: numericAmount, // Store actual amount, not in smallest unit
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
    // Delegates Razorpay API errors (which should be 500) or DB errors
    next(err);
  }
};

// --- 2. Verify Payment Controller ---
export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;

    // Edge Case 1: Configuration Check (CRITICAL)
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
        // This is a server failure, but since we are verifying a payment, 
        // we must not proceed.
        const error = new Error('RAZORPAY_KEY_SECRET is not configured for signature verification.');
        return next(error); // Delegate 500
    }

    // Edge Case 2: Required fields check
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !transactionId) {
        return res.status(400).json({ success: false, message: 'Missing required payment verification fields' });
    }

    // Edge Case 3: Signature Verification
    const generated_signature = crypto.createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      // 400 Bad Request: Security failure—the payment data may be tampered with.
      return res.status(400).json({ success: false, message: 'Invalid signature. Payment verification failed.' });
    }
    
    // Edge Case 4: Transaction Not Found
    const txn = await Transaction.findById(transactionId);
    if (!txn) {
      // This is a verification/logic failure.
      return res.status(404).json({ success: false, message: 'Transaction record not found' });
    }

    // Edge Case 5: Prevent re-processing paid transaction
    if (txn.status === 'paid') {
      return res.status(200).json({ success: true, message: 'Payment already verified', transaction: txn });
    }

    // Edge Case 6: Check Order ID match
    if (txn.providerOrderId !== razorpay_order_id) {
        return res.status(400).json({ success: false, message: 'Order ID mismatch for this transaction record.' });
    }

    // --- Critical Update Block ---
    txn.providerPaymentId = razorpay_payment_id;
    txn.status = 'paid';
    await txn.save(); // Delegate DB error to catch

    // Edge Case 7: Job Update (Promote to Premium)
    if (txn.job) {
      const job = await Job.findById(txn.job);
      if (job) {
        // Edge Case 8: Authorization check (optional, but good practice)
        // If the route doesn't require auth, ensure the job belongs to the transaction's employer
        if (req.user && job.postedBy.toString() !== txn.employer.toString()) {
            console.warn(`Auth mismatch: User ${req.user._id} attempting to verify payment for Job ${job.id}`);
            // Still process the payment verification but log the attempt.
        }
        
        job.isPremium = true;
        // Set expiry date 30 days from now
        job.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
        await job.save();
      } else {
         console.warn(`Job ${txn.job} not found for transaction ${txn._id}. Job promotion skipped.`);
      }
    }

    // 200 OK
    res.status(200).json({ success: true, message: 'Payment successfully verified and processed', transaction: txn });
  } catch (err) {
    // Delegates DB errors (500) to global handler
    next(err);
  }
};

// --- 3. Get Transaction History Controller ---
export const getTransactionHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Edge Case 1: Check for Authentication and Role
  if (!req.user || req.user.role !== 'employer') {
    return res.status(403).json({ success: false, message: 'Forbidden: Access restricted to employers' });
  }
  
  try {
    // Only return transactions belonging to the authenticated user
    const transactions = await Transaction.find({ employer: req.user._id })
        .sort({ createdAt: -1 })
        .populate('job', 'title'); // Populate job title for context
        
    // 200 OK
    res.status(200).json({ success: true, transactions });
  } catch (err) {
    // Delegates DB errors (500) to global handler
    next(err);
  }
};