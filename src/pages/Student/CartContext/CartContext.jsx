/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../../../socket";
import { useAuth } from "../../../context/AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated, userId } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  // Fetch cart on mount and when auth changes
  useEffect(() => {
    if (isAuthenticated && userId) {
      // Initial fetch
      fetchCart();

      // Register for socket updates
      socket.emit("register", userId);

      // Listen for cart length updates
      const handleCartUpdate = (length) => {
        // If we only get the length, we need to refetch the full data
        fetchCart();
      };

      socket.on("get_length", handleCartUpdate);
      return () => {
        socket.off("get_length", handleCartUpdate);
      };
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, userId]);

  const fetchCart = async () => {
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
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  // Add product to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => [
      ...prev,
      {
        ...product,
        quantity,
        cartItemId:
          product._id || Date.now() + Math.random().toString(36).substr(2, 9),
        productId: product._id,
      },
    ]);
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  // Update quantity of specific cart item
  const updateQuantity = (cartItemId, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount: cartItems.length,
        totalPrice,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
