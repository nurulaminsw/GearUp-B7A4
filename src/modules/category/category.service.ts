import { prisma } from "../../lib/prisma";

import httpStatus from "http-status";

const createCategoryIntoDB = async (name: string) => {
  const category = await prisma.category.create({
    data: { name },
  });
  return category;
};

const getAllCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
  return categories;
};

const updateCategoryInDB = async (id: string, name: string) => {
  const exists = await prisma.category.findUnique({ where: { id } });
  if (!exists) {
    const err: any = new Error("Category not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  return prisma.category.update({
    where: { id },
    data: { name },
  });
};

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
};
