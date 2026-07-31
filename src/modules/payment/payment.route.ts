import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/create", auth(Role.CUSTOMER), paymentController.createPayment);

router.post("/confirm", paymentController.confirmPayment);

router.get(
  "/",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  paymentController.getAllPayments,
);

router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  paymentController.getSinglePayment,
);

router.get(
  "/booking/:bookingId",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  paymentController.getPaymentByBooking,
);

router.patch("/:id", auth(Role.ADMIN), paymentController.updatePayment);

router.patch(
  "/:id/status",
  auth(Role.ADMIN),
  paymentController.updatePaymentStatus,
);

router.delete("/:id", auth(Role.ADMIN), paymentController.deletePayment);

export const paymentRoutes = router;
