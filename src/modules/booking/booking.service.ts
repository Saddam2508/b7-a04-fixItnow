import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  TCreateBooking,
  TUpdateBooking,
  TUpdateBookingStatus,
} from "./booking.interface";

const createBookingIntoDB = async (
  customerId: string,
  payload: TCreateBooking,
) => {
  const booking = await prisma.booking.create({
    data: {
      customerId,
      technicianId: payload.technicianId,
      serviceId: payload.serviceId,
      scheduledAt: new Date(payload.scheduledAt),
    },
  });

  return booking;
};

const getAllBookingsFromDB = async () => {
  return prisma.booking.findMany({
    include: {
      customer: true,
      technician: {
        include: {
          user: true,
        },
      },
      service: true,
      payment: true,
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleBookingFromDB = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      technician: true,
      service: true,
      payment: true,
      review: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

const getSingleBookingForUserFromDB = async (
  bookingId: string,
  userId: string,
  role: Role,
) => {
  const booking = await getSingleBookingFromDB(bookingId);

  if (role === Role.ADMIN) {
    return booking;
  }

  if (role === Role.CUSTOMER && booking.customerId !== userId) {
    throw new Error("You are not allowed to access this booking");
  }

  if (role === Role.TECHNICIAN) {
    const technicianProfile = await prisma.technicianProfile.findUnique({
      where: { userId },
    });

    if (!technicianProfile || booking.technicianId !== technicianProfile.id) {
      throw new Error("You are not allowed to access this booking");
    }
  }

  return booking;
};

const updateBookingInDB = async (id: string, payload: TUpdateBooking) => {
  await getSingleBookingFromDB(id);

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: {
      ...(payload.scheduledAt && {
        scheduledAt: new Date(payload.scheduledAt),
      }),
    },
  });

  return updatedBooking;
};

const updateBookingStatusInDB = async (
  id: string,
  payload: TUpdateBookingStatus,
) => {
  await getSingleBookingFromDB(id);

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: { status: payload.status },
  });

  return updatedBooking;
};

const getBookingsForTechnicianUserFromDB = async (userId: string) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technicianProfile) {
    throw new Error("Technician profile not found for this user");
  }

  const bookings = await prisma.booking.findMany({
    where: { technicianId: technicianProfile.id },
    include: { customer: true, service: true, payment: true, review: true },
  });

  return bookings;
};

const updateBookingStatusForTechnicianUserInDB = async (
  userId: string,
  bookingId: string,
  payload: TUpdateBookingStatus,
) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technicianProfile) {
    throw new Error("Technician profile not found for this user");
  }

  const booking = await getSingleBookingFromDB(bookingId);

  if (booking.technicianId !== technicianProfile.id) {
    throw new Error("You are not allowed to update this booking");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: payload.status },
  });

  return updatedBooking;
};

const deleteBookingFromDB = async (id: string) => {
  await getSingleBookingFromDB(id);

  const deletedBooking = await prisma.booking.delete({ where: { id } });

  return deletedBooking;
};

const getBookingsForCustomerUserFromDB = async (userId: string) => {
  return prisma.booking.findMany({
    where: {
      customerId: userId,
    },
    include: {
      customer: true,
      technician: true,
      service: true,
      payment: true,
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const cancelBookingForCustomerUserFromDB = async (
  bookingId: string,
  userId: string,
) => {
  // Verify that this booking belongs to the customer
  const booking = await getSingleBookingForUserFromDB(
    bookingId,
    userId,
    Role.CUSTOMER,
  );

  // Only PENDING and ACCEPTED bookings can be cancelled
  if (!["PENDING", "ACCEPTED"].includes(booking.status)) {
    throw new Error(
      `Booking cannot be cancelled when status is ${booking.status}`,
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELLED",
    },
    include: {
      customer: true,
      technician: true,
      service: true,
      payment: true,
      review: true,
    },
  });

  return updatedBooking;
};

export const bookingService = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getSingleBookingFromDB,
  getSingleBookingForUserFromDB,
  getBookingsForTechnicianUserFromDB,
  updateBookingStatusForTechnicianUserInDB,
  updateBookingInDB,
  updateBookingStatusInDB,
  deleteBookingFromDB,
  getBookingsForCustomerUserFromDB,
  cancelBookingForCustomerUserFromDB,
};
