import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

const UpdatePackage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageCategory: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: [],
    packageActivities: [],
    itinerary: [],
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    inclusions: [],
    exclusions: [],
    bookingTips: [],
    hotels: [],
    foods: [],
    features: [],
    packageImages: [], // existing image filenames
  });

  const [images, setImages] = useState([]); // new uploaded images
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- Helper ----------------
  const getImageUrl = (filename) => `http://localhost:8000/images/${filename}`;

  // ---------------- Fetch Package Data ----------------
  const getPackageData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/package/get-package-data/${params.id}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          ...data.packageData,
        }));
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch package data");
    }
  };

  useEffect(() => {
    if (params.id) getPackageData();
  }, [params.id]);

  // ---------------- Handlers ----------------
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayField = (field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const handleFile = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImages =
      selectedFiles.length + images.length + formData.packageImages.length;
    if (totalImages > 10) {
      toast.error("You can only upload 10 images per package");
      return;
    }
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const removeExistingImage = (filename) => {
    setFormData((prev) => ({
      ...prev,
      packageImages: prev.packageImages.filter((img) => img !== filename),
    }));
  };

  // ---------------- Submit Update ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.packageName || !formData.packageDescription) {
      toast.error("Name and Description are required!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const form = new FormData();
      // Append all fields except images
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          form.append(key, JSON.stringify(value));
        } else if (key !== "packageImages") {
          form.append(key, value);
        }
      });

      // Append existing images filenames to keep
      formData.packageImages.forEach((img) => {
        form.append("existingImages", img);
      });

      // Append new uploaded images
      images.forEach((image) => {
        form.append("packageImages", image);
      });

      const res = await fetch(
        `http://localhost:8000/api/package/update-package/${params.id}`,
        {
          method: "PUT",
          body: form,
          credentials: "include",
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Package updated successfully!");
        navigate(`/package/${params.id}`);
      } else {
        setError(data.message || "Failed to update package");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-wrap justify-center gap-4 p-6">
      {/* ---------------- Form Section ---------------- */}
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[60%] space-y-4 shadow-md rounded-xl p-6 bg-white"
      >
        <h1 className="text-center text-2xl font-semibold">Update Package</h1>

        {/* Basic Fields */}
        {[
          { label: "Name", id: "packageName", type: "text" },
          { label: "Description", id: "packageDescription", type: "textarea" },
          { label: "Destination", id: "packageDestination", type: "text" },
          { label: "Category", id: "packageCategory", type: "text" },
          { label: "Days", id: "packageDays", type: "number" },
          { label: "Nights", id: "packageNights", type: "number" },
          { label: "Accommodation", id: "packageAccommodation", type: "textarea" },
          { label: "Price", id: "packagePrice", type: "number" },
        ].map((field) => (
          <div key={field.id}>
            <label className="font-medium">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                id={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
              />
            ) : (
              <input
                type={field.type}
                id={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
              />
            )}
          </div>
        ))}

        {/* Transportation */}
        <div>
          <label className="font-medium">Transportation</label>
          <select
            id="packageTransportation"
            value={formData.packageTransportation}
            onChange={handleChange}
            className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
          >
            <option value="">Select</option>
            <option value="Flight">Flight</option>
            <option value="Train">Train</option>
            <option value="Boat">Boat</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Offer */}
        <div className="flex items-center gap-2">
          <label className="font-medium" htmlFor="packageOffer">
            Offer
          </label>
          <input
            type="checkbox"
            id="packageOffer"
            checked={formData.packageOffer}
            onChange={handleChange}
            className="w-5 h-5"
          />
        </div>
        {formData.packageOffer && (
          <div>
            <label className="font-medium">Discount Price</label>
            <input
              type="number"
              id="packageDiscountPrice"
              value={formData.packageDiscountPrice}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
            />
          </div>
        )}

        {/* Dynamic Array Fields */}
        {[
          "packageMeals",
          "packageActivities",
          "itinerary",
          "hotels",
          "foods",
          "features",
          "inclusions",
          "exclusions",
          "bookingTips",
        ].map((field) => (
          <div key={field}>
            <label className="font-medium capitalize">{field}</label>
            {formData[field].map((item, i) => (
              <div key={i} className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(field, i, e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField(field, i)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField(field)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              Add {field.slice(0, -1)}
            </button>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-[#EB662B] text-white p-3 rounded-md hover:opacity-90 disabled:opacity-80 mt-4"
        >
          {loading ? "Updating..." : "Update Package"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {/* ---------------- Images Section ---------------- */}
      <div className="w-full sm:w-[30%] space-y-4 shadow-md rounded-xl p-4 bg-white">
        <label className="font-medium">Package Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFile}
          className="w-full mt-2 p-2 border rounded-md bg-gray-200 outline-none"
        />

        {/* Existing images */}
        {formData.packageImages.length > 0 && (
          <div className="space-y-2 mt-2 flex flex-wrap gap-2">
            {formData.packageImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={getImageUrl(img)}
                  alt=""
                  className="h-20 w-20 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New images */}
        {images.length > 0 && (
          <div className="space-y-2 mt-2 flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <p>{img.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatePackage;
