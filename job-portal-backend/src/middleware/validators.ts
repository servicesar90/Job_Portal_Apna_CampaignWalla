import { body, validationResult, ValidationChain } from "express-validator";
import {  RequestHandler } from "express";

const handleValidationErrors: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array({ onlyFirstError: true }),
    });
  }
  next();
};

export const validateRegister: (ValidationChain | RequestHandler)[] = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isString().withMessage("Name must be a string")
    .isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("A valid email address is required"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["candidate", "employer"]).withMessage('Role must be either "candidate" or "employer"'),

  handleValidationErrors,
];

export const validateLogin: (ValidationChain | RequestHandler)[] = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required for login")
    .isEmail().withMessage("A valid email address is required for login"),

  body("password")
    .notEmpty().withMessage("Password is required for login"),

  handleValidationErrors,
];
