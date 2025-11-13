import mongoose, { Document, Model, Schema } from 'mongoose';


//interface oF NOTIFICATION mODEL
export interface INotification {
  user: mongoose.Types.ObjectId;
  title: string;
  message?: string;
  read?: boolean;
  createdAt?: Date;
}



//intrface export
export interface INotificationDocument extends INotification, Document {}


//Notification Schema
const NotificationSchema = new Schema<INotificationDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification: Model<INotificationDocument> = mongoose.model<INotificationDocument>('Notification', NotificationSchema);
export default Notification;
