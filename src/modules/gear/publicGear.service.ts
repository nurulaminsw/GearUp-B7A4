import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";

type GearFilterQuery = {
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
};

const getAllGearFromDB = async (query: GearFilterQuery) => {
  const { categoryId, brand, minPrice, maxPrice } = query;

  const where: any = {
    status: "ACTIVE",
  };

  if (categoryId) where.categoryId = categoryId;
  if (brand) where.brand = { contains: brand, mode: "insensitive" };

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.pricePerDay = {};
    if (minPrice !== undefined) where.pricePerDay.gte = minPrice;
    if (maxPrice !== undefined) where.pricePerDay.lte = maxPrice;
  }

  const data = await prisma.gearItem.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      inventory: true,
      provider: {
        select: { id: true, name: true },
      },
    },
  });

  return data;
};

const getGearDetailsFromDB = async (id: string) => {
  const gear = await prisma.gearItem.findFirst({
    where: { id, status: "ACTIVE" },
    include: {
      category: true,
      inventory: true,
      provider: {
        select: { id: true, name: true },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!gear) {
    const err: any = new Error("Gear not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  return gear;
};

export const publicGearService = {
  getAllGearFromDB,
  getGearDetailsFromDB,
};
