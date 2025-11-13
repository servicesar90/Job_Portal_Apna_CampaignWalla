import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
import User, { IUserDocument } from "../models/User";


dotenv.config();

interface AuthRequest extends Request {
  user?: IUserDocument;
}

interface JwtPayload {
  id: string;
  role: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = (req.headers.authorization || req.headers.Authorization) as
    | string
    | undefined;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: " No token provided t",
      code: "token missing",
    });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token is missing",
      code: "token  missing",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    console.error("No secret key found");
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");
    console.log(user);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized User",
        code: "user not found",
      });
    }

    req.user = user as IUserDocument;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({
        message: " Token has expired",
        code: "token expired",
      });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid Token or Signature",
        code: "invalid token",
      });
    }

    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error ",

      code: "server error",
    });
  }
};
