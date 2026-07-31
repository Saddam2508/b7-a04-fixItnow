import { prisma } from "../../lib/prisma";
import { TUpdateUserStatus } from "./admin.interface";

const getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    omit: { password: true },
    include: { profile: true, technicianProfile: true },
  });

  return users;
};

const updateUserStatusInDB = async (id: string, payload: TUpdateUserStatus) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { activeStatus: payload.activeStatus },
    omit: { password: true },
  });

  return updatedUser;
};

const getAllBookingsFromDB = async () => {
  const bookings = await prisma.booking.findMany({
    include: { customer: true, technician: true, service: true, payment: true, review: true },
  });

  return bookings;
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllBookingsFromDB,
};
