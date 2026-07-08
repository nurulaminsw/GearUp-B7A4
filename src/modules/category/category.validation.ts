import { z } from "zod";

export const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Category name is required"),
  }),
});
