/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Heart, ChevronRight } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useCart } from "../CartContext/CartContext";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../WishListContext/WishListContext";
import axios from "axios";

function ProductCard({ product }) {
  if (!product) return null;

  // ──────── Hooks ─────────
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [count, setCount] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  // ──────── Helpers ─────────
  const raw = import.meta.env.VITE_API_URL || "";
  const API_BASE_URL = raw.endsWith("/") ? raw : `${raw}/`;

  // ──────── Handlers ─────────
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}api/v1/cart/add_item/${product._id}`,
        { quantity: count },
        { withCredentials: true }
      );
      addToCart(product, count);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handleWishlistClick = async () => {
    if (!product || !product._id) {
      console.error("Invalid product data");
      return;
    }
    try {
      await axios.patch(
        `${API_BASE_URL}api/v1/product/${product._id}/wishlist`,
        {},
        { withCredentials: true }
      );
      toggleWishlist(product);
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
    }
  };

  const handleMoreDetails = () => {
    navigate(`/productdetails/${product._id}`);
  };

  // ──────── Render ─────────
  return (
    <div className="sm:w-full md:w-1/2 lg:w-1/4 p-2 relative">
      {/* Wishlist Heart */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white shadow"
        aria-label={
          isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"
        }
      >
        <Heart
          className={`w-6 h-6 ${
            isInWishlist(product._id)
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>
       <div className="w-full h-full">
      <div className="product relative bg-white p-2 rounded-lg shadow-md">
        <img
          src={product.product_pictures?.[0]?.secure_url}
          alt={product.name}
          className="w-full h-48 object-cover rounded"
        />

        <div className="flex justify-between items-center py-2">
          <h3 className="text-main font-extrabold">{product.name}</h3>
          <span className="flex text-yellow-500">
            {product.average_rating
              ? [...Array(Math.round(product.average_rating))].map((_, i) => (
                  <FaStar key={i} />
                ))
              : "No rating"}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="font-bold text-main">{product.price} EGP</span>
          <div className="px-2 flex items-center">
            <button
              onClick={decrement}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              –
            </button>
            <span className="text-lg font-bold mx-2 text-main">{count}</span>
            <button
              onClick={increment}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleMoreDetails}
          className="flex items-center justify-center w-full mb-2 py-2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          More Details
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>

        <button
          onClick={handleAddToCart}
          className="bg-main btn w-full rounded-lg px-3 py-2 text-white"
        >
          Add to cart
        </button>
      </div>
</div>
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
              <span className="text-sm text-gray-600">
                Total: {product.price * count} EGP
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
