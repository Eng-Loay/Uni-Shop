/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import Loader from "../../../components/Loader/Loader";
import { useCart } from "../CartContext/CartContext";
import ProductCard from "../ProductCard/ProductCard";

/* ───────────────── env helpers ───────────────── */
const raw = import.meta.env.VITE_API_URL || "";
const API_BASE_URL = raw.endsWith("/") ? raw : `${raw}/`;
const CHAT_API_URL = import.meta.env.VITE_RECOMENDTION_API_URL;

/* ───────────────── ui helpers ───────────────── */
const safeStars = (n = 0) =>
  Array.from({ length: Math.max(0, Math.min(5, Math.round(Number(n) || 0))) });

function extractReviews(p) {
  if (Array.isArray(p?.reviews)) return p.reviews;
  if (Array.isArray(p?.data?.reviews)) return p.data.reviews;
  if (Array.isArray(p?.data?.data?.reviews)) return p.data.data.reviews;
  return [];
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  /* ───── state ───── */
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recProducts, setRecProducts] = useState([]); // always 4 cards
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [count, setCount] = useState(1);

  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  /* current user id (string) */
  const currentUserId = (localStorage.getItem("userId") || "").toString();

  /* ───── fetch helpers ───── */
  const refreshProduct = async () => {
    const res = await axios.get(`${API_BASE_URL}api/v1/product/${id}/details`, {
      withCredentials: true,
    });
    setProduct(res.data.data);
    setReviews(extractReviews(res.data));
  };

  /* ───── initial load ───── */
  useEffect(() => {
    setLoading(true);
    refreshProduct()
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  /* ───── recommendations: ensure exactly 4 cards ───── */
  useEffect(() => {
    if (!product?._id) return;

    const fetchRecs = async () => {
      try {
        /* 1️⃣ Ask recommender for four items */
        const { data: rawRecs = [] } = await axios.post(
          `${CHAT_API_URL}recommend`,
          { id: product.id || product._id, top_n: 4 }
        );

        /* 2️⃣ Translate each public id -> real _id, fallback to public id on error */
        const enriched = await Promise.all(
          rawRecs.map(async (r) => {
            let resolvedId = null;
            try {
              const mapRes = await axios.get(
                `${API_BASE_URL}api/v1/product/${r.id}`
              );
              resolvedId = mapRes.data?.product_id || null;
            } catch {
              /* keep resolvedId null, we'll fallback below */
            }

            return {
              _id: resolvedId || r.id, // always defined
              name: r.product,
              price: r.price,
              average_rating: r.rating,
              in_stock: !r.is_out_of_stock,
              product_pictures: [{ secure_url: r.image }],
            };
          })
        );

        /* 3️⃣ Guarantee array length = 4 (duplicate first if recommender returns <4) */
        while (enriched.length < 4 && enriched.length > 0) {
          enriched.push({ ...enriched[0], _id: `${enriched[0]._id}-dup` });
        }

        setRecProducts(enriched.slice(0, 4));
      } catch {
        toast.error("Recommendation service unavailable");
      }
    };

    fetchRecs();
  }, [product]);

  /* ───── cart ───── */
  const handleAddToCart = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}api/v1/cart/add_item/${product._id}`,
        { quantity: count },
        { withCredentials: true }
      );
      addToCart(product, count);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  /* ───── review CRUD ───── */
  const addReview = async (e) => {
    e.preventDefault();
    if (!newRating || !newComment.trim()) {
      toast.error("Rating and comment required");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}api/v1/product/add_review/${product._id}`,
        { rating: newRating, comment: newComment },
        { withCredentials: true }
      );
      toast.success("Review added!");
      setNewRating(0);
      setNewComment("");
      refreshProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const deleteReview = async (reviewId) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete review?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });
    if (!isConfirmed) return;

    try {
      await axios.delete(
        `${API_BASE_URL}api/v1/product/delete_review/${reviewId}`,
        { withCredentials: true }
      );
      toast.success("Review deleted");
      refreshProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const updateReview = async (reviewId, currentRating, currentComment) => {
    const { value: form } = await Swal.fire({
      title: "Edit your review",
      html: `
        <label style="display:block;text-align:left">Rating (1-5)</label>
        <input id="sw-rate" class="swal2-input" type="number" min="1" max="5" value="${currentRating}">
        <label style="display:block;text-align:left;margin-top:8px">Comment</label>
        <textarea id="sw-comment" class="swal2-textarea" style="height:120px">${currentComment}</textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const rating = parseInt(document.getElementById("sw-rate").value, 10);
        const comment = document.getElementById("sw-comment").value.trim();
        if (!rating || rating < 1 || rating > 5 || !comment) {
          Swal.showValidationMessage("Both fields are required");
          return;
        }
        const payload = {};
        if (rating !== currentRating) payload.rating = rating;
        if (comment !== currentComment) payload.comment = comment;
        return payload;
      },
      showCancelButton: true,
    });
    if (!form || Object.keys(form).length === 0) return;

    try {
      await axios.patch(
        `${API_BASE_URL}api/v1/product/update_review/${reviewId}`,
        form,
        { withCredentials: true }
      );
      toast.success("Review updated");
      refreshProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  /* ───── guards ───── */
  if (loading) return <Loader />;
  if (error)
    return (
      <p className="text-center text-red-600">
        {error.response?.data?.message || error.message}
      </p>
    );
  if (!product) return <p className="text-center">Item not found.</p>;

  /* ───── derived data ───── */
  const imgs = product.product_pictures?.map((p) => p.secure_url) || [];
  const mainImg = imgs[selectedImageIndex];

  const orderedReviews = [
    // mine first
    ...reviews.filter(
      (r) =>
        (
          r.user?._id ||
          r.user?.id ||
          r.user?.uid ||
          r.user ||
          ""
        ).toString() === currentUserId
    ),
    ...reviews.filter(
      (r) =>
        (
          r.user?._id ||
          r.user?.id ||
          r.user?.uid ||
          r.user ||
          ""
        ).toString() !== currentUserId
    ),
  ];

  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (
        reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / totalReviews
      ).toFixed(1)
    : "0.0";

  /* ───── UI ───── */
  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      {/* back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-700 hover:text-blue-900 mb-6"
      >
        <ArrowLeft className="mr-2" /> Back to Products
      </button>

      {/* product section */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* images */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="bg-gray-100 rounded-lg flex-grow flex items-center justify-center p-8">
            <img
              src={mainImg}
              alt={product.name}
              className="max-h-[400px] w-auto object-contain"
            />
          </div>

          {imgs.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {imgs.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`cursor-pointer aspect-square rounded-md overflow-hidden border-2 ${
                    i === selectedImageIndex
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* meta */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-sm flex flex-col">
          <div className="flex-grow">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2 text-yellow-500">
              {safeStars(product.average_rating).map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>

            {/* specs */}
            <div className="text-sm text-gray-700 space-y-1 mt-4">
              <p>
                <span className="font-semibold">Availability:</span>{" "}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    product.in_stock
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.in_stock ? "In Stock" : "Out of Stock"}
                </span>
              </p>
              <p>
                <span className="font-semibold">Brand:</span> {product.brand}
              </p>
              <p>
                <span className="font-semibold">Department:</span>{" "}
                {product.department}
              </p>
              <p>
                <span className="font-semibold">Type:</span> {product.type}
              </p>
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {product.Faculties_and_levels?.[0]?.faculty}
              </p>
              <p>
                <span className="font-semibold">Level:</span>{" "}
                {product.Faculties_and_levels?.[0]?.level}
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4">
              <span className="text-3xl font-bold text-[#001F54]">
                {product.price} EGP
              </span>
              <span className="line-through text-gray-400">599 EGP</span>
            </div>

            <p className="text-gray-600 mt-4">{product.description}</p>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-8 bg-[#001F54] text-white py-3 rounded-md hover:bg-[#123a87]"
          >
            Add to cart
          </button>
        </div>
      </div>

      {/* cart popup */}
      {showPopup && (
        <div className="fixed top-5 right-5 w-72 bg-white border border-green-400 shadow-lg rounded-lg p-4 z-50">
          <h3 className="text-green-600 font-bold mb-2">Item Added</h3>
          <div className="flex items-center space-x-3">
            <img
              src={product.product_pictures?.[0]?.secure_url}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-gray-600">Qty {count}</p>
              <p className="text-sm text-gray-600">
                {product.price * count} EGP
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ───── recommendations ───── */}
      {recProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">You Might Also Need</h2>
          {/* fixed 4-column layout on large screens */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {recProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ───── reviews + summary ───── */}
      <section className="mt-16">
        {/* rating summary */}
        {totalReviews === 0 ? (
          <p className="text-gray-500 mb-4">No ratings available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* bars */}
            <div className="space-y-2 md:col-span-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center space-x-2">
                  <span className="w-12 text-sm">{star}</span>
                  <FaStar className="text-yellow-400 shrink-0" />
                  <div className="flex-1 h-2 rounded bg-gray-200">
                    <div
                      className="bg-yellow-400 h-2 rounded"
                      style={{ width: `${star * 20}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* average card */}
            <div className="bg-blue-100 border border-blue-400 rounded-lg flex flex-col items-center justify-center p-6">
              <span className="text-4xl font-extrabold">{averageRating}</span>
              <div className="flex text-yellow-500 my-2">
                {safeStars(averageRating).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-sm text-gray-700">
                {totalReviews} {totalReviews === 1 ? "Rating" : "Ratings"}
              </p>
            </div>
          </div>
        )}

        {/* review list + form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* list */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Reviews ({orderedReviews.length})
            </h2>

            {orderedReviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <ul className="space-y-6">
                {orderedReviews.map((r) => {
                  const reviewUserId = (
                    r.user?._id ||
                    r.user?.id ||
                    r.user?.uid ||
                    (typeof r.user === "string" ? r.user : "")
                  ).toString();
                  const mine = reviewUserId === currentUserId;

                  return (
                    <li
                      key={r._id}
                      className={`border rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-start gap-4 ${
                        mine ? "self-end" : ""
                      }`}
                    >
                      {/* stars + comment */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex text-yellow-500">
                          {safeStars(r.rating).map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                        <p className="font-medium">{r.comment}</p>
                      </div>

                      {/* action buttons */}
                      {mine && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() =>
                              updateReview(r._id, r.rating, r.comment)
                            }
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => deleteReview(r._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* form */}
          <aside className="bg-white border rounded-lg p-6 shadow-sm max-h-80 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add a Review</h3>
            <form onSubmit={addReview} className="space-y-4">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setNewRating(n)}
                    className={
                      n <= newRating ? "text-yellow-400" : "text-gray-300"
                    }
                  >
                    <FaStar size={22} />
                  </button>
                ))}
              </div>

              <textarea
                rows={4}
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Write your review…"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-[#001F54] text-white py-2 rounded-md hover:bg-[#123a87]"
              >
                Submit
              </button>
            </form>
          </aside>
        </div>
      </section>
    </div>
  );
}
