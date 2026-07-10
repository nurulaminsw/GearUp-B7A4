import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const customerId = (req as any).user?.id as string;
  const { rentalOrderId, gearId, rating, comment } = req.body;

  const result = await reviewService.createReviewIntoDB({
    customerId,
    rentalOrderId,
    gearId,
    rating,
    comment,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

const updateMyReview = catchAsync(async (req: Request, res: Response) => {
  const customerId = (req as any).user?.id as string;
  const id = req.params.id as string;

  const result = await reviewService.updateMyReviewInDB(
    customerId,
    id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteMyReview = catchAsync(async (req : Request, res: Response) => {
  const customerId = (req as any).user?.id as string;
  const id = req.params.id as string;

  const result = await reviewService.deleteMyReviewFromDB(customerId, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  updateMyReview,
  deleteMyReview,
};
