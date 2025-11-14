import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

// interface CustomError extends Error {
//   statusCode?: number;
//   code?: string;
//   isOperational?: boolean;
//   keyValue?: Record<string, any>;
//  errors?: Record<string, any>;
  
// }

// export const errorHandler = (
//   err: CustomError,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let error: CustomError = { ...err };
//   error.message = err.message;

//   let statusCode = error.statusCode || 500;
//   let message = error.message || "Server Error";

//   if (statusCode === 500 || !error.isOperational) {
//     console.error("SERVER ERROR: ", error);
//   } else {
//     console.warn(` ERROR (${statusCode}): ${error.message}`);
//   }

//   if (error.name === "CastError") {
//     message = `Resource not found with id of ${error}`;
//     statusCode = 404;
//     error.isOperational = true;
//   }

//   if (error.code === "11000" && error.keyValue) {
//     const field = Object.keys(error.keyValue);
//     message = `Duplicate field value entered: ${field.join(
//       ", "
//     )}. Please use another value.`;
//     statusCode = 400;
//     error.isOperational = true;
//   }

//   if (error.name === "ValidationError") {
//     const messages = Object.values(error.errors).map((val: any) => val.message);
//     message = `Invalid data: ${messages.join(", ")}`;
//     statusCode = 400;
//     error.isOperational = true;
//   }

//   if (
//     error.name === "JsonWebTokenError" ||
//     error.name === "TokenExpiredError"
//   ) {
//     message =
//       error.name === "TokenExpiredError"
//         ? "Access token has expired"
//         : "Invalid token came";
//     statusCode = 401;
//     error.isOperational = true;
//   }

//   res.status(statusCode).json({
//     success: false,
//     statusCode: statusCode,
//     message: message,

//     code: error.code,
//   });
// };


interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
  keyValue?: Record<string, any>;
  errors?: { [key: string]: { message: string } };
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let error: CustomError = Object.assign({}, err);
  error.message = err.message;

  let statusCode = error.statusCode || 500;
  let message = error.message || "Server Error";

  if (error.name === "ValidationError" && error.errors) {
    const messages = Object.values(error.errors).map((val) => val.message);
    message = `Invalid data: ${messages.join(", ")}`;
    statusCode = 400;
    error.isOperational = true;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    code: error.code,
  });
};
