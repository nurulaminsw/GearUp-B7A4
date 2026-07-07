import { Router } from "express";


import { auth } from "../../middlewares/auth";
import { userController } from "./auth.controller";
import { Role } from "../../../generated/prisma/client";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.userLogin);
router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  userController.getProfile,
);
router.post("/refresh-token", userController.refreshToken);

export const authRouter = router;
