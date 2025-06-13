/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Heart, ChevronRight } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useCart } from "../CartContext/CartContext";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../WishListContext/WishListContext";
import axios from "axios";

function ProductCard({ product, wishlistIds, setWishlistIds }) {
  if (!product) return null;

  /* ───────── hooks ───────── */
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist(); /* no more isInWishlist */

  const [count, setCount] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  /* helpers */
  const raw = import.meta.env.VITE_API_URL || "";
  const API_BASE_URL = raw.endsWith("/") ? raw : `${raw}/`;
  const displayName = product.name.split(" ").slice(0, 2).join(" ");

  /* liked based ONLY on parent list */
  const isLiked = wishlistIds.includes(product._id);

  /* ───────── quantity handlers ───────── */
  const increment = () => setCount((p) => p + 1);
  const decrement = () => setCount((p) => (p > 1 ? p - 1 : 1));

  /* ───────── cart handler ───────── */
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
      console.error("Failed add to cart:", err);
    }
  };

  /* ───────── wishlist handler ───────── */
  const handleWishlistClick = async () => {
    const alreadyLiked = wishlistIds.includes(product._id);
    try {
      await axios.patch(
        `${API_BASE_URL}api/v1/product/${product._id}/wishlist`,
        {},
        { withCredentials: true }
      );

      /* update local list FIRST so UI flips instantly */
      setWishlistIds((prev) =>
        alreadyLiked
          ? prev.filter((id) => id !== product._id)
          : [...prev, product._id]
      );

      /* sync global context (adds or removes internally) */
      toggleWishlist(product);
    } catch (err) {
      console.error("Toggle wishlist failed:", err);
    }
  };

  /* ───────── details nav ───────── */
  const handleMoreDetails = () => navigate(`/productdetails/${product._id}`);

  /* ───────── render ───────── */
  return (
    <div
      className="sm:w-full md:w-1/2 lg:w-1/4 p-2 relative"
      style={{ width: "320px", height: "450px" }}
    >
      {/* Heart */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white shadow"
        aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`w-6 h-6 ${
            isLiked
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>

      {/* Card */}
      <div className="product bg-white p-2 rounded-lg shadow-md h-full flex flex-col">
        <img
          src={product.product_pictures?.[0]?.secure_url}
          alt={product.name}
          className="w-full h-48 object-cover rounded"
        />

        <div className="flex justify-between items-center py-2">
          <h3 className="text-main font-extrabold line-clamp-2">
            {displayName}
          </h3>
          <span className="flex text-yellow-500">
            {product.average_rating
              ? [...Array(Math.round(product.average_rating))].map((_, i) => (
                  <FaStar key={i} />
                ))
              : "No rating"}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="font-bold text-main">
            {product.price.toFixed(2)} EGP
          </span>
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
          className="flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
        >
          More Details
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>

        <button
          onClick={handleAddToCart}
          className="bg-main btn w-full rounded-lg px-3 py-2 text-white mt-auto"
        >
          Add to cart
        </button>
      </div>

      {/* Popup */}
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
                Total: {(product.price * count).toFixed(2)} EGP
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
