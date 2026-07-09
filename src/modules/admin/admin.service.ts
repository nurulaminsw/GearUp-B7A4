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

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusInDB
};
