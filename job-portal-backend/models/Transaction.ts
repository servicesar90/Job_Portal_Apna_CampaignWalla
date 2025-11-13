import mongoose, { Document, Model, Schema } from 'mongoose';


//Interface of Transaction Model
export interface ITransaction {
  employer: mongoose.Types.ObjectId;
  job?: mongoose.Types.ObjectId;
  amount: number;
  currency?: string;
  provider?: 'razorpay' | 'stripe';
  providerOrderId?: string;
  providerPaymentId?: string;
  status?: 'created' | 'paid' | 'failed' | 'refunded';
  meta?: any;
  createdAt?: Date;
}



//Interface Export
export interface ITransactionDocument extends ITransaction, Document {}



//Transaction Model Schema
const TransactionSchema = new Schema<ITransactionDocument>({
  employer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: Schema.Types.ObjectId, ref: 'Job' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  provider: { type: String, enum: ['razorpay', 'stripe'], default: 'razorpay' },
  providerOrderId: { type: String },
  providerPaymentId: { type: String },
  status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
  meta: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});


//Export of Trabsaction schema
export const Transaction: Model<ITransactionDocument> = mongoose.model<ITransactionDocument>('Transaction', TransactionSchema);
export default Transaction;
