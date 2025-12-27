import React from "react";
import { FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const SingleCard = ({ packageData, backendUrl }) => {
  const safeImage = packageData.packageImages?.length > 0
    ? `${backendUrl}/uploads/${packageData.packageImages[0]}`
    : "/no-image.jpg";

  return (
    <Link
      to={`/package/${packageData._id}`}
      className="w-full flex flex-col gap-2 items-center bg-white rounded-md py-3 shadow-sm hover:scale-105 transition-transform cursor-pointer"
    >
      {/* Image */}
      <img
        src={safeImage}
        alt={packageData.packageName}
        className="rounded-md w-full h-48 object-cover"
      />

      {/* Name and Destination */}
      <div className="text-center">
        <h2 className="font-semibold text-blue-800">{packageData.packageName}</h2>
        <p className="text-gray-600">{packageData.packageDestination}</p>
      </div>

      {/* Duration */}
      {(+packageData.packageDays > 0 || +packageData.packageNights > 0) && (
        <p className="flex items-center gap-2 text-sm text-blue-600">
          <FaClock />
          {+packageData.packageDays > 0 && `${packageData.packageDays} Day${packageData.packageDays > 1 ? "s" : ""}`}
          {+packageData.packageDays > 0 && +packageData.packageNights > 0 && " - "}
          {+packageData.packageNights > 0 && `${packageData.packageNights} Night${packageData.packageNights > 1 ? "s" : ""}`}
        </p>
      )}
    </Link>
  );
};

export default SingleCard;
