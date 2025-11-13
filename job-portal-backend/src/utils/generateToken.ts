import jwt, { SignOptions } from "jsonwebtoken";
import { IUserDocument } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

interface TokenPayload {
  id: string;
  role: string;
}

export const generateToken = (user: IUserDocument): string => {
  const jwtSecret = process.env.JWT_SECRET as string;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET missing in environment variables.");
  }

  const payload: TokenPayload = {
    id: user._id.toString(),
    role: user.role,
  };

  // ✅ Explicitly define expiresIn as SignOptions["expiresIn"] type
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "7d",
  };

  try {
    const token = jwt.sign(payload, jwtSecret, options);
    return token;
  } catch (err) {
    console.error("JWT Signing Error:", err);
    throw new Error("Could not generate authentication token.");
  }
};
