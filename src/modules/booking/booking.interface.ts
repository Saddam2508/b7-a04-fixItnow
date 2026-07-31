import { BookingStatus } from "../../../generated/prisma/enums";

export type TCreateBooking = {
  technicianId: string;
  serviceId: string;
  scheduledAt: string; // ISO date string
};

export type TUpdateBooking = {
  scheduledAt?: string;
};

export type TUpdateBookingStatus = {
  status: BookingStatus;
};
