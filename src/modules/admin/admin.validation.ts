import { z } from "zod";

export const updateUserStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(["ACTIVE", "SUSPENDED"]),
  }),
});