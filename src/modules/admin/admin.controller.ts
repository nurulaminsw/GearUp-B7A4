import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});


const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;

  const result = await adminService.updateUserStatusInDB(id, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    data: result,
  });
});

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllGearForAdminFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear listings retrieved successfully",
    data: result,
  });
});
const getAllRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllRentalsForAdminFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental orders retrieved successfully",
    data: result,
  });
});
export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
  
};
