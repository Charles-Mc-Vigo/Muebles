import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract the query from the URL
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (query) {
      fetch(`/api/furnitures/search?query=${query}`)
        .then((response) => response.json())
        .then((data) => {
          setResults(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setIsLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <ul>
          {results.map((item) => (
            <li key={item._id} className="border p-4 rounded mb-2">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p>Category ID: {item.categoryId}</p>
              <p>Materials: {item.materials.join(", ")}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found for "{query}".</p>
      )}
    </div>
  );
};

export default SearchResults;
