export type TCreateReview = {
  bookingId: string;
  technicianId: string;
  rating: number;
  comment?: string;
};

export type TUpdateReview = {
  rating?: number;
  comment?: string;
};
