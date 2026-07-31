import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { technicianController } from "./technician.controller";

const router = Router();

router.post(
  "/",
  auth(Role.TECHNICIAN),
  technicianController.createTechnicianProfile,
);

router.get("/", technicianController.getAllTechnicianProfiles);

router.get("/:id", technicianController.getSingleTechnicianProfile);

router.patch(
  "/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  technicianController.updateTechnicianProfile,
);

router.delete(
  "/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  technicianController.deleteTechnicianProfile,
);

export const technicianRoutes = router;
