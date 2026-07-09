import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";
import { adminController } from "./admin.controller";
import { updateUserStatusZodSchema } from "./admin.validation";
import { validateRequest } from "../../middlewares/validateRequest";


const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.patch(
  "/users/:id",
  auth(Role.ADMIN),
  validateRequest(updateUserStatusZodSchema),
  adminController.updateUserStatus,
);

export const adminRoute = router;