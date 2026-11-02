import { prisma } from "../../lib/prisma";
import {
  TCreateTechnicianProfile,
  TUpdateTechnicianProfile,
} from "./technician.interface";

// ============================================
// Create Technician Profile
// ============================================

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

  const { availability, ...profileData } = payload;

  const technicianProfile = await prisma.technicianProfile.create({
    data: {
      userId,
      ...profileData,

      ...(availability !== undefined && {
        availability: {
          create: availability.map((item) => ({
            dayOfWeek: item.dayOfWeek,
            startTime: item.startTime,
            endTime: item.endTime,
          })),
        },
      }),
    },
    include: {
      availability: true,
      services: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return technicianProfile;
};

// ============================================
// Get All Technician Profiles
// ============================================

const getAllTechnicianProfilesFromDB = async () => {
  const technicians = await prisma.technicianProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      services: true,
      availability: true,
    },
  });

  return technicians;
};

// ============================================
// Get Single Technician Profile
// ============================================

const getSingleTechnicianProfileFromDB = async (id: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      services: true,
      availability: true,
      reviews: true,
    },
  });

  if (!technician) {
    throw new Error("Technician profile not found");
  }

  return technician;
};

// ============================================
// Update Technician Profile By ID
// ============================================

const updateTechnicianProfileInDB = async (
  id: string,
  payload: TUpdateTechnicianProfile,
) => {
  await getSingleTechnicianProfileFromDB(id);

  const { availability, ...profileData } = payload;

  const updatedTechnician = await prisma.$transaction(async (tx) => {
    // Update technician profile
    await tx.technicianProfile.update({
      where: { id },
      data: profileData,
    });

    // Update availability only when provided
    if (availability !== undefined) {
      // Delete previous availability records
      await tx.availability.deleteMany({
        where: {
          technicianId: id,
        },
      });

      // Create new availability records
      if (availability.length > 0) {
        await tx.availability.createMany({
          data: availability.map((item) => ({
            technicianId: id,
            dayOfWeek: item.dayOfWeek,
            startTime: item.startTime,
            endTime: item.endTime,
          })),
        });
      }
    }

    // Return updated technician profile
    return tx.technicianProfile.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        services: true,
        availability: true,
        reviews: true,
      },
    });
  });

  return updatedTechnician;
};

// ============================================
// Get Technician Profile By User ID
// ============================================

const getTechnicianProfileByUserIdFromDB = async (userId: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      services: true,
      availability: true,
      reviews: true,
    },
  });

  if (!technician) {
    throw new Error("Technician profile not found for this user");
  }

  return technician;
};

// ============================================
// Update Technician Profile By User ID
// ============================================

const updateTechnicianProfileByUserIdInDB = async (
  userId: string,
  payload: TUpdateTechnicianProfile,
) => {
  const technician = await getTechnicianProfileByUserIdFromDB(userId);

  const { availability, ...profileData } = payload;

  const updatedTechnician = await prisma.$transaction(async (tx) => {
    // Update technician profile
    await tx.technicianProfile.update({
      where: {
        id: technician.id,
      },
      data: profileData,
    });

    // Update availability only when provided
    if (availability !== undefined) {
      // Delete previous availability records
      await tx.availability.deleteMany({
        where: {
          technicianId: technician.id,
        },
      });

      // Create new availability records
      if (availability.length > 0) {
        await tx.availability.createMany({
          data: availability.map((item) => ({
            technicianId: technician.id,
            dayOfWeek: item.dayOfWeek,
            startTime: item.startTime,
            endTime: item.endTime,
          })),
        });
      }
    }

    // Return updated technician profile
    return tx.technicianProfile.findUniqueOrThrow({
      where: {
        id: technician.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        services: true,
        availability: true,
        reviews: true,
      },
    });
  });

  return updatedTechnician;
};

// ============================================
// Delete Technician Profile
// ============================================

const deleteTechnicianProfileFromDB = async (id: string) => {
  await getSingleTechnicianProfileFromDB(id);

  const deletedTechnician = await prisma.technicianProfile.delete({
    where: { id },
  });

  return deletedTechnician;
};

// ============================================
// Export Technician Services
// ============================================

export const technicianService = {
  createTechnicianProfileIntoDB,
  getAllTechnicianProfilesFromDB,
  getSingleTechnicianProfileFromDB,
  getTechnicianProfileByUserIdFromDB,
  updateTechnicianProfileByUserIdInDB,
  updateTechnicianProfileInDB,
  deleteTechnicianProfileFromDB,
};
