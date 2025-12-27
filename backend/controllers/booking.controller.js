import Booking from "../models/booking.model.js";
import Package from "../models/package.model.js";
import { ObjectId } from "mongodb";

// ======================================================
// BOOK PACKAGE
// ======================================================
export const bookPackage = async (req, res) => {
  try {
    const { packageDetails, buyer, totalPrice, persons, date } = req.body;

    if (req.user.id !== buyer) {
      return res.status(401).send({
        success: false,
        message: "You can only buy on your account!",
      });
    }

    if (!packageDetails || !buyer || !totalPrice || !persons || !date) {
      return res.status(200).send({
        success: false,
        message: "All fields are required!",
      });
    }

    const validPackage = await Package.findById(packageDetails);

    if (!validPackage) {
      return res.status(404).send({
        success: false,
        message: "Package Not Found!",
      });
    }

    const newBooking = await Booking.create(req.body);

    if (newBooking) {
      return res.status(201).send({
        success: true,
        message: "Package Booked!",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// ======================================================
// ADMIN: CURRENT BOOKINGS
// ======================================================
export const getCurrentBookings = async (req, res) => {
  try {
    const searchTerm = req?.query?.searchTerm || "";

    const bookings = await Booking.find({
      date: { $gt: new Date().toISOString() },
      status: "Booked",
    })
      .populate("packageDetails")
      .populate({
        path: "buyer",
        match: {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      })
      .sort({ createdAt: "asc" });

    const filtered = bookings.filter((b) => b.buyer !== null);

    if (filtered.length) {
      return res.status(200).send({
        success: true,
        bookings: filtered,
      });
    }

    return res.status(200).send({
      success: false,
      message: "No Bookings Available",
    });
  } catch (error) {
    console.log(error);
  }
};

// ======================================================
// ADMIN: ALL BOOKINGS
// ======================================================
export const getAllBookings = async (req, res) => {
  try {
    const searchTerm = req?.query?.searchTerm || "";

    const bookings = await Booking.find({})
      .populate("packageDetails")
      .populate({
        path: "buyer",
        match: {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      })
      .sort({ createdAt: "asc" });

    const filtered = bookings.filter((b) => b.buyer !== null);

    if (filtered.length) {
      return res.status(200).send({
        success: true,
        bookings: filtered,
      });
    }

    return res.status(200).send({
      success: false,
      message: "No Bookings Available",
    });
  } catch (error) {
    console.log(error);
  }
};

// ======================================================
// USER: CURRENT BOOKINGS
// ======================================================
export const getUserCurrentBookings = async (req, res) => {
  try {
    if (req?.user?.id !== req?.params?.id) {
      return res.status(401).send({
        success: false,
        message: "You can only get your own bookings!!",
      });
    }

    const searchTerm = req?.query?.searchTerm || "";

    const bookings = await Booking.find({
      buyer: new ObjectId(req?.params?.id),
      date: { $gt: new Date().toISOString() },
      status: "Booked",
    })
      .populate({
        path: "packageDetails",
        match: {
          packageName: { $regex: searchTerm, $options: "i" },
        },
      })
      .populate("buyer", "username email")
      .sort({ createdAt: "asc" });

    const filtered = bookings.filter((b) => b.packageDetails !== null);

    if (filtered.length) {
      return res.status(200).send({
        success: true,
        bookings: filtered,
      });
    }

    return res.status(200).send({
      success: false,
      message: "No Bookings Available",
    });
  } catch (error) {
    console.log(error);
  }
};

// ======================================================
// USER: ALL BOOKINGS
// ======================================================
export const getAllUserBookings = async (req, res) => {
  try {
    if (req?.user?.id !== req?.params?.id) {
      return res.status(401).send({
        success: false,
        message: "You can only get your own bookings!!",
      });
    }

    const searchTerm = req?.query?.searchTerm || "";

    const bookings = await Booking.find({
      buyer: new ObjectId(req?.params?.id),
    })
      .populate({
        path: "packageDetails",
        match: {
          packageName: { $regex: searchTerm, $options: "i" },
        },
      })
      .populate("buyer", "username email")
      .sort({ createdAt: "asc" });

    const filtered = bookings.filter((b) => b.packageDetails !== null);

    if (filtered.length) {
      return res.status(200).send({
        success: true,
        bookings: filtered,
      });
    }

    return res.status(200).send({
      success: false,
      message: "No Bookings Available",
    });
  } catch (error) {
    console.log(error);
  }
};

// ======================================================
// DELETE BOOKING HISTORY
// ======================================================
export const deleteBookingHistory = async (req, res) => {
  try {
    if (req?.user?.id !== req?.params?.userId) {
      return res.status(401).send({
        success: false,
        message: "You can only delete your booking history!",
      });
    }

    const deleted = await Booking.findByIdAndDelete(req?.params?.id);

    if (deleted) {
      return res.status(200).send({
        success: true,
        message: "Booking History Deleted!",
      });
    }

    return res.status(500).send({
      success: false,
      message: "Something went wrong while deleting booking history!",
    });
  } catch (error) {
    console.log(error);
  }
};

// ======================================================
// CANCEL BOOKING
// ======================================================
export const cancelBooking = async (req, res) => {
  try {
    if (req.user.id !== req?.params?.userId) {
      return res.status(401).send({
        success: false,
        message: "You can only cancel your bookings!",
      });
    }

    const updated = await Booking.findByIdAndUpdate(
      req?.params?.id,
      { status: "Cancelled" },
      { new: true }
    );

    if (updated) {
      return res.status(200).send({
        success: true,
        message: "Booking Cancelled!",
      });
    }

    return res.status(500).send({
      success: false,
      message: "Something went wrong while cancelling booking!",
    });
  } catch (error) {
    console.log(error);
  }
};

// ======================================================
// CHECK IF USER COMPLETED TRAVEL BEFORE REVIEW
// ======================================================
export const checkTravelComplete = async (req, res) => {
  try {
    const { userId, packageId } = req.params;

    // user can only check their own travel completion
    if (req.user.id !== userId) {
      return res.status(401).send({
        success: false,
        message: "You can only check your own travel status!",
      });
    }

    // check booking
    const booking = await Booking.findOne({
      buyer: userId,
      packageDetails: packageId,
    });

    if (!booking) {
      return res.status(404).send({
        success: false,
        completed: false,
        message: "No booking found for this package!",
      });
    }

    const travelDate = new Date(booking.date);
    const today = new Date();

    // If travel is completed
    if (travelDate <= today) {
      return res.status(200).send({
        success: true,
        completed: true,
        message: "You have completed your trip. You can give a review!",
      });
    }

    return res.status(200).send({
      success: true,
      completed: false,
      message: "Trip not completed yet!",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      completed: false,
      message: "Server error!",
    });
  }
};
