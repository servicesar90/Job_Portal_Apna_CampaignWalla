import jwt from "jsonwebtoken";
import { IUserDocument } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

interface TokenPayload {
  id: string;
  role: string;
}

export const generateToken = (user: IUserDocument): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    const configError = new Error(
      "JWT_SECRET is not in environment variables file."
    );

    console.error("server config error:", configError.message);
    throw configError;
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  const payload: TokenPayload = {
    id: user._id.toString(),
    role: user.role,
  };

  try {
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: expiresIn,
    });
    return token;
  } catch (err) {
    console.error("JWT Signing Error:", err);
    const signingError = new Error("Could not generate authentication token.");
    throw signingError;
  }
};
