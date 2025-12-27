import Package from "../models/package.model.js";
import RatingReview from "../models/ratings_reviews.model.js";
import Booking from "../models/booking.model.js"; // ✅ ADD THIS

// ⭐ GIVE RATING (Only After Travel Completed)
export const giveRating = async (req, res) => {
  if (req.user.id !== req.body.userRef) {
    return res.status(401).send({
      success: false,
      message: "You can only give rating on your own account!",
    });
  }

  try {
    // 1️⃣ CHECK IF USER HAS A BOOKING FOR THIS PACKAGE
    const booking = await Booking.findOne({
      userRef: req.user.id,
      packageId: req.body.packageId,
    });

    if (!booking) {
      return res.status(400).send({
        success: false,
        message: "You must book this package before giving a review!",
      });
    }

    // 2️⃣ CHECK IF TRAVEL IS COMPLETED
    const today = new Date();
    const travelEnd = new Date(booking.endDate);

    if (travelEnd > today) {
      return res.status(400).send({
        success: false,
        message: "You can review only after your trip is completed.",
      });
    }

    // 3️⃣ CREATE NEW RATING
    const newRating = await RatingReview.create(req.body);

    if (newRating) {
      const ratings = await RatingReview.find({
        packageId: req.body.packageId,
      });

      let totalRatings = ratings.length;
      let totalStars = 0;

      ratings.map((rating) => (totalStars += rating.rating));

      let average_rating =
        Math.round((totalStars / totalRatings) * 10) / 10;

      const setPackageRatings = await Package.findByIdAndUpdate(
        req.body.packageId,
        {
          $set: {
            packageRating: average_rating,
            packageTotalRatings: totalRatings,
          },
        },
        { new: true }
      );

      if (setPackageRatings) {
        return res.status(201).send({
          success: true,
          message: "Thanks for your feedback!",
        });
      } else {
        return res.status(500).send({
          success: false,
          message: "Error while setting new average rating",
        });
      }
    }

    return res.status(500).send({
      success: false,
      message: "Something went wrong creating rating",
    });
  } catch (error) {
    console.log(error);
  }
};

// ⭐ CHECK IF TRAVEL IS COMPLETED (Frontend Helper)
export const canReview = async (req, res) => {
  try {
    const { userId, packageId } = req.params;

    const booking = await Booking.findOne({ userRef: userId, packageId });

    if (!booking)
      return res.send({
        canReview: false,
        message: "You must book this package before reviewing.",
      });

    const today = new Date();
    if (new Date(booking.endDate) > today)
      return res.send({
        canReview: false,
        message: "You can review only after travel is completed.",
      });

    return res.send({
      canReview: true,
      message: "You can review now.",
    });
  } catch (error) {
    console.log(error);
  }
};

// ⭐ CHECK IF USER ALREADY GAVE RATING
export const ratingGiven = async (req, res) => {
  try {
    const rating_given = await RatingReview.findOne({
      userRef: req?.params?.userId,
      packageId: req?.params?.packageId,
    });

    return res.status(200).send({ given: !!rating_given });
  } catch (error) {
    console.log(error);
  }
};

// ⭐ GET AVERAGE RATING
export const averageRating = async (req, res) => {
  try {
    const ratings = await RatingReview.find({ packageId: req?.params?.id });

    let totalStars = 0;
    ratings.map((rating) => (totalStars += rating.rating));

    let average = ratings.length
      ? Math.round((totalStars / ratings.length) * 10) / 10
      : 0;

    res.status(200).send({
      rating: average,
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.log(error);
  }
};

// ⭐ GET ALL RATINGS
export const getAllRatings = async (req, res) => {
  try {
    const ratings = await RatingReview.find({
      packageId: req?.params?.id,
    })
      .limit(req?.params?.limit)
      .sort({ createdAt: -1 });

    return res.send(ratings || "N/A");
  } catch (error) {
    console.log(error);
  }
};
