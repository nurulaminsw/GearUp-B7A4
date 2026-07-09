import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRentalZodSchema } from "./rental.validation";
import { Role } from "../../../generated/prisma/client";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(createRentalZodSchema),
  rentalController.createRental,
);

router.get("/", auth(Role.CUSTOMER), rentalController.getMyRentals);
router.get("/:id", auth(Role.CUSTOMER), rentalController.getRentalDetails);
router.patch("/:id/cancel", auth(Role.CUSTOMER), rentalController.cancelRental);


export const rentalRoute = router;