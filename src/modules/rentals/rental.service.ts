import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";

type CreateRentalBody = {
  startDate: string;
  endDate: string;
  items: { gearId: string; quantity: number }[];
};

const createRentalIntoDB = async (customerId: string, body: CreateRentalBody) => {
  const sDate = new Date(body.startDate);
  const eDate = new Date(body.endDate);

  if (isNaN(sDate.getTime()) || isNaN(eDate.getTime()) || sDate >= eDate) {
    const err: any = new Error("Invalid startDate/endDate");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const gearIds = body.items.map((i) => i.gearId);

  const gears = await prisma.gearItem.findMany({
    where: { id: { in: gearIds }, status: "ACTIVE" },
    select: { id: true, providerId: true, pricePerDay: true, deposit: true },
  });

  if (gears.length !== gearIds.length) {
    const err: any = new Error("One or more gear items not found/active");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  if (gears.length === 0) {
    const err: any = new Error("No gear found");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const providerId = gears[0]!.providerId;

  if (!gears.every((g) => g.providerId === providerId)) {
    const err: any = new Error("All items must be from the same provider");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const totalDays = Math.ceil((eDate.getTime() - sDate.getTime()) / dayMs);

  let subtotal = 0;
  let depositTotal = 0;

  const itemsData = body.items.map((item) => {
    const gear = gears.find((g) => g.id === item.gearId)!;

    const itemRental = Number(gear.pricePerDay) * item.quantity * totalDays;
    const itemDeposit = Number(gear.deposit ?? 0) * item.quantity;

    subtotal += itemRental;
    depositTotal += itemDeposit;

    return {
      gearId: gear.id,
      quantity: item.quantity,
      pricePerDaySnap: gear.pricePerDay,
      itemTotal: itemRental,
    };
  });

  const totalAmount = subtotal + depositTotal;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.rentalOrder.create({
      data: {
        customerId,
        providerId,
        startDate: sDate,
        endDate: eDate,
        subtotal,
        deposit: depositTotal,
        totalAmount,
        items: { create: itemsData },
      },
      include: {
        items: { include: { gear: true } },
        payments: true,
        review: true,
      },
    });

    return created;
  });

  return order;
};

const getMyRentalsFromDB = async (customerId: string) => {
  const orders = await prisma.rentalOrder.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { gear: true } },
      payments: true,
      review: true,
    },
  });

  return orders;
};

const getRentalDetailsFromDB = async (customerId: string, orderId: string) => {
  const order = await prisma.rentalOrder.findFirst({
    where: { id: orderId, customerId },
    include: {
      items: { include: { gear: true } },
      payments: true,
      review: true,
    },
  });

  if (!order) {
    const err: any = new Error("Rental order not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  return order;
};

const cancelRentalFromDB = async (customerId: string, orderId: string) => {
  const order = await prisma.rentalOrder.findFirst({
    where: { id: orderId, customerId },
    select: { id: true, status: true },
  });

  if (!order) {
    const err: any = new Error("Rental order not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  if (order.status !== "PLACED") {
    const err: any = new Error("Only PLACED orders can be cancelled");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const updated = await prisma.rentalOrder.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
    include: {
      items: { include: { gear: true } },
      payments: true,
      review: true,
    },
  });

  return updated;
};

export const rentalService = {
  createRentalIntoDB,
  getMyRentalsFromDB,
  getRentalDetailsFromDB,
  cancelRentalFromDB,
};