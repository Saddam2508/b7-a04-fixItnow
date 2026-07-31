import { prisma } from "../../lib/prisma";
import {
  TCreateService,
  TServiceFilters,
  TUpdateService,
} from "./service.interface";

const createServiceIntoDB = async (userId: string, payload: TCreateService) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technicianProfile) {
    throw new Error("Technician profile not found for this user");
  }

  const service = await prisma.service.create({
    data: {
      technicianId: technicianProfile.id,
      ...payload,
    },
  });

  return service;
};

const getAllServicesFromDB = async (filters: TServiceFilters) => {
  const { categoryId, location, minRating } = filters;

  const services = await prisma.service.findMany({
    where: {
      ...(categoryId && { categoryId }),
      technician: {
        ...(location && {
          location: { contains: location, mode: "insensitive" },
        }),
        ...(minRating && { avgRating: { gte: minRating } }),
      },
    },
    include: { technician: true, category: true },
  });

  return services;
};

const getSingleServiceFromDB = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: { technician: true, category: true },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
};

const updateServiceInDB = async (id: string, payload: TUpdateService) => {
  await getSingleServiceFromDB(id);

  const updatedService = await prisma.service.update({
    where: { id },
    data: payload,
  });

  return updatedService;
};

const deleteServiceFromDB = async (id: string) => {
  await getSingleServiceFromDB(id);

  const deletedService = await prisma.service.delete({ where: { id } });

  return deletedService;
};

export const serviceService = {
  createServiceIntoDB,
  getAllServicesFromDB,
  getSingleServiceFromDB,
  updateServiceInDB,
  deleteServiceFromDB,
};
