import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalService } from "./rental.service";

const createRental = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  const result = await rentalService.createRentalIntoDB(customerId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental order created successfully",
    data: result,
  });
});

const getMyRentals = catchAsync(async (req: Request, res: Response) => {
  const customerId = (req as any).user?.id as string;

  const result = await rentalService.getMyRentalsFromDB(customerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental orders retrieved successfully",
    data: result,
  });
});

const getRentalDetails = catchAsync(async (req: Request, res: Response) => {
  const customerId = (req as any).user?.id as string;
  const { id } = req.params;

  const result = await rentalService.getRentalDetailsFromDB(
    customerId,
    id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental order details retrieved successfully",
    data: result,
  });
});
const cancelRental = catchAsync(async (req:Request, res: Response) => {
  const customerId = (req as any).user?.id as string;
  const id = req.params.id as string;

  const result = await rentalService.cancelRentalFromDB(customerId, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental order cancelled successfully",
    data: result,
  });
});
export const rentalController = {
  createRental,
  getMyRentals,
  getRentalDetails,
  cancelRental,
};
