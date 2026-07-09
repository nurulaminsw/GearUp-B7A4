import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
  const customerId = (req as any).user?.id as string;
  const { rentalOrderId } = req.body;

  const result = await paymentService.createPaymentSessionFromDB(
    customerId,
    rentalOrderId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Checkout session created successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const customerId = (req as any).user?.id as string;
  const { sessionId } = req.body;

  const result = await paymentService.confirmPaymentFromDB(
    customerId,
    sessionId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment confirmed successfully",
    data: result,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const customerId = (req as any).user?.id as string;
  const result = await paymentService.getMyPaymentsFromDB(customerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payments retrieved successfully",
    data: result,
  });
});

const getPaymentDetails = catchAsync(async (req: Request, res: Response) => {
  const customerId = (req as any).user?.id as string;
  const id = req.params.id as string;

  const result = await paymentService.getPaymentDetailsFromDB(customerId, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment details retrieved successfully",
    data: result,
  });
});

export const paymentController = {
  createPaymentSession,
  confirmPayment,
  getMyPayments,
  getPaymentDetails,
};
