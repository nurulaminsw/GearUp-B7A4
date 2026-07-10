import { Router } from "express";

import { auth } from "../../middlewares/auth";

import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { categoryController } from "./category.controller";
import {
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from "./category.validation";

const router = Router();

router.get("/", categoryController.getAllCategories);

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(createCategoryZodSchema),
  categoryController.createCategory,
);
router.put(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(updateCategoryZodSchema),
  categoryController.updateCategory,
);

router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoute = router;
