import mongoose, { Document, Model, Schema } from 'mongoose';



//interfece of APPlication Model 

export interface IApplication {
  job: mongoose.Types.ObjectId;
  candidate: mongoose.Types.ObjectId;
  resumeLink?: string;
  coverLetter?: string;
  status?: 'Applied' | 'Shortlisted' | 'Rejected' | 'Hired' | 'Withdrawn';
  appliedAt?: Date;
  updatedAt?: Date;
}


//Doc Exporrt
export interface IApplicationDocument extends IApplication, Document {}


//Schema OF Application model

const ApplicationSchema = new Schema<IApplicationDocument>({
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resumeLink: { type: String },
  coverLetter: { type: String },
  status: { type: String, enum: ['Applied', 'Shortlisted', 'Rejected', 'Hired', 'Withdrawn'], default: 'Applied' },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

ApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export const Application: Model<IApplicationDocument> = mongoose.model<IApplicationDocument>('Application', ApplicationSchema);
export default Application;
