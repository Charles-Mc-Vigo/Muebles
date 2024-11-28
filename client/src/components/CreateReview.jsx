import React, { useState } from "react";

const CreateReview = ({ onSubmit }) => {
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: "",
    photos: [],
  });
  const [previewImages, setPreviewImages] = useState([]);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        previews.push(reader.result);
        setPreviewImages((prev) => [...prev, reader.result]);
        setNewReview((prev) => ({
          ...prev,
          photos: [...prev.photos, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validation: Check if all required fields are filled
    if (!newReview.name || !newReview.rating || !newReview.comment) {
      alert("Please fill in all fields.");
      return;
    }

    // Prepare the review data for submission
    const reviewData = {
      ...newReview,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    console.log("Submitted Review Data:", reviewData); 
    onSubmit(reviewData); 

    setNewReview({ name: "", rating: 0, comment: "", photos: [] });
    setPreviewImages([]);
  };

  return (
    <section className="mb-12 w-full max-w-2xl mx-auto my-5">
      <div className="p-6 border border-teal-500 rounded-lg shadow-sm">
        <h3 className="text-3xl font-bold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-2xl font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newReview.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring focus:ring-teal-500"
              placeholder="Enter your name"
              required
            />
          </div>
          {/* Rating */}
          <div>
            <label className="block text-2xl font-medium mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`text-2xl ${
                    value <= newReview.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => handleRatingChange(value)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          {/* Comment */}
          <div>
            <label className="block text-2xl font-medium mb-1" htmlFor="comment">
              Comment
            </label>
            <textarea
              id="comment"
              name="comment"
              value={newReview.comment}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring focus:ring-teal-500"
              placeholder="Write your review here..."
              rows="4"
              required
            />
          </div>
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="photo">
              Upload Photos (optional)
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-blue-100"
            />
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {previewImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md shadow-md"
                  />
                ))}
              </div>
            )}
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-800"
          >
            Submit Review
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateReview;