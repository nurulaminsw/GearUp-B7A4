import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { providerOrderController } from "./providerOrder.controller";
import { updateOrderStatusZodSchema } from "./providerOrder.validation";

const router = Router();

router.get("/", auth(Role.PROVIDER), providerOrderController.getProviderOrders);

router.patch(
  "/:id",
  auth(Role.PROVIDER),
  validateRequest(updateOrderStatusZodSchema),
  providerOrderController.updateProviderOrderStatus,
);

export const providerOrderRoute = router;
