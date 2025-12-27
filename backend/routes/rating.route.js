import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  averageRating,
  getAllRatings,
  giveRating,
  ratingGiven,
  canReview,        // ✅ ADD THIS
} from "../controllers/rating.controller.js";

const router = express.Router();

// ⭐ Create rating/review (after travel)
router.post("/give-rating", requireSignIn, giveRating);

// ⭐ Check eligibility to review (new)
router.get("/can-review/:userId/:packageId", requireSignIn, canReview);

// ⭐ Get average rating of package
router.get("/average-rating/:id", averageRating);

// ⭐ Check if user already gave rating
router.get("/rating-given/:userId/:packageId", requireSignIn, ratingGiven);

// ⭐ Get all ratings of package
router.get("/get-ratings/:id/:limit", getAllRatings);

export default router;
