import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProductReview = () => {
  const [reviews, setReviews] = useState([
    {
      name: "John Doe",
      rating: 5,
      comment: "Fantastic product! Highly recommend.",
      date: "November 18, 2024",
      photo: null,
    },
    {
      name: "Jane Smith",
      rating: 4,
      comment: "Great quality but a bit pricey.",
      date: "November 17, 2024",
      photo: null,
    },
  ]);

  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: "",
    photo: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setNewReview((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.rating || !newReview.comment) {
      alert("Please fill in all fields.");
      return;
    }

    const newReviewData = {
      ...newReview,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    setReviews((prev) => [newReviewData, ...prev]);
    setNewReview({ name: "", rating: 0, comment: "", photo: null });
    setPreviewImage(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Customer Reviews
        </h2>

        {/* Write Review Section */}
        <section className="mb-12 w-full max-w-2xl mx-auto">
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newReview.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`text-2xl ${
                        value <= newReview.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      onClick={() => handleRatingChange(value)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="comment"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={newReview.comment}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-500"
                  placeholder="Write your review here..."
                  rows="4"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="photo"
                >
                  Upload Photo (optional)
                </label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {previewImage && (
                  <div className="mt-4">
                    <img
                      src={previewImage}
                      alt="Uploaded preview"
                      className="max-w-full h-40 rounded-md shadow-md"
                    />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Submit Review
              </button>
            </form>
          </div>
        </section>

        {/* Display Reviews Section */}
        <section className="w-full border shadow-xl p-2 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">All Products Reviews</h3>
          <div className="grid grid-cols-2 gap-5 p-2">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="w-full h-64 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{review.name}</h3>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
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
                <p className="text-gray-700">{review.comment}</p>
                {review.photo && (
                  <div className="mt-4">
                    <img
                      src={review.photo}
                      alt="Review"
                      className="max-w-full h-auto rounded-md shadow-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductReview;
