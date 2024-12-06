import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { IoCart } from "react-icons/io5";

const ProductCard = ({
	id,
	images,
	name,
	price,
	showPreOrder,
	showUpdateButton,
	showArchiveButton,
	showUnArchivedButton,
	onArchiveSuccess,
	onUnArchiveSuccess,
	showCart,
}) => {
  const navigate = useNavigate();

  const truncateText = (text, maxLength) => {
    if (typeof text !== "string") return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const archiveItem = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to archive this item?")) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/furnitures/archive/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      alert(data.success);
      onArchiveSuccess();
    } catch (error) {
      throw new Error("Error archiving item. Please try again.");
    }
  };

  const unarchiveItem = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to unarchive this item?"))
      return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/furnitures/unarchive/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      alert(data.success);
      onUnArchiveSuccess();
    } catch (error) {
      throw new Error("Error unarchiving item. Please try again.");
    }
  };

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-md shadow-md hover:shadow-lg transition-transform transform hover:scale-105 w-full max-w-sm p-4">
      <Link to={`/furnitures/${id}`} className="mb-4">
        {images && images.length > 0 ? (
          <img
            src={`data:image/jpeg;base64,${images[0]}`}
            alt={name}
            className="w-full h-48 object-contain rounded-md"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </Link>
      <div className="flex flex-col justify-between flex-grow">
        <h3 className="text-xl font-bold text-gray-800 truncate">
          {truncateText(name, 20)}
        </h3>
        <p className="text-black text-lg mt-2">₱{price}</p>

        <div className="mt-4 space-y-2">
          <div className="flex gap-1">
            {showPreOrder && (
              <button
                onClick={() => navigate(`/pre-order/${id}`)}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md"
              >
                Pre-order
              </button>
            )}
            {showCart && (
              <button
                onClick={() => navigate(`/furnitures/${id}`)}
                className="w-1/3 bg-teal-500 hover:bg-teal-600 text-white rounded-md flex justify-center items-center"
              >
                <IoCart className="text-center text-2xl" />
              </button>
            )}
          </div>

          {showUpdateButton && (
            <button
              onClick={() => navigate(`/furnitures/edit/${id}`)}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md"
            >
              Update Furniture
            </button>
          )}
          {showArchiveButton && (
            <button
              onClick={archiveItem}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
            >
              Archive
            </button>
          )}
          {showUnArchivedButton && (
            <button
              onClick={unarchiveItem}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
            >
              Unarchive
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductCard;
