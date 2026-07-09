import express, { Router } from "express";
import { stripeWebhookHandler } from "./payment.webhook";

const router = Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler,
);

export const paymentWebhookRoute = router;
