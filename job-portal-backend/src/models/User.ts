import mongoose, { Document, Model, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

// interface for user schema
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "employer";
  reusmeUrl?: string;
  createdAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId; // ✅ this fixes _id red line
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User Schema
const UserSchema = new Schema<IUserDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["candidate", "employer"], required: true },
  reusmeUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// password comparison
UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// export user schema
export const User: Model<IUserDocument> = mongoose.model<IUserDocument>("User", UserSchema);
export default User;
