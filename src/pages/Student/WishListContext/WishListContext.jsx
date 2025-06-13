/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../../../socket";
import { useAuth } from "../../../context/AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { isAuthenticated, userId } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  // Fetch wishlist on mount and when auth changes
  useEffect(() => {
    if (isAuthenticated && userId) {
      // Initial fetch
      fetchWishlist();

      // Register for socket updates
      socket.emit("register", userId);

      // Listen for wishlist length updates
      const handleWishlistUpdate = (length) => {
        // If we only get the length, we need to refetch the full data
        fetchWishlist();
      };

      socket.on("get_length", handleWishlistUpdate);
      return () => {
        socket.off("get_length", handleWishlistUpdate);
      };
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, userId]);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}api/v1/product/wishlist/view`,
        { withCredentials: true }
      );
      const list =
        data?.wishlist || data?.data?.wishlist || data?.data || data || [];
      setWishlist(list);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item._id === productId);

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        wishlistCount: wishlist.length,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
