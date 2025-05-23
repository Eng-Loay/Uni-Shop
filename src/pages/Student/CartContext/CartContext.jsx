/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

// Custom hook for using the cart
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add product to cart
  const addToCart = (product) => {
    setCartItems((prev) => [
      ...prev,
      {
        ...product,
        quantity: 1,
        // Add unique ID for each cart entry
        cartItemId: Date.now() + Math.random().toString(36).substr(2, 9),
      },
    ]);
  };

  // Optional: remove item from cart
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
  const cartCount = cartItems.length;

  // Total number of items (sum of all quantities)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
