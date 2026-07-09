import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../../../generated/prisma/client";
import { createReviewZodSchema } from "./review.validation";
import { reviewController } from "./review.controller";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(createReviewZodSchema),
  reviewController.createReview,
);

export const reviewRoute = router;