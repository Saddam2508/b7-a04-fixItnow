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

const createReviewIntoDB = async (customerId: string, payload: TCreateReview) => {
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

const updateReviewInDB = async (id: string, payload: TUpdateReview) => {
  const review = await getSingleReviewFromDB(id);

  const updatedReview = await prisma.review.update({
    where: { id },
    data: payload,
  });

  if (payload.rating !== undefined) {
    await recalculateAvgRating(review.technicianId);
  }

  return updatedReview;
};

const deleteReviewFromDB = async (id: string) => {
  const review = await getSingleReviewFromDB(id);

  const deletedReview = await prisma.review.delete({ where: { id } });

  await recalculateAvgRating(review.technicianId);

  return deletedReview;
};

export const reviewService = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  getSingleReviewFromDB,
  updateReviewInDB,
  deleteReviewFromDB,
};
