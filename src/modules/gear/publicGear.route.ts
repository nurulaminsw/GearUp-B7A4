import { Router } from "express";
import { publicGearController } from "./publicGear.controller";

const router = Router();

router.get("/", publicGearController.getAllGear);

export const publicGearRoute = router;
