import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";

const getAllUsersFromDB = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
const updateUserStatusInDB = async (userId: string, status: "ACTIVE" | "SUSPENDED") => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    const err: any = new Error("User not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updated;
};
const getAllGearForAdminFromDB = async () => {
  const gear = await prisma.gearItem.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      inventory: true,
      provider: { select: { id: true, name: true, email: true } },
    },
  });

  return gear;
};
const getAllRentalsForAdminFromDB = async () => {
  const rentals = await prisma.rentalOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      provider: { select: { id: true, name: true, email: true } },
      items: { include: { gear: true } },
      payments: true,
      review: true,
    },
  });

  return rentals;
};
export const adminService = {
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllGearForAdminFromDB,
  getAllRentalsForAdminFromDB,
};
