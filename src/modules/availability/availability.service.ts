import { prisma } from "../../lib/prisma";
import { TCreateAvailability, TUpdateAvailability } from "./availability.interface";

const createAvailabilityIntoDB = async (
  technicianId: string,
  payload: TCreateAvailability,
) => {
  const availability = await prisma.availability.create({
    data: {
      technicianId,
      ...payload,
    },
  });

  return availability;
};

const getAvailabilityForTechnicianFromDB = async (technicianId: string) => {
  const availability = await prisma.availability.findMany({
    where: { technicianId },
  });

  return availability;
};

const getSingleAvailabilityFromDB = async (id: string) => {
  const availability = await prisma.availability.findUnique({ where: { id } });

  if (!availability) {
    throw new Error("Availability slot not found");
  }

  return availability;
};

const updateAvailabilityInDB = async (id: string, payload: TUpdateAvailability) => {
  await getSingleAvailabilityFromDB(id);

  const updatedAvailability = await prisma.availability.update({
    where: { id },
    data: payload,
  });

  return updatedAvailability;
};

const deleteAvailabilityFromDB = async (id: string) => {
  await getSingleAvailabilityFromDB(id);

  const deletedAvailability = await prisma.availability.delete({ where: { id } });

  return deletedAvailability;
};

export const availabilityService = {
  createAvailabilityIntoDB,
  getAvailabilityForTechnicianFromDB,
  getSingleAvailabilityFromDB,
  updateAvailabilityInDB,
  deleteAvailabilityFromDB,
};
