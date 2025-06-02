// src/components/Department.jsx
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Heart, ChevronRight } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useCart } from "../../../pages/Student/CartContext/CartContext";
import { useWishlist } from "../../../pages/Student/WishListContext/WishListContext";

export default function Department() {
  const { departmentName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  /* ────────────────────────── Fetch department products ───────────────────────── */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${API_BASE_URL}api/v1/product/major/${encodeURIComponent(
            departmentName
          )}/package`
        );
        const productsData = data.data || [];
        setProducts(productsData);

        // initialise quantity for each product to 1
        const initialQ = {};
        productsData.forEach((p) => {
          initialQ[p._id] = 1;
        });
        setQuantities(initialQ);
      } catch (err) {
        console.error("Failed to fetch department products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [departmentName]);

  /* ────────────────────────── Helpers ───────────────────────── */
  const handleQuantityChange = (productId, newQty) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, newQty),
    }));
  };

  const handleAddToCart = async (product) => {
    try {
      await axios.post(
        `${API_BASE_URL}api/v1/cart/add_item/${product._id}`,
        { quantity: quantities[product._id] || 1 },
        { withCredentials: true }
      );
      addToCart(product, quantities[product._id] || 1);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handleWishlistClick = async (product) => {
    try {
      await axios.patch(
        `${API_BASE_URL}api/v1/product/${product._id}/wishlist`,
        {},
        { withCredentials: true }
      );
      toggleWishlist(product);
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  /* ────────────────────────── Render ───────────────────────── */
  return (
    <>
      <div className="p-5 text-lg font-extrabold">
        {decodeURIComponent(departmentName)}
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {loading ? (
          <p className="py-10 text-center text-gray-500">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            No products found in this department.
          </p>
        ) : (
          /* ------------- GRID wrapper (equal-height cards) ------------- */
          <div
            className="grid gap-6
                          sm:grid-cols-2
                          md:grid-cols-3
                          lg:grid-cols-4
                          xl:grid-cols-5
                          auto-rows-fr"
          >
            {products.map((product) => {
              const qty = quantities[product._id] || 1;
              const displayName = product.name.split(" ").slice(0, 2).join(" ");
              const displayPrice = Number(product.price).toFixed(2);

              return (
                <div key={product._id} className="relative p-2">
                  {/* ────── Wishlist Heart ────── */}
                  <button
                    onClick={() => handleWishlistClick(product)}
                    className="absolute right-3 top-3 z-10 rounded-full bg-white p-1 shadow"
                    aria-label={
                      isInWishlist(product._id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        isInWishlist(product._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>

                  {/* ────── Card ────── */}
                  <div className="group flex h-full min-h-[420px] flex-col overflow-hidden rounded-lg bg-white p-2 shadow">
                    {/* Image: fixed 1-to-1 box */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.product_pictures?.[0]?.secure_url}
                        alt={product.name}
                        className="h-full w-full cursor-pointer object-cover transition-transform group-hover:scale-105"
                        onClick={() =>
                          navigate(`/productdetails/${product._id}`)
                        }
                      />
                    </div>

                    {/* Title + rating */}
                    <div className="flex items-center justify-between py-2">
                      <h3 className="line-clamp-2 min-h-[3rem] font-extrabold text-main">
                        {displayName}
                      </h3>
                      <span className="flex text-yellow-500">
                        {product.average_rating
                          ? [...Array(Math.round(product.average_rating))].map(
                              (_, i) => <FaStar key={i} size={12} />
                            )
                          : "No rating"}
                      </span>
                    </div>

                    {/* Price + qty selector */}
                    <div className="flex items-center justify-between py-2">
                      <span className="font-bold text-main">
                        {displayPrice} EGP
                      </span>

                      <div className="flex items-center">
                        {/* – button */}
                        <button
                          onClick={() =>
                            handleQuantityChange(product._id, qty - 1)
                          }
                          disabled={qty <= 1}
                          className={`rounded px-3 py-1 ${
                            qty <= 1
                              ? "cursor-not-allowed bg-gray-300 opacity-50"
                              : "cursor-pointer bg-gray-300"
                          }`}
                        >
                          −
                        </button>

                        <span className="px-2 text-main">{qty}</span>

                        {/* + button */}
                        <button
                          onClick={() =>
                            handleQuantityChange(product._id, qty + 1)
                          }
                          className="cursor-pointer rounded bg-gray-300 px-3 py-1"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* More details */}
                    <button
                      onClick={() => navigate(`/productdetails/${product._id}`)}
                      className="mb-2 flex w-full items-center justify-center py-2 text-gray-500 transition-colors hover:text-blue-600"
                    >
                      More Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>

                    {/* Add to Cart */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn mt-auto w-full rounded-lg bg-main px-3 py-2 text-white transition-colors hover:bg-main-dark"
                    >
                      Add to cart
                    </button>
                  </div>
                  {/* End card */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
