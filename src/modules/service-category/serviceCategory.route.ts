import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { serviceCategoryController } from "./serviceCategory.controller";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN),
  serviceCategoryController.createServiceCategory,
);

router.get("/", serviceCategoryController.getAllServiceCategories);

router.get("/:id", serviceCategoryController.getSingleServiceCategory);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  serviceCategoryController.updateServiceCategory,
);

router.delete(
  "/:id",
  auth(Role.ADMIN),
  serviceCategoryController.deleteServiceCategory,
);

export const serviceCategoryRoutes = router;
