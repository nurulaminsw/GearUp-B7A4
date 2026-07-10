import httpStatus from "http-status";
import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";

const stripe = new Stripe(config.stripe_secret_key as string);

const createPaymentSessionFromDB = async (
  customerId: string,
  rentalOrderId: string,
) => {
  const order = await prisma.rentalOrder.findFirst({
    where: { id: rentalOrderId, customerId },
  });

  if (!order) {
    const err: any = new Error("Rental order not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  if (order.status !== "CONFIRMED") {
    const err: any = new Error("Order must be CONFIRMED before payment");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const paidAlready = await prisma.payment.findFirst({
    where: { rentalOrderId, customerId, status: "COMPLETED" },
  });

  if (paidAlready) {
    const err: any = new Error("Order already paid");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: customerId },
    select: { email: true },
  });

  const amount = Number(order.totalAmount);
  const unitAmount = Math.round(amount * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: { name: `GearUp Rental Payment (${order.id})` },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      rentalOrderId: order.id,
      customerId,
    },
    success_url: `${config.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.client_url}/payment/cancel`,
  });

  const payment = await prisma.payment.create({
    data: {
      rentalOrderId: order.id,
      customerId,
      provider: "STRIPE",
      sessionId: session.id,
      amount: order.totalAmount,
      status: "PENDING",
    },
  });

  return {
    sessionId: session.id,
    sessionUrl: session.url,
    payment,
  };
};

const confirmPaymentFromDB = async (customerId: string, sessionId: string) => {
  const payment = await prisma.payment.findFirst({
    where: { sessionId, customerId },
  });

  if (!payment) {
    const err: any = new Error("Payment not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  if (payment.status === "COMPLETED") {
    return payment;
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    const err: any = new Error("Payment not completed");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const updatedPayment = await prisma.$transaction(async (tx) => {
    const p = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        paidAt: new Date(),
      },
    });

    await tx.rentalOrder.update({
      where: { id: payment.rentalOrderId },
      data: { status: "PAID" },
    });

    return p;
  });

  return updatedPayment;
};

const getMyPaymentsFromDB = async (customerId: string) => {
  return prisma.payment.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
  });
};

const getPaymentDetailsFromDB = async (customerId: string, id: string) => {
  const payment = await prisma.payment.findFirst({
    where: { id, customerId },
  });

  if (!payment) {
    const err: any = new Error("Payment not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  return payment;
};

export const paymentService = {
  createPaymentSessionFromDB,
  confirmPaymentFromDB,
  getMyPaymentsFromDB,
  getPaymentDetailsFromDB,
};
