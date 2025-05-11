/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { ArrowBigLeft, ShoppingCart, Check, X } from "lucide-react";
import empty from "../../../assets/empty/empty.png";
import Loader from "../../../components/Loader/Loader"; // simple spinner
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext/CartContext";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function Wishlist() {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  /* ————————————————— ENV base URL ————————————————— */
  const raw = import.meta.env.VITE_API_URL || "";
  const API_BASE_URL = raw.endsWith("/") ? raw : `${raw}/`;

  /* ————————————————— local state ————————————————— */
  const [wishlist, setWishlist] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupProduct, setPopupProd] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ————————————————— fetch wishlist on mount ————————————————— */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}api/v1/product/wishlist/view`,
          { withCredentials: true }
        );
        const list =
          data?.wishlist || data?.data?.wishlist || data?.data || data || [];
        setWishlist(list);
      } catch (err) {
        console.error("Unable to load wishlist:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [API_BASE_URL]);

  /* ————————————————— Handlers ————————————————— */
  const showSweetOutOfStock = () =>
    Swal.fire({
      icon: "error",
      title: "Product is out of stock",
      text: "Sorry, this item is currently unavailable.",
    });

  const handleAddToCart = async (product, count = 1) => {
    /* already present → quick popup */
    if (cartItems.some((i) => i._id === product._id)) {
      setPopupProd({ ...product, message: "Already in cart" });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}api/v1/cart/add_item/${product._id}`,
        { quantity: count },
        { withCredentials: true }
      );

      const msg =
        data?.message?.toLowerCase?.() || data?.msg?.toLowerCase?.() || "";

      if (msg.includes("out of stock")) {
        /* ——— NO success popup ——— */
        showSweetOutOfStock();
        return;
      }

      /* success → add & show popup */
      addToCart({ ...product, quantity: count });
      setAddedItems((prev) => [...prev, product._id]);

      setPopupProd({ ...product, message: "Added to Cart" });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      const msg =
        err.response?.data?.message?.toLowerCase?.() ||
        err.response?.data?.msg?.toLowerCase?.() ||
        "";
      if (msg.includes("out of stock")) {
        showSweetOutOfStock();
      } else {
        console.error("Failed to add to cart:", err);
      }
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.patch(
        `${API_BASE_URL}api/v1/product/${productId}/wishlist`,
        {},
        { withCredentials: true }
      );
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  /* ————————————————— Render ————————————————— */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {/* Back button */}
      <div className="mb-4 mt-10 ml-10">
        <button
          onClick={() => navigate("/productshome")}
          className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium"
        >
          <ArrowBigLeft className="w-6 h-6 mr-1" />
          <span>Back to Products</span>
        </button>
      </div>

      {/* Main container */}
      <div className="bg-white py-8 px-4 sm:px-8 w-full max-w-4xl mx-auto">
        {/* Popup */}
        {showPopup && (
          <div className="fixed top-20 right-5 w-72 bg-white border border-green-400 shadow-lg rounded-lg p-4 z-50 animate-fade-in">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <img
                  src={popupProduct?.product_pictures?.[0]?.secure_url}
                  alt={popupProduct?.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-green-600">
                    {popupProduct?.message}
                  </h3>
                  <p className="text-sm text-gray-600">{popupProduct?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="text-center mt-10">
            <img
              src={empty}
              alt="Empty wishlist"
              className="mx-auto w-100 h-auto"
            />
            <p className="text-gray-500">Your wishlist is empty</p>
          </div>
        ) : (
          <>
            {/* Header Row */}
            <div className="grid grid-cols-5 gap-4 text-main font-medium border-b pb-3 mb-4">
              <div className="col-span-3">Product</div>
              <div>Price</div>
              <div>Action</div>
            </div>

            {/* Wishlist Items */}
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="grid grid-cols-5 gap-4 items-center border-b py-4"
              >
                {/* Product column */}
                <div className="col-span-3 flex items-center space-x-4">
                  <img
                    src={product.product_pictures?.[0]?.secure_url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h2 className="font-semibold text-main">{product.name}</h2>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-main">{product.price?.toFixed(2)} EGP</div>

                {/* Action */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addedItems.includes(product._id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                      addedItems.includes(product._id)
                        ? "bg-green-100 text-green-800"
                        : "bg-main text-white hover:bg-blue-700"
                    }`}
                  >
                    {addedItems.includes(product._id) ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="mt-8 pt-4 flex justify-end">
              <button
                onClick={() => navigate("/shipping")}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Wishlist;
