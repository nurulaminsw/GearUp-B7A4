import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";

type ProviderUpdateStatus = "CONFIRMED" | "PICKED_UP" | "RETURNED";

const getProviderOrdersFromDB = async (providerId: string) => {
  const orders = await prisma.rentalOrder.findMany({
    where: { providerId },
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      items: { include: { gear: true } },
      payments: true,
      review: true,
    },
  });

  return orders;
};

const updateProviderOrderStatusInDB = async (
  providerId: string,
  orderId: string,
  newStatus: ProviderUpdateStatus,
) => {
  const order = await prisma.rentalOrder.findFirst({
    where: { id: orderId, providerId },
    select: {
      id: true,
      status: true,
      deposit: true,
      refundStatus: true,
    },
  });

  if (!order) {
    const err: any = new Error("Order not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  const current = order.status;

  const allowed =
    (current === "PLACED" && newStatus === "CONFIRMED") ||
    (current === "PAID" && newStatus === "PICKED_UP") ||
    (current === "PICKED_UP" && newStatus === "RETURNED");

  if (!allowed) {
    const err: any = new Error(
      `Invalid status transition: ${current} -> ${newStatus}`,
    );
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const dataToUpdate: any = { status: newStatus };

  if (newStatus === "RETURNED") {
    dataToUpdate.refundStatus = "REFUNDED";
    dataToUpdate.refundedAmount = order.deposit;
  }

  const updated = await prisma.rentalOrder.update({
    where: { id: orderId },
    data: dataToUpdate,
    include: {
      customer: { select: { id: true, name: true, email: true } },
      items: { include: { gear: true } },
      payments: true,
      review: true,
    },
  });

  return updated;
};

export const providerOrderService = {
  getProviderOrdersFromDB,
  updateProviderOrderStatusInDB,
};