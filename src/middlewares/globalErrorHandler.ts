import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import ApiError from "../utils/ApiError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err?.message || "Internal server error";
  let errorDetails: Array<{ path?: string; message: string }> = [];

  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation error";
    errorDetails = err.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
  }

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = [{ message: err.message }];
  }

  // Prisma
  if (err?.code === "P2002") {
    statusCode = httpStatus.CONFLICT;
    message = "Duplicate key error";
    errorDetails = [{ message: "Unique constraint failed" }];
  }

  if (err?.code === "P2025") {
    statusCode = httpStatus.NOT_FOUND;
    message = "Resource not found";
    errorDetails = [{ message: "Record not found" }];
  }

  if (errorDetails.length === 0) {
    errorDetails = [{ message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};
