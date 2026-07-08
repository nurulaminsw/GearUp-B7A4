import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { publicGearService } from "./publicGear.service";

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const { categoryId, brand, minPrice, maxPrice } = req.query;

  const result = await publicGearService.getAllGearFromDB({
    categoryId: categoryId as string | undefined,
    brand: brand as string | undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear retrieved successfully",
    data: result,
  });
});

const getGearDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await publicGearService.getGearDetailsFromDB(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear details retrieved successfully",
    data: result,
  });
});

export const publicGearController = {
  getAllGear,
  getGearDetails
};
