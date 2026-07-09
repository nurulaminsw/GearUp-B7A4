import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { gearService } from "./gear.service";

const createGear = catchAsync(async (req: Request, res: Response) => {
  const providerId = (req as any).user?.id as string;

  const {
    categoryId,
    title,
    brand,
    description,
    pricePerDay,
    deposit,
    totalQuantity,
  } = req.body;

  const result = await gearService.createGearIntoDB({
    providerId,
    categoryId,
    title,
    brand,
    description,
    pricePerDay,
    deposit,
    totalQuantity,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Gear added successfully",
    data: result,
  });
});
const updateGear = catchAsync(async (req: Request, res: Response) => {
  const providerId = (req as any).user?.id as string;
  const id = req.params.id as string;

  const result = await gearService.updateGearInDB(providerId, id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear updated successfully",
    data: result,
  });
});

const deleteGear = catchAsync(async (req: Request, res: Response) => {
  const providerId = (req as any).user?.id as string;
  const id = req.params.id as string;

  const result = await gearService.deleteGearFromDB(providerId, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear deleted successfully",
    data: result,
  });
});
export const gearController = {
  createGear,
  updateGear,
  deleteGear,
};
