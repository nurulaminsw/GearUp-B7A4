import { Router } from "express";
import { userController } from "./auth.controller";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.userLogin);
router.post("/refresh-token", userController.refreshToken);

export const authRouter = router;
