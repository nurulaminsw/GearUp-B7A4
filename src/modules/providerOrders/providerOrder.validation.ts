import { z } from "zod";

export const updateOrderStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(["CONFIRMED", "PICKED_UP", "RETURNED"]),
  }),
});