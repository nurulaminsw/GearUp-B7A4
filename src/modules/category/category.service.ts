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

const deleteCategoryFromDB = async (id: string) => {
  const exists = await prisma.category.findUnique({ where: { id } });
  if (!exists) {
    const err: any = new Error("Category not found");
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  const gearCount = await prisma.gearItem.count({ where: { categoryId: id } });
  if (gearCount > 0) {
    const err: any = new Error("Cannot delete category with existing gear items");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  await prisma.category.delete({ where: { id } });
  return { id };
};

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};
