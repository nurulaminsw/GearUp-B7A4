import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export const catchAsync = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  };
};
