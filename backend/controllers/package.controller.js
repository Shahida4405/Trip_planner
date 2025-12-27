// backend/controllers/package.controller.js
import Package from "../models/package.model.js";
import dotenv from "dotenv";
dotenv.config();

// ====================== Create Package ======================

// helper → parse JSON safely
const parseField = (field) => {
  try {
    return JSON.parse(field);
  } catch {
    return field;
  }
};

// backend/controllers/package.controller.js


export const createPackage = async (req, res) => {
  try {
    const {
      packageName,
      packageDescription,
      packageDestination,
      packageCategory,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packagePrice,
      discount, // incoming discount in %
      packageMeals,
      packageActivities,
      inclusions,
      exclusions,
      itinerary,
      bookingTips,
      hotels,
      foods,
      features,
    } = req.body;

    // ====================== Discount Calculation ======================
    const maxDiscount = 20; // maximum discount %
    const appliedDiscount = Math.min(Number(discount) || 0, maxDiscount);
    const packageDiscountPrice =
      Number(packagePrice || 0) - (Number(packagePrice || 0) * appliedDiscount) / 100;

    // ====================== Create Package ======================
    const newPackage = new Package({
      packageName,
      packageDescription,
      packageDestination,
      packageCategory,
      packageDays: Number(packageDays) || 1,
      packageNights: Number(packageNights) || 0,
      packageAccommodation,
      packageTransportation,
      packagePrice: Number(packagePrice) || 0,
      packageDiscountPrice,
      packageOffer: appliedDiscount > 0, // offer is true if discount applied

      // Arrays
      packageMeals: parseField(packageMeals),
      packageActivities: parseField(packageActivities),
      inclusions: parseField(inclusions),
      exclusions: parseField(exclusions),
      itinerary: parseField(itinerary),
      bookingTips: parseField(bookingTips),
      hotels: parseField(hotels),
      foods: parseField(foods),
      features: parseField(features),

      // Images → save only filename
      packageImages: req.files?.map((file) => file.filename) || [],
    });

    await newPackage.save();

    return res.status(201).json({
      success: true,
      message: "Package created successfully",
      package: newPackage,
    });
  } catch (error) {
    console.error("Create Package Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ====================== Get All Packages (with search & filter) ======================
export const getPackages = async (req, res) => {
  try {
    const {
      category,
      searchTerm,
      offer,
      sort = "createdAt",
      order = "desc",
      startIndex = 0,
      limit = 8,
    } = req.query;

    const filter = {};

    // Filter by category
    if (category) {
      filter.packageCategory = { $regex: `^${category}$`, $options: "i" };
    }

    // Filter by search term
    if (searchTerm) {
      const decodedSearch = decodeURIComponent(searchTerm);
      filter.$or = [
        { packageName: { $regex: decodedSearch, $options: "i" } },
        { packageDestination: { $regex: decodedSearch, $options: "i" } },
      ];
    }

    // Filter by offer
    if (offer === "true") {
      filter.packageOffer = true;
    }

    // Sorting
    const sortOption = {};
    sortOption[sort] = order === "asc" ? 1 : -1;

    // Pagination
    const packages = await Package.find(filter)
      .sort(sortOption)
      .skip(Number(startIndex))
      .limit(Number(limit));

    res.json({ success: true, packages });
  } catch (err) {
    console.error("Get Packages Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ====================== Get Package Data by ID ======================
export const getPackageData = async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id);
    if (!packageData)
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });

    res.status(200).json({ success: true, packageData });
  } catch (error) {
    console.error("Get Package Data Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching package data",
      error: error.message,
    });
  }
};

// ====================== Update Package ======================
export const updatePackage = async (req, res) => {
  try {
    const {
      packageName,
      packageDescription,
      packageDestination,
      packageCategory,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packagePrice,
      discount,
      packageMeals,
      packageActivities,
      inclusions,
      exclusions,
      itinerary,
      bookingTips,
      hotels,
      foods,
      features,
    } = req.body;

    // ====================== Discount Calculation ======================
    const maxDiscount = 20;
    const appliedDiscount = Math.min(Number(discount) || 0, maxDiscount);
    const packageDiscountPrice =
      Number(packagePrice || 0) -
      (Number(packagePrice || 0) * appliedDiscount) / 100;

    // ====================== Safe JSON Parse ======================
    const safeParse = (field) => {
      try {
        return field ? JSON.parse(field) : [];
      } catch {
        return [];
      }
    };

    // ====================== Find Existing Package ======================
    const existingPackage = await Package.findById(req.params.id);
    if (!existingPackage) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }

    // ====================== Merge Images ======================
    let updatedImages = existingPackage.packageImages;
    if (req.files?.length > 0) {
      // Save only filenames
      const newImages = req.files.map((f) => f.filename);
      updatedImages = [...updatedImages, ...newImages];
    }

    // ====================== Update Package ======================
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      {
        packageName,
        packageDescription,
        packageDestination,
        packageCategory,
        packageDays: Number(packageDays) || 1,
        packageNights: Number(packageNights) || 0,
        packageAccommodation,
        packageTransportation,
        packagePrice: Number(packagePrice) || 0,
        packageDiscountPrice,
        packageOffer: appliedDiscount > 0,
        packageMeals: safeParse(packageMeals),
        packageActivities: safeParse(packageActivities),
        packageImages: updatedImages,
        inclusions: safeParse(inclusions),
        exclusions: safeParse(exclusions),
        itinerary: safeParse(itinerary),
        bookingTips: safeParse(bookingTips),
        hotels: safeParse(hotels),
        foods: safeParse(foods),
        features: safeParse(features),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Package updated successfully!",
      updatedPackage,
    });
  } catch (error) {
    console.error("Update Package Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update package",
      error: error.message,
    });
  }
};

// ====================== Delete Package ======================
export const deletePackage = async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: "Package Deleted!",
    });
  } catch (error) {
    console.error("Delete Package Error:", error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while deleting package",
      error: error.message,
    });
  }
};
