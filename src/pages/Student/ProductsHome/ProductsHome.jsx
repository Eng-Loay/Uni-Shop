import  { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../../components/Loader/Loader";
import { Star } from 'lucide-react';
import ProductCard from "../ProductCard/ProductCard";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function HomeStudent() {
  const [products, setProducts] = useState([]); // Store the list of products
  const [currentPage, setCurrentPage] = useState(1); // Current page of products
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [loading, setLoading] = useState(true); // Loading state for API request
  const [error, setError] = useState(null); // Error state for API request

  const userId = localStorage.getItem("userId"); // Get the logged-in user's ID
  
  const [count, setCount] = useState(1);



  // Fetch products from the API with pagination
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(
          `${API_BASE_URL}api/v1/product//all/items?page=${currentPage}`
        );
        setProducts(productsResponse.data.data);
        setTotalPages(productsResponse.data.totalPages || 1);


        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentPage]); 

  if (loading) return <Loader/>;
  if (error) return <div>Error: {error.message}</div>;
  return (
  <>
  <div className="text-lg p-5">
      <span className="px-1 rounded font-extrabold">Products you may like</span>
    </div>

    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-wrap">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  </>
  );
}

export default HomeStudent;
