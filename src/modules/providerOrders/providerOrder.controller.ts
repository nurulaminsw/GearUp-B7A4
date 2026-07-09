import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { providerOrderService } from "./providerOrder.service";

const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const providerId = (req as any).user?.id as string;

  const result = await providerOrderService.getProviderOrdersFromDB(providerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Provider orders retrieved successfully",
    data: result,
  });
});

const updateProviderOrderStatus = catchAsync(
  async (req: Request, res: Response) => {
    const providerId = (req as any).user?.id as string;
    const id = req.params.id as string;
    const { status } = req.body;

    const result = await providerOrderService.updateProviderOrderStatusInDB(
      providerId,
      id,
      status,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Order status updated successfully",
      data: result,
    });
  },
);

export const providerOrderController = {
  getProviderOrders,
  updateProviderOrderStatus,
};
