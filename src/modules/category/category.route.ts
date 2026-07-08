import { Router } from "express";

import { auth } from "../../middlewares/auth";

import { categoryController } from "./category.controller";
import { createCategoryZodSchema } from "./category.validation";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.get("/", categoryController.getAllCategories);

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(createCategoryZodSchema),
  categoryController.createCategory,
);

export const categoryRoute = router;
