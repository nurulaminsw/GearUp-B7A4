import { prisma } from "../../lib/prisma";

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

export const publicGearService = {
  getAllGearFromDB,
};
