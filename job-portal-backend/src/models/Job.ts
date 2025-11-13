


import mongoose, { Document, Model, Schema } from 'mongoose';


  //interface of Job Model
export interface IJob {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description?: string;
  postedBy: mongoose.Types.ObjectId;
  category?: string;
  experienceLevel?: string;
  isPremium?: boolean;
  perks?: string[];
  applicationCount?: number;
  createdAt?: Date;
  expiresAt?: Date | null;
}


//Docement Export
export interface IJobDocument extends IJob, Document {}



//Schema of job Model


const JobSchema = new Schema<IJobDocument>({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  description: { type: String },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String },
  experienceLevel: { type: String },
  isPremium: { type: Boolean, default: false },
  perks: { type: [String], default: [] },
  applicationCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

export const Job: Model<IJobDocument> = mongoose.model<IJobDocument>('Job', JobSchema);
export default Job;
