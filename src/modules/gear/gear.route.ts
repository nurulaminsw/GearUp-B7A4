import { Router } from "express";
import { gearController } from "./gear.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createGearZodSchema } from "./gear.validation";
import { Role } from "../../../generated/prisma/client";

const router = Router();

router.post(
  "/",
  auth(Role.PROVIDER),
  validateRequest(createGearZodSchema),
  gearController.createGear,
);

export const providerGearRoute = router;