import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const ProductReview = () => {
  // Sample reviews data
  const [reviews, setReviews] = useState([
    {
      name: "Alice Johnson",
      rating: 5,
      comment: "Absolutely loved this product! Highly recommend it.",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      photos: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
    },
    {
      name: "Bob Smith",
      rating: 4,
      comment: "Great quality, but took a bit longer to arrive.",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      photos: ["https://via.placeholder.com/150"],
    },
    {
      name: "Charlie Brown",
      rating: 3,
      comment: "It's okay, but I've seen better.",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      photos: [],
    },
    {
      name: "Diana Prince",
      rating: 5,
      comment: "Fantastic! Exceeded my expectations.",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      photos: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
    },
    {
      name: "Ethan Hunt",
      rating: 2,
      comment: "Not what I expected. Very disappointed.",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      photos: [],
    },
  ]);

 

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 p-2">
    {reviews.map((review, index) => (
      <div
        key={index}
        className="w-full h-auto p-4 border border-teal-500 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col"
      >
        {/* Review Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{review.name}</h3>
          <span className="text-sm text-gray-500">{review.date}</span>
        </div>
  
        {/* Rating */}
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              fill={i < review.rating ? "gold" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-yellow-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 17.75l-4.406 2.317a.75.75 0 01-1.088-.797l.841-4.9L3.5 10.08a.75.75 0 01.415-1.277l4.938-.717 2.207-4.477a.75.75 0 011.346 0l2.207 4.477 4.938.717a.75.75 0 01.415 1.277l-3.587 3.292.841 4.9a.75.75 0 01-1.088.797L12 17.75z"
              />
            </svg>
          ))}
        </div>
  
        {/* Review Comment */}
        <p className="text-black">{review.comment}</p>
  
        {/* Review Photos */}
        {review.photos?.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {review.photos.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Review ${idx + 1}`}
                className="max-w-full h-32 object-contain rounded-md shadow-md"
              />
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
  
  );
};

export default ProductReview;
