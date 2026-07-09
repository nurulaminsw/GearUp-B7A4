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

export const updateGearZodSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    title: z.string().min(2).optional(),
    brand: z.string().optional(),
    description: z.string().optional(),
    pricePerDay: z.number().positive().optional(),
    deposit: z.number().nonnegative().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).optional(),
    totalQuantity: z.number().int().positive().optional(),
  }),
});
