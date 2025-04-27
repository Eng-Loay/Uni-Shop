import  { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function HomeStudent() {
  const [products, setProducts] = useState([]); // Store the list of products
  const [currentPage, setCurrentPage] = useState(1); // Current page of products
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [loading, setLoading] = useState(false); // Loading state for API request
  const [error, setError] = useState(null); // Error state for API request

  const userId = localStorage.getItem("userId"); // Get the logged-in user's ID

  // Fetch products from the API with pagination
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(
        "Calling API:",
        `${API_BASE_URL}api/v1/product/all/items?page=${currentPage}`
      );
      const response = await axios.get(
        `${API_BASE_URL}api/v1/product/all/items?page=${currentPage}`,
        { withCredentials: true }
      );

      if (response.data.items) {
        setProducts(response.data.items);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Run fetchProducts when currentPage changes
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // Handle next page button click
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page button click
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="home-student">
      <h1 className="text-3xl font-bold mb-8">Product List</h1>

      {/* Show loading state */}
      {loading && <p>Loading...</p>}

      {/* Show error if there is an error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display products */}
      <div className="product-list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="product-card p-4 border rounded-md"
            >
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-32 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p>{product.description}</p>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>

      {/* Pagination controls */}
      <div className="pagination mt-6 flex justify-between">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HomeStudent;
