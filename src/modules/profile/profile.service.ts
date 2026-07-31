import { prisma } from "../../lib/prisma";
import { TCreateProfile, TUpdateProfile } from "./profile.interface";

const createProfileIntoDB = async (userId: string, payload: TCreateProfile) => {
  const existing = await prisma.profile.findUnique({ where: { userId } });

  if (existing) {
    throw new Error("Profile already exists for this user");
  }

  const profile = await prisma.profile.create({
    data: {
      userId,
      ...payload,
    },
  });

  return profile;
};

const getAllProfilesFromDB = async () => {
  const profiles = await prisma.profile.findMany({
    include: { user: true },
  });

  return profiles;
};

const getSingleProfileFromDB = async (id: string) => {
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
};

const getProfileByUserIdFromDB = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { user: true },
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
};

const updateProfileInDB = async (id: string, payload: TUpdateProfile) => {
  await getSingleProfileFromDB(id);

  const updatedProfile = await prisma.profile.update({
    where: { id },
    data: payload,
  });

  return updatedProfile;
};

const deleteProfileFromDB = async (id: string) => {
  await getSingleProfileFromDB(id);

  const deletedProfile = await prisma.profile.delete({ where: { id } });

  return deletedProfile;
};

export const profileService = {
  createProfileIntoDB,
  getAllProfilesFromDB,
  getSingleProfileFromDB,
  getProfileByUserIdFromDB,
  updateProfileInDB,
  deleteProfileFromDB,
};
