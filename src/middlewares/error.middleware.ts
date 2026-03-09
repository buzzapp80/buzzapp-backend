import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "yup";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = req.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";
  let errors: any = null;

  // Handle yup validation errors
  if (err instanceof ValidationError) {
    statusCode = 409;
    message = "Validation Failed";
    errors = err.errors;
  }

  // Handle mongodb/mongoose errors
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
