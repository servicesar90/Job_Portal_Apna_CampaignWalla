import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

let razorpayInstance: Razorpay;

try {
 
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
   
    const configError = new Error('Razorpay API keys (RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET) are not defined in environment variables.');
    console.error('SERVER CONFIG ERROR:', configError.message);
    throw configError;
  }

 
  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });

} catch (err) {
  
  console.error('RAZORPAY INITIALIZATION FAILED:', err);
  
  throw err;
}

export const razorpay = razorpayInstance;