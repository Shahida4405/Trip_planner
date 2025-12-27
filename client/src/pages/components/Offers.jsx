import React from "react";
import { FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const Offers = ({ packageData, backendUrl }) => {
  const safeImage = packageData.packageImages?.length > 0
    ? `${backendUrl}/uploads/${packageData.packageImages[0]}`
    : "/no-image.jpg";

  const safeDiscountPrice = () => {
    if (packageData.packageOffer && packageData.packageDiscountPrice) {
      const discountAmount = packageData.packagePrice - packageData.packageDiscountPrice;
      const discountPercent = (discountAmount / packageData.packagePrice) * 100;
      const cappedDiscountPercent = Math.min(discountPercent, 20);
      return (packageData.packagePrice - (cappedDiscountPercent / 100) * packageData.packagePrice).toFixed(2);
    }
    return packageData.packagePrice.toFixed(2);
  };

  return (
    <Link
      to={`/package/${packageData._id}`}
      className="w-[260px] flex flex-col gap-2 items-center bg-white rounded-md py-3 shadow-sm hover:scale-105 transition-transform cursor-pointer"
    >
      <img src={safeImage} alt={packageData.packageName} className="rounded-full w-20 h-20 object-cover" />

      <div>
        {packageData.packageOffer && packageData.packageDiscountPrice ? (
          <p className="text-sm">
            <span className="line-through text-gray-700">₹{packageData.packagePrice}</span> -{" "}
            <span className="text-sm text-[#EB662B] font-semibold">₹{safeDiscountPrice()}</span>
          </p>
        ) : (
          <p className="text-sm">₹{packageData.packagePrice}</p>
        )}
      </div>

      <div className="text-center">
        <h2 className="text-[#EB662B] font-semibold">{packageData.packageName}</h2>
        <p className="text-gray-600">{packageData.packageDestination}</p>
      </div>

      {(+packageData.packageDays > 0 || +packageData.packageNights > 0) && (
        <p className="flex text-sm items-center gap-2 text-[#EB662B]">
          <FaClock />
          {+packageData.packageDays > 0 && `${packageData.packageDays} Day${packageData.packageDays > 1 ? "s" : ""}`}
          {+packageData.packageDays > 0 && +packageData.packageNights > 0 && " - "}
          {+packageData.packageNights > 0 && `${packageData.packageNights} Night${packageData.packageNights > 1 ? "s" : ""}`}
        </p>
      )}

      <button className="bg-[#EB662B] text-white px-3 py-1 rounded-md text-sm font-medium mt-2 hover:bg-[#d4551f] transition">
        View Details
      </button>
    </Link>
  );
};

export default Offers;
