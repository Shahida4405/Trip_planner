import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AddPackages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Prefill category from query param if exists
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "";

  const [formData, setFormData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageCategory: initialCategory,
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: [],
    packageActivities: [],
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    inclusions: [],
    exclusions: [],
    itinerary: [],
    bookingTips: [],
    hotels: [],
    foods: [],
    features: [],
    packageImages: [],
  });

  const [loading, setLoading] = useState(false);

  // Handle normal input changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  // Handle JSON/line-separated fields
  const handleJsonFieldChange = (id, value) => {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) throw new Error("Not an array");
      setFormData((prev) => ({ ...prev, [id]: parsed }));
    } catch {
      const lines = value
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");
      setFormData((prev) => ({ ...prev, [id]: lines }));
    }
  };

  // Handle file selection
  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      packageImages: files,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.packageName ||
      !formData.packageDescription ||
      !formData.packageDestination ||
      !formData.packageAccommodation ||
      !formData.packageTransportation ||
      formData.packageMeals.length === 0 ||
      formData.packageActivities.length === 0
    ) {
      toast.error("All fields are required!");
      return;
    }

    if (formData.packagePrice < 500) {
      toast.error("Price should be at least 500!");
      return;
    }

    if (
      formData.packageOffer &&
      formData.packageDiscountPrice >= formData.packagePrice
    ) {
      toast.error("Discount Price must be less than Regular Price!");
      return;
    }

    if (formData.packageImages.length === 0) {
      toast.error("You must upload at least 1 image!");
      return;
    }

    if (formData.hotels.length < 2) {
      toast.error("Each package must include at least 2 hotels!");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "packageImages") {
          formData.packageImages.forEach((file) => {
            data.append("packageImages", file);
          });
        } else if (
          [
            "packageMeals",
            "packageActivities",
            "inclusions",
            "exclusions",
            "itinerary",
            "bookingTips",
            "hotels",
            "foods",
            "features",
          ].includes(key)
        ) {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      const res = await axios.post(
        "http://localhost:8000/api/package/create-package",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("✅ Package created successfully!");
        setFormData({
          packageName: "",
          packageDescription: "",
          packageDestination: "",
          packageCategory: initialCategory,
          packageDays: 1,
          packageNights: 1,
          packageAccommodation: "",
          packageTransportation: "",
          packageMeals: [],
          packageActivities: [],
          packagePrice: 500,
          packageDiscountPrice: 0,
          packageOffer: false,
          inclusions: [],
          exclusions: [],
          itinerary: [],
          bookingTips: [],
          hotels: [],
          foods: [],
          features: [],
          packageImages: [],
        });
        navigate("/admin/packages");
      } else {
        toast.error(res.data.message || "❌ Failed to create package!");
      }
    } catch (err) {
      console.error("Create Package Error:", err.response?.data || err.message);
      if (err.response?.status === 400) {
        toast.error("⚠️ Validation failed: " + JSON.stringify(err.response.data.errors));
      } else {
        toast.error("⚠️ Internal server error!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 w-full min-h-screen flex items-center justify-center bg-[#EB662B] text-white rounded-lg">
      <div className="w-[95%] md:w-[90%] lg:w-[80%] mx-auto flex flex-col gap-6 rounded-xl shadow-xl py-8">
        <h1 className="text-center text-lg font-semibold md:text-3xl md:font-bold text-white">
          Add <span className="">Package</span>
        </h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 px-4">
          {/* Name */}
          <div className="flex flex-col">
            <label>Name:</label>
            <input
              type="text"
              id="packageName"
              value={formData.packageName}
              onChange={handleChange}
              className="p-2 border rounded bg-gray-200 text-gray-800 outline-none"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label>Description:</label>
            <textarea
              id="packageDescription"
              value={formData.packageDescription}
              onChange={handleChange}
              className="p-2 border rounded bg-gray-200 text-gray-800 outline-none resize-none"
            />
          </div>

          {/* Destination */}
          <div className="flex flex-col">
            <label>Destination:</label>
            <input
              type="text"
              id="packageDestination"
              value={formData.packageDestination}
              onChange={handleChange}
              className="p-2 border rounded bg-gray-200 text-gray-800 outline-none"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label>Category:</label>
            <input
              type="text"
              id="packageCategory"
              value={formData.packageCategory}
              onChange={handleChange}
              className="p-2 border rounded bg-gray-200 text-gray-800 outline-none"
            />
          </div>

          {/* Days & Nights */}
          <div className="flex gap-3">
            <div className="flex flex-col w-full">
              <label>Days:</label>
              <input
                type="number"
                id="packageDays"
                value={formData.packageDays}
                onChange={handleChange}
                className="p-2 border rounded bg-gray-200 text-gray-800 outline-none"
              />
            </div>
            <div className="flex flex-col w-full">
              <label>Nights:</label>
              <input
                type="number"
                id="packageNights"
                value={formData.packageNights}
                onChange={handleChange}
                className="p-2 border rounded bg-gray-200 text-gray-800 outline-none"
              />
            </div>
          </div>

          {/* Accommodation */}
          <div className="flex flex-col">
            <label>Accommodation:</label>
            <textarea
              id="packageAccommodation"
              value={formData.packageAccommodation}
              onChange={handleChange}
              className="p-2 border rounded bg-gray-200 text-gray-800 outline-none resize-none"
            />
          </div>

          {/* Transportation */}
          <div className="flex flex-col">
            <label>Transportation:</label>
            <select
              id="packageTransportation"
              value={formData.packageTransportation}
              onChange={handleChange}
              className="p-2 border rounded bg-gray-200 text-gray-800 outline-none"
            >
              <option value="">Select</option>
              <option>Flight</option>
              <option>Train</option>
              <option>Boat</option>
              <option>Other</option>
            </select>
          </div>

          {/* Meals */}
          <div className="flex flex-col">
            <label>Meals (one per line):</label>
            <textarea
              id="packageMeals"
              value={formData.packageMeals.join("\n")}
              onChange={(e) => handleJsonFieldChange("packageMeals", e.target.value)}
              className="p-2 border rounded bg-gray-200 text-gray-800 outline-none resize-none"
            />
          </div>

          {/* Activities */}
          <div className="flex flex-col">
            <label>Activities (one per line):</label>
            <textarea
              id="packageActivities"
              value={formData.packageActivities.join("\n")}
              onChange={(e) => handleJsonFieldChange("packageActivities", e.target.value)}
              className="p-2 border rounded bg-gray-200 text-gray-800 outline-none resize-none"
            />
          </div>

          {/* Price & Offer */}
          <div className="flex gap-3">
            <div className="flex flex-col w-full">
              <label>Price:</label>
              <input
                type="number"
                id="packagePrice"
                value={formData.packagePrice}
                onChange={handleChange}
                className="p-2 border rounded bg-gray-200 text-gray-800 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="packageOffer">Offer:</label>
              <input
                type="checkbox"
                id="packageOffer"
                checked={formData.packageOffer}
                onChange={handleChange}
                className="w-4 h-4"
              />
            </div>
          </div>

          {formData.packageOffer && (
            <div className="flex flex-col">
              <label>Discount Price:</label>
              <input
                type="number"
                id="packageDiscountPrice"
                value={formData.packageDiscountPrice}
                onChange={handleChange}
                className="p-2 border rounded bg-gray-200 text-gray-800 outline-none"
              />
            </div>
          )}

          {/* Flexible JSON / line-separated fields */}
          {[
            { label: "Inclusions", key: "inclusions" },
            { label: "Exclusions", key: "exclusions" },
            { label: "Itinerary", key: "itinerary" },
            { label: "Booking Tips", key: "bookingTips" },
            { label: "Hotels (at least 2)", key: "hotels" },
            { label: "Foods", key: "foods" },
            { label: "Features", key: "features" },
          ].map(({ label, key }) => (
            <div className="flex flex-col" key={key}>
              <label>{label} (one per line):</label>
              <textarea
                id={key}
                value={formData[key].join("\n")}
                onChange={(e) => handleJsonFieldChange(key, e.target.value)}
                className="p-2 border rounded bg-gray-200 text-gray-800 outline-none resize-none"
              />
            </div>
          ))}

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium mb-2">Upload Images</label>
            <div className="relative flex items-center justify-center w-full cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFile}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-gray-500">Click to select images</span>
            </div>

            {/* Image Previews */}
            {formData.packageImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {formData.packageImages.map((file, index) => {
                  const imageUrl = URL.createObjectURL(file);
                  return (
                    <div
                      key={index}
                      className="relative w-full aspect-square border border-gray-300 rounded overflow-hidden"
                    >
                      <img
                        src={imageUrl}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="text-white p-3 rounded bg-black hover:opacity-95 disabled:opacity-70 mt-2"
          >
            {loading ? "Loading..." : "Create New Package"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPackages;
