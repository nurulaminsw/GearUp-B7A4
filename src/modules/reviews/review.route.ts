import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { reviewController } from "./review.controller";
import {
  createReviewZodSchema,
  updateReviewZodSchema,
} from "./review.validation";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(createReviewZodSchema),
  reviewController.createReview,
);
router.patch(
  "/:id",
  auth(Role.CUSTOMER),
  validateRequest(updateReviewZodSchema),
  reviewController.updateMyReview,
);

export const reviewRoute = router;
