import { z } from "zod";

export const createPaymentZodSchema = z.object({
  body: z.object({
    rentalOrderId: z.string().min(1),
  }),
});

export const confirmPaymentZodSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
  }),
});
