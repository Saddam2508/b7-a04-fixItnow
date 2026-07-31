import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { profileController } from "./profile.controller";

const router = Router();

router.post("/", auth(), profileController.createProfile);

router.get("/", auth(Role.ADMIN), profileController.getAllProfiles);

router.get("/:id", auth(), profileController.getSingleProfile);

router.patch("/:id", auth(), profileController.updateProfile);

router.delete("/:id", auth(Role.ADMIN), profileController.deleteProfile);

export const profileRoutes = router;
