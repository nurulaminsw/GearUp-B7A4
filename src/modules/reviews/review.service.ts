import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";

type CreateReviewPayload = {
  customerId: string;
  rentalOrderId: string;
  gearId: string;
  rating: number;
  comment?: string;
};

const createReviewIntoDB = async (payload: CreateReviewPayload) => {
  const { customerId, rentalOrderId, gearId, rating, comment } = payload;

  const order = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalOrderId,
      customerId,
      status: "RETURNED",
    },
    include: { items: true },
  });

  if (!order) {
    const err: any = new Error("Review allowed only after RETURNED order");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const gearInThisOrder = order.items.some((i) => i.gearId === gearId);
  if (!gearInThisOrder) {
    const err: any = new Error("This gear was not part of the rental order");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const alreadyReviewed = await prisma.review.findUnique({
    where: { rentalOrderId },
    select: { id: true },
  });

  if (alreadyReviewed) {
    const err: any = new Error("You already reviewed this order");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const review = await prisma.review.create({
    data: {
      customerId,
      rentalOrderId,
      gearId,
      rating,
      comment,
    },
    include: {
      customer: { select: { id: true, name: true } },
      gear: { select: { id: true, title: true } },
    },
  });

  return review;
};

const updateMyReviewInDB = async (
  customerId: string,
  reviewId: string,
  payload: { rating?: number; comment?: string },
) => {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, customerId },
    select: { id: true },
  });

  if (!review) {
    const err: any = new Error("Review not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: payload,
    include: {
      customer: { select: { id: true, name: true } },
      gear: { select: { id: true, title: true } },
    },
  });

  return updated;
};

const deleteMyReviewFromDB = async (customerId: string, reviewId: string) => {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, customerId },
    select: { id: true },
  });

  if (!review) {
    const err: any = new Error("Review not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  await prisma.review.delete({ where: { id: reviewId } });
  return { id: reviewId };
};


export const reviewService = {
  createReviewIntoDB,
  updateMyReviewInDB,
  deleteMyReviewFromDB
  
};
