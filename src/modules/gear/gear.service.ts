import { prisma } from "../../lib/prisma";
import { UpdateGearPayload } from "./gear.interface";
import httpStatus from "http-status";


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

const updateGearInDB = async (
  providerId: string,
  gearId: string,
  payload: UpdateGearPayload,
) => {
  const gear = await prisma.gearItem.findFirst({
    where: { id: gearId, providerId },
    select: { id: true },
  });

  if (!gear) {
    const err: any = new Error("Gear not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  const {
    totalQuantity,
    categoryId,
    title,
    brand,
    description,
    pricePerDay,
    deposit,
    status,
  } = payload;

  const updated = await prisma.gearItem.update({
    where: { id: gearId },
    data: {
      categoryId,
      title,
      brand,
      description,
      pricePerDay,
      deposit,
      status,
      inventory:
        totalQuantity !== undefined
          ? {
              upsert: {
                create: { totalQuantity },
                update: { totalQuantity },
              },
            }
          : undefined,
    },
    include: {
      inventory: true,
      category: true,
    },
  });

  return updated;
};

const deleteGearFromDB = async (providerId: string, gearId: string) => {
  const gear = await prisma.gearItem.findFirst({
    where: { id: gearId, providerId },
    select: { id: true },
  });

  if (!gear) {
    const err: any = new Error("Gear not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  await prisma.$transaction(async (tx) => {
    await tx.gearInventory.deleteMany({
      where: { gearId },
    });

    await tx.gearItem.delete({
      where: { id: gearId },
    });
  });

  return { id: gearId };
};

export const gearService = {
  createGearIntoDB,
  updateGearInDB,
  deleteGearFromDB,
};
