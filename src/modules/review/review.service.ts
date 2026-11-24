import { BookingStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { TCreateReview, TUpdateReview } from "./review.interface";

const recalculateAvgRating = async (technicianId: string) => {
  const result = await prisma.review.aggregate({
    where: { technicianId },
    _avg: { rating: true },
  });

  await prisma.technicianProfile.update({
    where: { id: technicianId },
    data: { avgRating: result._avg.rating ?? 0 },
  });
};

const createReviewIntoDB = async (
  customerId: string,
  payload: TCreateReview,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: payload.bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new Error("You are not authorized to review this booking");
  }

  if (booking.status !== BookingStatus.COMPLETED) {
    throw new Error("Only completed bookings can be reviewed");
  }

  if (booking.technicianId !== payload.technicianId) {
    throw new Error("Technician does not match this booking");
  }

  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const existing = await prisma.review.findUnique({
    where: { bookingId: payload.bookingId },
  });

  if (existing) {
    throw new Error("A review already exists for this booking");
  }

  const review = await prisma.review.create({
    data: {
      customerId,
      ...payload,
    },
    include: {
      customer: true,
      technician: true,
      booking: true,
    },
  });

  await recalculateAvgRating(payload.technicianId);

  return review;
};
const getAllReviewsFromDB = async (technicianId?: string) => {
  const reviews = await prisma.review.findMany({
    where: { ...(technicianId && { technicianId }) },
    include: { customer: true, technician: true, booking: true },
  });

  return reviews;
};

const getSingleReviewFromDB = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: { customer: true, technician: true, booking: true },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
};

const getMyReviewsFromDB = async (customerId: string) => {
  return prisma.review.findMany({
    where: { customerId },
    include: {
      customer: true,
      technician: {
        include: {
          user: true,
        },
      },
      booking: {
        include: {
          service: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateReviewInDB = async (
  id: string,
  payload: TUpdateReview,
  userId: string,
  role: Role,
) => {
  const review = await getSingleReviewFromDB(id);

  if (role !== Role.ADMIN && review.customerId !== userId) {
    throw new Error("You are not authorized to update this review");
  }

  if (
    payload.rating !== undefined &&
    (payload.rating < 1 || payload.rating > 5)
  ) {
    throw new Error("Rating must be between 1 and 5");
  }

  const updatedReview = await prisma.review.update({
    where: { id },
    data: payload,
    include: {
      customer: true,
      technician: true,
      booking: true,
    },
  });

  if (payload.rating !== undefined) {
    await recalculateAvgRating(review.technicianId);
  }

  return updatedReview;
};

const deleteReviewFromDB = async (id: string, userId: string, role: Role) => {
  const review = await getSingleReviewFromDB(id);

  if (role !== Role.ADMIN && review.customerId !== userId) {
    throw new Error("You are not authorized to delete this review");
  }

  const deletedReview = await prisma.review.delete({
    where: { id },
  });

  await recalculateAvgRating(review.technicianId);

  return deletedReview;
};

export const reviewService = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  getSingleReviewFromDB,
  updateReviewInDB,
  deleteReviewFromDB,
  getMyReviewsFromDB,
};
