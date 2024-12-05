import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ProductCard from "./ProductCard"; // Import your ProductCard component

const SearchResults = () => {
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];

  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {searchResults.length > 0 ? (
          searchResults.map((result) => (
            <ProductCard
              key={result._id}
              id={result._id}
              images={result.images}
              name={result.name}
              price={result.price}
              description={result.description}
              showPreOrder={true} // Show Pre-order button
              
            />
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