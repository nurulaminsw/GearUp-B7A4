import { z } from "zod";

export const createReviewZodSchema = z.object({
  body: z.object({
    rentalOrderId: z.string().min(1),
    gearId: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
  }),
});

export const updateReviewZodSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});