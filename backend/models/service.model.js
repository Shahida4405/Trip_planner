import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
    },
    image: {
      type: String, // store image filename or URL
      default: "",
    },
    amount: {
      type: Number,
      required: [true, "Service amount is required"],
      min: [0, "Amount must be positive"],
    },
    noOfDays: {
      type: Number,
      required: [true, "Number of days is required"],
      min: [1, "Must be at least 1 day"],
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
