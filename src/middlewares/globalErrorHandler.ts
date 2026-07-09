import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import ApiError from "../utils/ApiError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  let errors: any[] = [];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    errors = err.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
  }

  // Prisma known request error (unique constraint etc.)
  if (err?.code === "P2002") {
    statusCode = 409;
    message = "Duplicate key error";
    errors = [{ message: "Unique constraint failed", meta: err.meta }];
  }

  if (err?.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length ? errors : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};