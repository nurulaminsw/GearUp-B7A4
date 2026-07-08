import { prisma } from "../../lib/prisma";

type CreateGearPayload = {
  providerId: string;
  categoryId: string;
  title: string;
  brand?: string;
  description?: string;
  pricePerDay: number;
  deposit?: number;
  totalQuantity: number;
};

const createGearIntoDB = async (payload: CreateGearPayload) => {
  const {
    providerId,
    categoryId,
    title,
    brand,
    description,
    pricePerDay,
    deposit,
    totalQuantity,
  } = payload;

  const result = await prisma.gearItem.create({
    data: {
      providerId,
      categoryId,
      title,
      brand,
      description,
      pricePerDay,
      deposit: deposit ?? 0,
      inventory: {
        create: {
          totalQuantity,
        },
      },
    },
    include: {
      inventory: true,
      category: true,
      provider: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  return result;
};

export const gearService = {
  createGearIntoDB,
};
