import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import httpStatus from "http-status";
import { userService } from "./user.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const user = await userService.creatUserFromDb(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: { user },
  });
});


export const userController = {
  registerUser,
};