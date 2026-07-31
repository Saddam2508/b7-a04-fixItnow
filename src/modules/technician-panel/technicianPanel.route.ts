import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { technicianPanelController } from "./technicianPanel.controller";

const router = Router();

router.put(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianPanelController.updateMyTechnicianProfile,
);

router.put(
  "/availability",
  auth(Role.TECHNICIAN),
  technicianPanelController.updateMyAvailability,
);

router.get(
  "/bookings",
  auth(Role.TECHNICIAN),
  technicianPanelController.getMyBookings,
);

router.patch(
  "/bookings/:id",
  auth(Role.TECHNICIAN),
  technicianPanelController.updateMyBookingStatus,
);

export const technicianPanelRoutes = router;
