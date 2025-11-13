import { Request, Response, NextFunction } from "express";
import { IUserDocument } from "../models/User";

interface AuthRequest extends Request {
  user?: IUserDocument;
}

export const roleMiddleware = (roles: string | string[]) => {
  const Roles = Array.isArray(roles) ? roles : [roles];

  if (!Roles || Roles.length === 0) {
    console.error("invalid role");

    return (_: Request, res: Response) => {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    };
  }

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }

    const userRole = req.user.role;

    if (!Roles.includes(userRole)) {
      return res.status(403).json({
        message: " You do not have the required permissions for the access",
      });
    }

    next();
  };
};
