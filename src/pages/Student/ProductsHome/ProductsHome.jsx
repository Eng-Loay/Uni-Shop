/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom"; // ← NEW
import axios from "axios";
import Loader from "../../../components/Loader/Loader";
import ProductCard from "../ProductCard/ProductCard";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function HomeStudent() {
  // -------------------- state --------------------
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrent] = useState(1);
  const [totalPages, setTotal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------------------- fetch (unchanged) --------------------
  useEffect(() => {
    setLoading(true);
    axios
      // 👇 remove the accidental double-slash in your path
      .get(`${API_BASE_URL}api/v1/product/all/items?page=${currentPage}`)
      .then(({ data }) => {
        setProducts(data.data || []); // adapt if your key differs
        setTotal(data.totalPages || 1);
        setLoading(false);

        /* Save names once for navbar autocomplete */
        const names = (data.data || []).map((p) => p.name);
        localStorage.setItem("productNames", JSON.stringify(names));
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [currentPage]);

  // -------------------- read ?search=JJ --------------------
  const { search } = useLocation(); // e.g. "?search=jj"
  const query =
    new URLSearchParams(search).get("search")?.trim().toLowerCase() || "";

  /* filter on the fly – memoised for perf */
  const visible = useMemo(() => {
    if (!query) return products;
    return products.filter((p) => p.name?.toLowerCase().includes(query));
  }, [products, query]);

  // -------------------- UI --------------------
  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center py-10 text-red-600">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <div className="text-lg p-5 font-extrabold">Products you may like</div>

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
      </div>

      {/* TODO: pagination controls that call setCurrent(n) */}
    </>
  );
}
