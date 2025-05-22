/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const colleges = [
  "laboratory  tools",
  "engineering",
  "arts;architecture;engineering",
  "architecture;engineering - arts",
  "plant anatomy",
  "faculty of bio technology",
  "faculty of agriculture",
  "arts",
  "faculty of dentistry",
  "chemical tools",
  "faculty of veterinary medicine",
  "architecture;engineering",
  "animal dissection",
  "faculty of nursing",
];

const subCategories = [
  "cleaning supplies",
  "Rulers",
  "Art Supplies",
  "liquid handling",
  "chemical tools",
  "Sculpture",
  "microscopy supplies",
  "Brushes",
  "glassware",
  "Templates",
  "Colors",
  "Oils",
  "Canvas",
  "Drawing Sketch",
  "safety equipment",
  "Pencils and Pens",
  "cleaning tools",
  "Art Boards and Bags",
  "dissection tools",
  "storage equipment",
  "Color Pallets",
];
const stockRanges = ["Medium", "High", "Low"];
const seasons = ["Winter", "Autumn", "Spring", "Summer"];

/* 👉 default payload in one constant so we can reset easily */
const initialForm = {
  price: 150,
  college: "engineering",
  "Sub Category": "Templates",
  rating: 4.5,
  stock: 25,
  is_out_of_stock: 0,
  views_count: 120,
  wishlist_count: 15,
  add_to_cart_count: 10,
  buyers_count: 7,
  discount_pct: 10,
  final_price: 135,
  stock_range: "Low",
  seasonality: "Winter",
  effective_price: 125,
  cart_to_view_ratio: 0.0833,
  wishlist_to_view_ratio: 0.125,
};

const PredictForm = () => {
  const API_BASE = import.meta.env.VITE_CHAT_API_URL; // ← http://127.0.0.1:5000/
  const [form, setForm] = useState(initialForm);
  const [result, setRes] = useState(null); // show response in UI
  const [busy, setBusy] = useState(false); // disable button while sending

  /*------------- helpers -------------*/
  const handleChange = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const resetForm = () => {
    setForm(initialForm);
    setRes(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await axios.post(`${API_BASE}predict`, form);

      /* API might return different keys – normalise here */
      const value =
        data.predicted_price_range_category ??
        data.prediction ??
        JSON.stringify(data);

      setRes(value); // show in badge
      await Swal.fire("Prediction", `Model says: ${value}`, "success");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Server error",
        "error"
      );
    } finally {
      setBusy(false);
    }
  };

  /* numeric input generator to avoid repetition */
  const num = (k, label, step = "any") => (
    <div className="flex flex-col">
      <label className="font-medium mb-1 text-gray-700">{label}</label>
      <input
        type="number"
        step={step}
        value={form[k]}
        onChange={(e) => handleChange(k, +e.target.value)}
        className="border rounded px-3 py-2"
      />
    </div>
  );

  return (
    <section className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
      {/* ---------- title + badge ---------- */}
      <h1 className="text-2xl font-bold text-[#001F54] mb-2">
        Sales Prediction
      </h1>
      {result && (
        <span className="inline-block bg-[#001F54] text-white text-sm px-4 py-1 rounded-full mb-4">
          {result}
        </span>
      )}

      {/* ---------- form ---------- */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* SELECTS */}
        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700">College</label>
          <select
            value={form.college}
            onChange={(e) => handleChange("college", e.target.value)}
            className="border rounded px-3 py-2"
          >
            {colleges.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700">Sub Category</label>
          <select
            value={form["Sub Category"]}
            onChange={(e) => handleChange("Sub Category", e.target.value)}
            className="border rounded px-3 py-2"
          >
            {subCategories.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700">Stock Range</label>
          <select
            value={form.stock_range}
            onChange={(e) => handleChange("stock_range", e.target.value)}
            className="border rounded px-3 py-2"
          >
            {stockRanges.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700">Seasonality</label>
          <select
            value={form.seasonality}
            onChange={(e) => handleChange("seasonality", e.target.value)}
            className="border rounded px-3 py-2"
          >
            {seasons.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* NUMERICS */}
        {num("price", "Price")}
        {num("rating", "Rating", 0.1)}
        {num("stock", "Stock")}
        {num("is_out_of_stock", "Is Out Of Stock (0/1)")}
        {num("views_count", "Views Count")}
        {num("wishlist_count", "Wishlist Count")}
        {num("add_to_cart_count", "Add-to-Cart Count")}
        {num("buyers_count", "Buyers Count")}
        {num("discount_pct", "Discount %")}
        {num("final_price", "Final Price")}
        {num("effective_price", "Effective Price")}
        {num("cart_to_view_ratio", "Cart/View Ratio", 0.0001)}
        {num("wishlist_to_view_ratio", "Wishlist/View Ratio", 0.0001)}

        {/* BUTTONS */}
        <div className="md:col-span-2 flex justify-center gap-4">
          <button
            type="submit"
            disabled={busy}
            className="bg-[#001F54] hover:bg-blue-800 text-white font-semibold py-2 px-8 rounded-md disabled:opacity-60"
          >
            {busy ? "Predicting…" : "Predict"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-8 rounded-md"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
};

export default PredictForm;
