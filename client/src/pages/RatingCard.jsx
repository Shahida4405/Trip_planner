import { Rating } from "@mui/material";
import React, { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const RatingCard = ({ packageRatings }) => {
  const [activePopup, setActivePopup] = useState(null);

  return (
    <>
      {packageRatings &&
        packageRatings.map((rating, i) => {
          const hasLongReview = rating.review && rating.review.length > 90;
          const previewText = hasLongReview
            ? rating.review.substring(0, 45) + "..."
            : rating.review || (rating.rating < 3 ? "Not Bad" : "Good");

          return (
            <div
              key={i}
              className="main relative w-full rounded-lg border p-3 gap-2 flex flex-col"
            >
              {/* User info */}
              <div className="flex gap-2 items-center">
                <img
                  src={
                    rating.userProfileImg
                      ? `http://localhost:8000/images/${rating.userProfileImg}`
                      : "/defaultProfile.png"
                  }
                  alt={rating.username[0]}
                  className="border w-6 h-6 border-black rounded-full"
                />
                <p className="font-semibold">{rating.username}</p>
              </div>

              {/* Rating stars */}
              <Rating
                value={rating.rating || 0}
                readOnly
                size="small"
                precision={0.1}
              />

              {/* Review preview */}
              <p className="break-words">
                <span>{previewText}</span>
                {hasLongReview && (
                  <button
                    className="m-1 font-semibold flex items-center gap-1"
                    onClick={() =>
                      setActivePopup(activePopup === i ? null : i)
                    }
                  >
                    {activePopup === i ? "Less" : "More"}
                    {activePopup === i ? <FaArrowUp /> : <FaArrowDown />}
                  </button>
                )}
              </p>

              {/* Full review popup */}
              {hasLongReview && activePopup === i && (
                <div className="absolute left-0 top-0 w-full bg-white border rounded-lg p-3 z-50">
                  <div className="flex gap-2 items-center">
                    <img
                      src={
                        rating.userProfileImg
                          ? `http://localhost:8000/images/${rating.userProfileImg}`
                          : "/defaultProfile.png"
                      }
                      alt={rating.username[0]}
                      className="border w-6 h-6 border-black rounded-full"
                    />
                    <p className="font-semibold">{rating.username}</p>
                  </div>
                  <Rating
                    value={rating.rating || 0}
                    readOnly
                    size="small"
                    precision={0.1}
                  />
                  <p className="break-words mt-2">{rating.review}</p>
                </div>
              )}
            </div>
          );
        })}
    </>
  );
};

export default RatingCard;
