import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { gearController } from "./gear.controller";
import { createGearZodSchema, updateGearZodSchema } from "./gear.validation";

const router = Router();

router.post(
  "/",
  auth(Role.PROVIDER),
  validateRequest(createGearZodSchema),
  gearController.createGear,
);

router.put(
  "/:id",
  auth(Role.PROVIDER),
  validateRequest(updateGearZodSchema),
  gearController.updateGear,
);

router.delete("/:id", auth(Role.PROVIDER), gearController.deleteGear);

export const providerGearRoute = router;
