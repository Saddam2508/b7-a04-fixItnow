import { prisma } from "../../lib/prisma";
import {
  TCreateTechnicianProfile,
  TUpdateTechnicianProfile,
} from "./technician.interface";

const createTechnicianProfileIntoDB = async (
  userId: string,
  payload: TCreateTechnicianProfile,
) => {
  const existing = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new Error("Technician profile already exists for this user");
  }

  const technicianProfile = await prisma.technicianProfile.create({
    data: {
      userId,
      ...payload,
    },
  });

  return technicianProfile;
};

const getAllTechnicianProfilesFromDB = async () => {
  const technicians = await prisma.technicianProfile.findMany({
    include: { user: true, services: true, availability: true },
  });

  return technicians;
};

const getSingleTechnicianProfileFromDB = async (id: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { id },
    include: { user: true, services: true, availability: true, reviews: true },
  });

  if (!technician) {
    throw new Error("Technician profile not found");
  }

  return technician;
};

const updateTechnicianProfileInDB = async (
  id: string,
  payload: TUpdateTechnicianProfile,
) => {
  await getSingleTechnicianProfileFromDB(id);

  const updatedTechnician = await prisma.technicianProfile.update({
    where: { id },
    data: payload,
  });

  return updatedTechnician;
};

const getTechnicianProfileByUserIdFromDB = async (userId: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId },
    include: { user: true, services: true, availability: true, reviews: true },
  });

  if (!technician) {
    throw new Error("Technician profile not found for this user");
  }

  return technician;
};

const updateTechnicianProfileByUserIdInDB = async (
  userId: string,
  payload: TUpdateTechnicianProfile,
) => {
  const technician = await getTechnicianProfileByUserIdFromDB(userId);

  const updatedTechnician = await prisma.technicianProfile.update({
    where: { id: technician.id },
    data: payload,
  });

  return updatedTechnician;
};

const deleteTechnicianProfileFromDB = async (id: string) => {
  await getSingleTechnicianProfileFromDB(id);

  const deletedTechnician = await prisma.technicianProfile.delete({
    where: { id },
  });

  return deletedTechnician;
};

export const technicianService = {
  createTechnicianProfileIntoDB,
  getAllTechnicianProfilesFromDB,
  getSingleTechnicianProfileFromDB,
  getTechnicianProfileByUserIdFromDB,
  updateTechnicianProfileByUserIdInDB,
  updateTechnicianProfileInDB,
  deleteTechnicianProfileFromDB,
};
