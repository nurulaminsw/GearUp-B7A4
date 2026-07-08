import { prisma } from "../../lib/prisma";

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

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};
