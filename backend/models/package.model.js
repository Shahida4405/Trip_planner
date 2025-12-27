import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    packageName: { type: String, required: true },
    packageDescription: { type: String, required: true },
    packageDestination: { type: String, required: true },
    packageCategory: { type: String, required: true },
    packageDays: { type: Number, required: true },
    packageNights: { type: Number, required: true },
    packageAccommodation: { type: String, required: true },
    packageTransportation: { type: String, required: true },
    packagePrice: { type: Number, required: true },
    packageDiscountPrice: { type: Number, default: 0 },
    packageOffer: { type: Boolean, default: false },

    // 🔥 FIXED → use arrays instead of string
    packageMeals: { type: [String], default: [] },
    packageActivities: { type: [String], default: [] },

    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },

    // 🔥 FIXED → flat array of strings instead of array of arrays
    itinerary: { type: [String], default: [] },

    bookingTips: { type: [String], default: [] },
    hotels: { type: [String], default: [] },
    foods: { type: [String], default: [] },
    features: { type: [String], default: [] },

    packageImages: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
