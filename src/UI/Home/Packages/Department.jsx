import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Heart, ChevronRight } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../pages/Student/CartContext/CartContext";
import { useWishlist } from "../../../pages/Student/WishListContext/WishListContext";

function Department() {
  const { departmentName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

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
        // init quantities
        const initialQ = {};
        productsData.forEach((prod) => {
          initialQ[prod._id] = 1;
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

  return (
    <>
      <div className="text-lg p-5 font-extrabold">
        {decodeURIComponent(departmentName)}
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {loading ? (
          <p className="py-10 text-center text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            No products found in this department.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {products.map((product) => {
              const qty = quantities[product._id] || 1;
              const displayName = product.name.split(" ").slice(0, 2).join(" ");
              const displayPrice = Number(product.price).toFixed(2);

              return (
                <div
                  key={product._id}
                  className="sm:w-full md:w-1/2 lg:w-1/4 p-2 relative"
                >
                  {/* Wishlist Heart */}
                  <button
                    onClick={() => handleWishlistClick(product)}
                    className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white shadow"
                    aria-label={
                      isInWishlist(product._id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
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

                  <div className="product relative bg-white p-2 rounded-lg shadow-md h-full flex flex-col">
                    <img
                      src={product.product_pictures?.[0]?.secure_url}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded cursor-pointer"
                      onClick={() => navigate(`/productdetails/${product._id}`)}
                    />

                    <div className="flex justify-between items-center py-2">
                      <h3 className="text-main font-extrabold line-clamp-2">
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

                    <div className="flex justify-between items-center py-2">
                      <span className="font-bold text-main">
                        {displayPrice} EGP
                      </span>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            handleQuantityChange(product._id, qty - 1)
                          }
                          disabled={qty <= 1}
                          className={`px-3 py-1 bg-gray-300 rounded ${
                            qty <= 1
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          }`}
                        >
                          -
                        </button>
                        <span className="px-2 text-main">{qty}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(product._id, qty + 1)
                          }
                          className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/productdetails/${product._id}`)}
                      className="flex items-center justify-center w-full mb-2 py-2 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      More Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-main btn w-full rounded-lg px-3 py-2 text-white cursor-pointer hover:bg-main-dark transition-colors mt-auto"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Department;
