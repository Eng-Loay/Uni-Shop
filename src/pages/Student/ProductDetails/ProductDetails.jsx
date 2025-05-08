import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Loader from '../../../components/Loader/Loader';
import axios from 'axios';
import { FaStar } from 'react-icons/fa'
import { useCart } from '../CartContext/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
   const [showPopup, setShowPopup] = useState(false)
    const [count, setCount] = useState(1)
  const { addToCart } = useCart()
  
  const handleAddToCart = () => {
    addToCart(product, count)
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
  }

  
  const productImages = product?.product_pictures?.map(pic => pic?.secure_url) || [];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}api/v1/product/${id}/details`,
          { withCredentials: true }  
        );
        setProduct(res.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-600">Error: {error.response?.data?.message || error.message}</div>;
  if (!product) return <div className="text-center">Item not found.</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="mr-2" /> Back to Products
      </button>
      
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left side - Image (smaller and equal height) */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Main image container */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden flex-grow flex items-center justify-center p-8">
            <img
              src={productImages[selectedImageIndex]}
              alt={`${product.name} - Main view`}
              className="max-h-[400px] w-auto object-contain"
              style={{ maxWidth: '80%' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Available';
              }}
            />
          </div>

          {/* Thumbnail gallery */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side - Product info (equal height) */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-sm flex flex-col">
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center mt-2 text-yellow-400">
             <span className="flex text-yellow-500">
                        {product.average_rating ? (
                          [...Array(Math.round(product.average_rating))].map((_, i) => (
                            <FaStar key={i} />
                          ))
                        ) : (
                          'No rating'
                        )}
                      </span>
            </div>

            <div className="text-sm text-gray-700 space-y-1 mt-4">
              <p><span className="font-semibold">Availability:</span>  <span
                    className={` px-2 py-0.5 rounded-full text-xs font-semibold ${
            product.in_stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {product.in_stock ? "In Stock" : "Out of Stock"}
          </span></p>
          <p><span className="font-semibold">Brand:</span> {product.brand}</p>
          <p><span className="font-semibold">Department:</span> {product.department}</p>
              <p><span className="font-semibold">Type:</span> {product.type}</p>
              <p><span className="font-semibold">Category:</span> {product.Faculties_and_levels?.[0]?.faculty || "General"}</p>
              <p><span className="font-semibold">Level:</span> {product.Faculties_and_levels?.[0]?.level || "All"}</p>
            </div>

            <div className="flex items-center space-x-4 mt-4">
              <span className="text-3xl font-bold text-[#001F54]">{product.price} EGP</span>
              <span className="line-through text-gray-400">599 EGP</span>
            </div>

            <p className="text-gray-600 mt-4">{product.description}</p>
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => handleAddToCart(product._id)} 
              className="flex-1 bg-[#001F54] text-white py-3 rounded-md hover:bg-indigo-600"
            >
              Add to cart
            </button>
            {showPopup && (
  <div className="fixed top-15 right-5 w-72 bg-white border border-green-400 shadow-lg rounded-lg p-4 z-50">
    <h3 className="text-green-600 font-bold mb-2">Item Added to Cart</h3>
    <div className="flex items-center space-x-3">
      <img
        src={product.product_pictures?.[0]?.secure_url}
        alt={product.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex flex-col">
        <span className="font-semibold">{product.name}</span>
        <span className="text-sm text-gray-600">Quantity: {count}</span>
        <span className="text-sm text-gray-600">Total: {product.price * count} EGP</span>
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
}