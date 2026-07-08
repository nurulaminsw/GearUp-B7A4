import { z } from "zod";

export const createRentalZodSchema = z.object({
  body: z.object({
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    items: z
      .array(
        z.object({
          gearId: z.string().min(1),
          quantity: z.number().int().positive(),
        }),
      )
      .min(1),
  }),
});
