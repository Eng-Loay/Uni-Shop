/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../../../components/Loader/Loader";
import ProductCard from "../ProductCard/ProductCard";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function HomeStudent() {
  /* ───────── state ───────── */
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]); /* 🆕 */
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ───────── fetch products + wishlist together ───────── */
  useEffect(() => {
    setLoading(true);
    setError(null);

    const prodReq = axios.get(
      `${API_BASE_URL}api/v1/product/all/items?page=${currentPage}`
    );
    const wishReq = axios.get(`${API_BASE_URL}api/v1/product/wishlist/view`, {
      withCredentials: true,
    });

    Promise.all([prodReq, wishReq])
      .then(([prodRes, wishRes]) => {
        /* products */
        const prodData = prodRes.data;
        setProducts(prodData.data || []);
        setTotalPages(prodData.totalPages || 1);

        /* wishlist */
        const list =
          wishRes.data?.wishlist ||
          wishRes.data?.data?.wishlist ||
          wishRes.data?.data ||
          wishRes.data ||
          [];
        setWishlistIds(list.map((p) => p._id));

        /* names for navbar auto-complete */
        localStorage.setItem(
          "productNames",
          JSON.stringify((prodData.data || []).map((p) => p.name))
        );
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [currentPage]);

  /* ───────── search filter ───────── */
  const { search } = useLocation();
  const query =
    new URLSearchParams(search).get("search")?.trim().toLowerCase() || "";

  const visible = useMemo(() => {
    if (!query) return products;
    return products.filter((p) => p.name?.toLowerCase().includes(query));
  }, [products, query]);

  /* ───────── pager helpers ───────── */
  const goPrev = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));
  const goNext = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));

  /* ───────── ui ───────── */
  if (loading) return <Loader />; /* full-page animation */
  if (error)
    return (
      <div className="text-center py-10 text-red-600">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <div className="text-lg p-5 font-extrabold">Products you may like</div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
        {visible.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No products match “{query}”
          </div>
        ) : (
          <div className="flex flex-wrap justify-center sm:justify-start gap-6">
            {visible.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                wishlistIds={wishlistIds} /* pass list down   */
                setWishlistIds={setWishlistIds} /* allow sync back  */
              />
            ))}
          </div>
        )}

        {/* pager */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 my-10 select-none">
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 cursor-pointer"
              }`}
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page&nbsp;
              <strong>{currentPage}</strong>&nbsp;/&nbsp;{totalPages}
            </span>

            <button
              onClick={goNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
