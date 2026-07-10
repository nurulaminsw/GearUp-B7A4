import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { userController } from "./auth.controller";
import {
  loginZodSchema,
  refreshTokenZodSchema,
  registerZodSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerZodSchema),
  userController.registerUser,
);

router.post(
  "/login",
  validateRequest(loginZodSchema),
  userController.userLogin,
);

router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  userController.getProfile,
);

router.post(
  "/refresh-token",
  validateRequest(refreshTokenZodSchema),
  userController.refreshToken,
);

export const authRouter = router;
