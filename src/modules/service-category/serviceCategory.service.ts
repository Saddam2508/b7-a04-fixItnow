import { prisma } from "../../lib/prisma";
import {
  TCreateServiceCategory,
  TUpdateServiceCategory,
} from "./serviceCategory.interface";

const createServiceCategoryIntoDB = async (payload: TCreateServiceCategory) => {
  const serviceCategory = await prisma.serviceCategory.create({ data: payload });

  return serviceCategory;
};

const getAllServiceCategoriesFromDB = async () => {
  const serviceCategories = await prisma.serviceCategory.findMany({
    include: { services: true },
  });

  return serviceCategories;
};

const getSingleServiceCategoryFromDB = async (id: string) => {
  const serviceCategory = await prisma.serviceCategory.findUnique({
    where: { id },
    include: { services: true },
  });

  if (!serviceCategory) {
    throw new Error("Service category not found");
  }

  return serviceCategory;
};

const updateServiceCategoryInDB = async (
  id: string,
  payload: TUpdateServiceCategory,
) => {
  await getSingleServiceCategoryFromDB(id);

  const updatedServiceCategory = await prisma.serviceCategory.update({
    where: { id },
    data: payload,
  });

  return updatedServiceCategory;
};

const deleteServiceCategoryFromDB = async (id: string) => {
  await getSingleServiceCategoryFromDB(id);

  const deletedServiceCategory = await prisma.serviceCategory.delete({
    where: { id },
  });

  return deletedServiceCategory;
};

export const serviceCategoryService = {
  createServiceCategoryIntoDB,
  getAllServiceCategoriesFromDB,
  getSingleServiceCategoryFromDB,
  updateServiceCategoryInDB,
  deleteServiceCategoryFromDB,
};
