import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
} from "react-icons/fa";
import MapModal from "./components/MapModal";
import RatingCard from "./RatingCard";
import Rating from "@mui/material/Rating";

const Package = () => {
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [packageData, setPackageData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [ratingGiven, setRatingGiven] = useState(false);
  const [packageRatings, setPackageRatings] = useState([]);

  const [ratingsData, setRatingsData] = useState({
    rating: 0,
    review: "",
    packageId: params?.id,
    userRef: currentUser?._id,
    username: currentUser?.username,
    userProfileImg: currentUser?.avatar,
  });

  const category = new URLSearchParams(location.search).get("category");

  // ✅ Helper for safe image URLs
  const getImageUrl = (img) => {
    if (!img) return "";
    if (typeof img === "string") {
      return img.startsWith("http")
        ? img
        : `http://localhost:8000/images/${img}`;
    }
    if (typeof img === "object") {
      const val = img.url || img.filename || img.path;
      return val
        ? val.startsWith("http")
          ? val
          : `http://localhost:8000/images/${val}`
        : "";
    }
    return "";
  };

  // ✅ Broken image logging
  const logBrokenImages = () => {
    if (!packageData?.packageImages) return;
    packageData.packageImages.forEach((img, i) => {
      const url = getImageUrl(img);
      fetch(url, { method: "HEAD" })
        .then((res) => {
          if (!res.ok) {
            console.warn(`Broken image detected at index ${i}:`, url);
          }
        })
        .catch(() => console.warn(`Failed to fetch image at index ${i}:`, url));
    });
  };

  // ✅ Fetch single package
  const getPackageData = async () => {
    if (!params.id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/package/get-package-data/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setPackageData(data.packageData);
        setPackageRatings(data.packageData.ratings || []);
        logBrokenImages(); // Log broken images
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Failed to fetch package data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch packages by category
  const getPackagesByCategory = async () => {
    if (!category) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/package/get-packages?category=${category}`);
      const data = await res.json();
      if (data.success) setPackages(data.packages);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit rating
  const giveRating = async () => {
    if (ratingGiven) return toast.error("You already submitted your rating!");
    if (!ratingsData.rating && !ratingsData.review) {
      return toast.error("At least one field is required!");
    }
    try {
      setLoading(true);
      const res = await fetch("/api/rating/give-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ratingsData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Review submitted!");
        setRatingGiven(true);
        getPackageData(); // Refresh ratings
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Error submitting rating");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    if (params.id) getPackageData();
    if (category) getPackagesByCategory();
  }, [params.id, category]);

  // ✅ Loading State
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // ✅ Category view
  if (category && packages.length > 0) {
    return (
      <div className="w-full px-4 md:px-10 py-6 space-y-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#05073C]">
          Packages in {category}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/package/${pkg._id}`)}
            >
              <img
                src={getImageUrl(pkg.packageImages?.[0])}
                alt={pkg.packageName}
                className="h-48 w-full object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{pkg.packageName}</h2>
                <p className="text-gray-600">{pkg.packageDestination}</p>
                <p className="text-orange-600 font-bold">
                  {pkg.packagePrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ If no package found
  if (!packageData) return <p className="text-center mt-10">No package found!</p>;

  // ✅ Single Package View
  return (
    <div className="w-full px-4 md:px-10 py-6 space-y-8 font-sans">
      <h1 className="text-4xl font-bold text-center my-6 text-[#05073C]">
        TRIP PLANNER
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Info Section */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h2 className="text-3xl font-semibold">{packageData.packageName}</h2>
          <p className="text-lg font-medium">{packageData.packageDestination}</p>
          <p className="text-lg font-medium">
            Category: {packageData.packageCategory}
          </p>
          <p className="text-lg font-semibold">₹{packageData.packagePrice}</p>

          {packageData.packageOffer && packageData.packageDiscountPrice > 0 && (
            <p className="text-lg text-red-500 font-semibold">
              Discount Price: ₹{packageData.packageDiscountPrice}
            </p>
          )}

          <p className="flex items-center gap-2">
            <FaClock /> {packageData.packageDays} Days -{" "}
            {packageData.packageNights} Nights
          </p>

          <div className="mt-4 space-y-2">
            {packageData.packageAccommodation && (
              <p>
                <strong>Accommodation:</strong> {packageData.packageAccommodation}
              </p>
            )}
            {packageData.packageTransportation && (
              <p>
                <strong>Transportation:</strong>{" "}
                {packageData.packageTransportation}
              </p>
            )}
            {packageData.packageMeals?.length > 0 && (
              <p>
                <strong>Meals:</strong> {packageData.packageMeals.join(", ")}
              </p>
            )}
            {packageData.packageActivities?.length > 0 && (
              <p>
                <strong>Activities:</strong>{" "}
                {packageData.packageActivities.join(", ")}
              </p>
            )}
          </div>

          <button
            className="mt-4 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
            onClick={() =>
              currentUser
                ? navigate(`/booking/${params.id}`)
                : navigate("/login")
            }
          >
            Book Now
          </button>
        </div>

        {/* Image Slider */}
        <div className="md:w-1/2">
          {packageData.packageImages?.length > 0 ? (
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              loop
              className="w-full h-[300px] md:h-[400px] rounded-xl"
            >
              {packageData.packageImages.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={getImageUrl(img)}
                    alt={`slide-${i}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center bg-gray-200">
              No Images Available
            </div>
          )}
        </div>
      </div>

      {/* Itinerary */}
      {packageData.itinerary?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {packageData.itinerary.map((day, idx) => (
            <div key={idx} className="p-4 border rounded-md bg-pink-50">
              <h3 className="font-semibold">DAY {idx + 1}</h3>
              <ul className="list-disc list-inside mt-2">
                {Array.isArray(day)
                  ? day.map((activity, i) => <li key={i}>{activity}</li>)
                  : <li>{day}</li>}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Foods / Features / Hotels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packageData.foods?.length > 0 && (
          <div className="p-4 border rounded-md bg-yellow-50">
            <h4 className="font-semibold mb-2">Foods</h4>
            <ul className="list-disc list-inside">
              {packageData.foods.map((food, i) => (
                <li key={i}>{food}</li>
              ))}
            </ul>
          </div>
        )}
        {packageData.features?.length > 0 && (
          <div className="p-4 border rounded-md bg-blue-50">
            <h4 className="font-semibold mb-2">Features</h4>
            <ul className="list-disc list-inside">
              {packageData.features.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
          </div>
        )}
        {packageData.hotels?.length > 0 && (
          <div className="p-4 border rounded-md bg-red-50">
            <h4 className="font-semibold mb-2">Hotels / Apartments</h4>
            <ul className="list-disc list-inside">
              {packageData.hotels.map((hotel, i) => (
                <li key={i}>{hotel}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Inclusions / Exclusions / Booking Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packageData.inclusions?.length > 0 && (
          <div className="border p-4 rounded-md bg-green-50">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FaCheckCircle /> Inclusions
            </h4>
            <ul className="list-disc list-inside">
              {packageData.inclusions.map((inc, i) => (
                <li key={i}>{inc}</li>
              ))}
            </ul>
          </div>
        )}
        {packageData.exclusions?.length > 0 && (
          <div className="border p-4 rounded-md bg-red-50">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FaTimesCircle /> Exclusions
            </h4>
            <ul className="list-disc list-inside">
              {packageData.exclusions.map((exc, i) => (
                <li key={i}>{exc}</li>
              ))}
            </ul>
          </div>
        )}
        {packageData.bookingTips?.length > 0 && (
          <div className="border p-4 rounded-md bg-purple-50">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FaLightbulb /> Booking Tips
            </h4>
            <ul className="list-disc list-inside">
              {packageData.bookingTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Rating Section */}
      {currentUser && !ratingGiven && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-3">Submit Your Review</h2>
          <Rating
            value={ratingsData.rating}
            onChange={(e, newValue) =>
              setRatingsData({ ...ratingsData, rating: newValue })
            }
          />
          <textarea
            className="w-full border rounded p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Write a review..."
            value={ratingsData.review}
            onChange={(e) =>
              setRatingsData({ ...ratingsData, review: e.target.value })
            }
          />
          <button
            className="mt-3 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
            onClick={giveRating}
          >
            Submit Review
          </button>
        </div>
      )}

      {/* Show Ratings */}
      <div className="grid md:grid-cols-2 gap-4">
        <RatingCard packageRatings={packageRatings} />
      </div>

      {/* Map Section */}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => setShowMap(true)}
      >
        View Map
      </button>
      {showMap && (
        <MapModal
          location={packageData.packageDestination}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
};

export default Package;
