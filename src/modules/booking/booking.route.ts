import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/", auth(Role.CUSTOMER), bookingController.createBooking);

router.get(
  "/",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getAllBookings,
);

router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getSingleBooking,
);

router.patch(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  bookingController.updateBooking,
);

router.patch(
  "/:id/status",
  auth(Role.TECHNICIAN, Role.ADMIN),
  bookingController.updateBookingStatus,
);

router.delete(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  bookingController.deleteBooking,
);

export const bookingRoutes = router;
