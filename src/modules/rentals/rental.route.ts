import { Router } from "express";
import { rentalController } from "./rental.controller";

const router = Router();

router.post("/", rentalController.createRental);
router.get("/", rentalController.getMyRentals);
router.get("/:id", rentalController.getRentalDetails);

export const rentalRoute = router;
