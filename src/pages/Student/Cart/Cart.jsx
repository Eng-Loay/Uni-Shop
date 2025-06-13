/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { ArrowBigLeft } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import empty from "../../../assets/empty/empty.png";
import Loader from "../../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../CartContext/CartContext"; // Add this import

function Cart() {
  const navigate = useNavigate();
  // Get the removeFromCart function from the cart context
  const { removeFromCart, refreshCart } = useCart();

  /* ————————————————— ENV base URL ————————————————— */
  const raw = import.meta.env.VITE_API_URL || "";
  const API_BASE_URL = raw.endsWith("/") ? raw : `${raw}/`;

  /* ————————————————— local state ————————————————— */
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  /* ————————————————— Helpers ————————————————— */
  const formatPrice = (p) => (typeof p === "number" ? p.toFixed(2) : "0.00");
  const recalcTotal = (items) =>
    items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);

  /* ————————————————— fetch cart on mount ————————————————— */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}api/v1/cart/my_cart`, {
          withCredentials: true,
        });

        const apiItems = data.card_products || [];
        const parsed = apiItems.map((p) => ({
          cartItemId: p.productinfo._id,
          productId: p.productinfo._id,
          name: p.productinfo.name,
          price: p.productinfo.price || 0,
          image: p.productinfo.product_pictures?.[0]?.secure_url || "",
          quantity: p.cart_quantity || 1,
        }));

        setCartItems(parsed);
        setCartTotal(recalcTotal(parsed));
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [API_BASE_URL]);

  /* ————————————————— API helpers ————————————————— */
  const patchQuantity = (id, qty) =>
    axios.patch(
      `${API_BASE_URL}api/v1/cart/update_item_quantity/${id}`,
      { quantity: qty },
      { withCredentials: true }
    );

  const deleteItem = (id) =>
    axios.delete(`${API_BASE_URL}api/v1/cart/remove_item/${id}`, {
      withCredentials: true,
    });

  /* ————————————————— quantity change ————————————————— */
  const changeQty = async (item, newQty) => {
    const { cartItemId, productId } = item;

    if (newQty === 0) {
      try {
        await deleteItem(productId);
        setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));

        // Update the global cart context to reflect the removal
        removeFromCart(cartItemId);
      } catch (e) {
        console.error("Remove failed:", e);
        return;
      }
    } else {
      try {
        await patchQuantity(productId, newQty);
        setCartItems((prev) =>
          prev.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i
          )
        );

        // Optionally refresh the global cart to ensure quantity is updated there too
        refreshCart();
      } catch (e) {
        const msg = e.response?.data?.message;
        if (msg) {
          Swal.fire({
            icon: "error",
            title: msg,
            confirmButtonColor: "#E02424",
          });
        } else {
          console.error("Qty update failed:", e);
        }
        return;
      }
    }

    // Re-sum totals after any server-confirmed change
    setCartTotal(
      recalcTotal(
        newQty === 0
          ? cartItems.filter((i) => i.cartItemId !== cartItemId)
          : cartItems.map((i) =>
              i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i
            )
      )
    );
  };

  /* ————————————————— click handlers ————————————————— */
  const increment = (item) => changeQty(item, item.quantity + 1);
  const decrement = (item) => changeQty(item, item.quantity - 1);

  /* ————————————————— Render ————————————————— */
  if (isLoading) {
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
        <h1 className="text-2xl font-bold mb-8 text-main">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center mt-10">
            <img
              src={empty}
              alt="Empty cart"
              className="mx-auto w-100 h-auto"
            />
            <p className="text-gray-500 mt-4 text-lg">Your cart is empty.</p>
          </div>
        ) : (
          <>
            {/* Header Row */}
            <div className="grid grid-cols-5 gap-4 text-main font-medium border-b pb-3 mb-4">
              <div className="col-span-2">Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>

            {/* Cart Items */}
            {cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="grid grid-cols-5 gap-4 items-center border-b py-4"
              >
                {/* Product column */}
                <div className="col-span-2 flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h2 className="font-semibold text-main">{item.name}</h2>
                    <button
                      onClick={() => changeQty(item, 0)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-main">{formatPrice(item.price)} EGP</div>

                {/* Quantity */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decrement(item)}
                    className="w-8 h-8 border rounded hover:bg-gray-100 flex items-center justify-center"
                  >
                    –
                  </button>
                  <span className="w-10 text-center border-t border-b">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increment(item)}
                    className="w-8 h-8 border rounded hover:bg-gray-100 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Total */}
                <div className="font-semibold text-main">
                  {formatPrice(item.price * item.quantity)} EGP
                </div>
              </div>
            ))}

            {/* Total & Checkout */}
            <div className="mt-8 pt-4 flex justify-between items-center">
              <div className="text-lg font-semibold text-main">
                Total: {formatPrice(cartTotal)} EGP
              </div>
              <button
                onClick={() => navigate("/shipping")}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Cart;
