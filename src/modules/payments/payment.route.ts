import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { paymentController } from "./payment.controller";
import {
  confirmPaymentZodSchema,
  createPaymentZodSchema,
} from "./payment.validation";

const router = Router();

router.post(
  "/create",
  auth(Role.CUSTOMER),
  validateRequest(createPaymentZodSchema),
  paymentController.createPaymentSession,
);

router.post(
  "/confirm",
  auth(Role.CUSTOMER),
  validateRequest(confirmPaymentZodSchema),
  paymentController.confirmPayment,
);

router.get("/", auth(Role.CUSTOMER), paymentController.getMyPayments);
router.get("/:id", auth(Role.CUSTOMER), paymentController.getPaymentDetails);

export const paymentRoute = router;
