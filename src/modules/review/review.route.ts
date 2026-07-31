import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", auth(Role.CUSTOMER), reviewController.createReview);

router.get("/", reviewController.getAllReviews);

router.get("/:id", reviewController.getSingleReview);

router.patch(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  reviewController.updateReview,
);

router.delete(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  reviewController.deleteReview,
);

export const reviewRoutes = router;
