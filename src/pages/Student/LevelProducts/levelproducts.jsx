/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../../../components/Loader/Loader";
import ProductCard from "../ProductCard/ProductCard";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function LevelProducts() {
  /* --------------------  route params  -------------------- */
  const { facultyName, levelNumber } = useParams(); // from /faculty/:facultyName/level/:levelNumber
  const encodedFaculty = encodeURIComponent(facultyName); // safety for spaces

  /* --------------------  state  -------------------- */
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* --------------------  fetch  -------------------- */
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${API_BASE_URL}api/v1/product/faculty/${encodedFaculty}/level/${levelNumber}?page=${currentPage}`
      )
      .then(({ data }) => {
        setProducts(data.data || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);

        /* store names for search-autocomplete */
        const names = (data.data || []).map((p) => p.name);
        localStorage.setItem("productNames", JSON.stringify(names));
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [encodedFaculty, levelNumber, currentPage]);

  /* --------------------  query filter  -------------------- */
  const { search } = useLocation();
  const query =
    new URLSearchParams(search).get("search")?.trim().toLowerCase() || "";

  const visible = useMemo(() => {
    if (!query) return products;
    return products.filter((p) => p.name?.toLowerCase().includes(query));
  }, [products, query]);

  /* --------------------  pager helpers  -------------------- */
  const goPrev = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));
  const goNext = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));

  /* --------------------  UI  -------------------- */
  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center py-10 text-red-600">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <div className="text-lg p-5 font-extrabold">
        {facultyName} – Level {levelNumber}
      </div>

      <div className="container mx-auto max-w-7xl">
        {visible.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No products match “{query}”
          </div>
        ) : (
          <div className="flex flex-wrap">
            {visible.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {/* -------------- pager -------------- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 my-10 select-none">
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium transition 
                ${
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
              className={`px-4 py-2 rounded-md text-sm font-medium transition
                ${
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
