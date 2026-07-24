import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser);

router.get(
  "/me",
  auth(Role.ADMIN, Role.USER, Role.TECHNICIAN),
  userController.getMyProfile,
);

router.put(
  "/my-profile",
  auth(Role.ADMIN, Role.USER, Role.TECHNICIAN),
  userController.updateMyProfile,
);

export const userRoutes = router;
