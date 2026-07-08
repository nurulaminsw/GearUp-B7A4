import { Router } from "express";
import { publicGearController } from "./publicGear.controller";

const router = Router();

router.get("/", publicGearController.getAllGear);
router.get("/:id", publicGearController.getGearDetails);

export const publicGearRoute = router;
