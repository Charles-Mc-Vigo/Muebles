import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom"; // Use for navigation (optional for pre-order action)

const SearchResults = () => {
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];
  const navigate = useNavigate(); // Navigate hook if needed for pre-order or details page

  // Handle pre-order button click
  const handlePreOrder = (productId) => {
    // Example: Navigate to a pre-order page or trigger any other action
    console.log("Pre-order clicked for product ID:", productId);
    // navigate(`/pre-order/${productId}`); // Optionally, navigate to a specific pre-order page
  };

  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {searchResults.length > 0 ? (
          searchResults.map((result) => (
            <div
              key={result._id}
              className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center">
                {/* Image */}
                <img
                  src={result.images[0]} // Assuming the first image is the main one
                  alt={result.name}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />

                {/* Product Name */}
                <h3 className="text-xl font-semibold text-gray-800">{result.name}</h3>

                {/* Price */}
                <p className="text-lg text-teal-600 font-bold mb-4">${result.price}</p>

                {/* Description (optional) */}
                <p className="text-gray-600 text-sm mb-4">{result.description}</p>

                {/* Pre-order Button */}
                <button
                  onClick={() => handlePreOrder(result._id)}
                  className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  Pre-order
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No results to display</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
