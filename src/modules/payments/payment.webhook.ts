import { Request, Response } from "express";
import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";

const stripe = new Stripe(config.stripe_secret_key as string);

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];

  if (!signature) return res.status(400).send("Missing stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe_webhook_secret as string,
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const sessionId = session.id;
    const rentalOrderId = session.metadata?.rentalOrderId as string | undefined;
    const customerId = session.metadata?.customerId as string | undefined;

    if (rentalOrderId && customerId) {
      await prisma.$transaction(async (tx) => {
        await tx.payment.updateMany({
          where: { sessionId, rentalOrderId, customerId },
          data: { status: "COMPLETED", paidAt: new Date() },
        });

        await tx.rentalOrder.update({
          where: { id: rentalOrderId },
          data: { status: "PAID" },
        });
      });
    }
  }

  return res.json({ received: true });
};