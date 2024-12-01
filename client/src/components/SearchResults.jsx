import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const SearchResults= () => {
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];
  console.log("Search Results from location.state:", searchResults); 

  return (
    <div>
      <Header/>
      <div>
      {searchResults.length > 0 ? (
        <div>
          <h2>Search Results:</h2>
          <ul>
            {searchResults.map((result) => (
              <li key={result._id}>
                <h3>{result.name}</h3>
                <p>{result.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No results to display</p>
      )}
      </div>
      <Footer/>
    </div>
  );
};

export default SearchResults;
