import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminController } from "./admin.controller";
import { updateUserStatusZodSchema } from "./admin.validation";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.patch(
  "/users/:id",
  auth(Role.ADMIN),
  validateRequest(updateUserStatusZodSchema),
  adminController.updateUserStatus,
);

router.get("/gear", auth(Role.ADMIN), adminController.getAllGear);
router.get("/rentals", auth(Role.ADMIN), adminController.getAllRentals);


export const adminRoute = router;
