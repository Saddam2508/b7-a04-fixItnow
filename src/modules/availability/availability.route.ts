import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { availabilityController } from "./availability.controller";

const router = Router({ mergeParams: true });

router.post(
  "/technicians/:technicianId/availability",
  auth(Role.TECHNICIAN),
  availabilityController.createAvailability,
);

router.get(
  "/technicians/:technicianId/availability",
  availabilityController.getAvailabilityForTechnician,
);

router.patch(
  "/availability/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  availabilityController.updateAvailability,
);

router.delete(
  "/availability/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  availabilityController.deleteAvailability,
);

export const availabilityRoutes = router;
