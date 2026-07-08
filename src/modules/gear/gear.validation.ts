import { z } from "zod";

export const createGearZodSchema = z.object({
  body: z.object({
    categoryId: z.string().min(1, "categoryId is required"),
    title: z.string().min(2, "title is required"),
    brand: z.string().optional(),
    description: z.string().optional(),

    pricePerDay: z.number().positive("pricePerDay must be positive"),
    deposit: z.number().nonnegative().optional(),

    totalQuantity: z
      .number()
      .int()
      .positive("totalQuantity must be at least 1"),
  }),
});
