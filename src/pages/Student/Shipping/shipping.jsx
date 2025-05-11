/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";
/* ————————————————— assets ————————————————— */
import card1 from "../../../assets/shipping/card1.svg";
import card2 from "../../../assets/shipping/card2.svg";
import card3 from "../../../assets/shipping/card3.svg";
import card4 from "../../../assets/shipping/card4.svg";
import shippingImg from "../../../assets/shipping/shipping.svg";

/* ————————————————— constants ————————————————— */
const CITIES = [
  "Al Shatby, Alexandria",
  "Smouha, Alexandria",
  "Stanley, Alexandria",
  "Sidi Gaber, Alexandria",
  "Sporting, Alexandria",
  "Gleem, Alexandria",
  "San Stefano, Alexandria",
  "Roushdy, Alexandria",
  "Louran, Alexandria",
  "Victoria, Alexandria",
  "Mandara, Alexandria",
  "Miami, Alexandria",
  "Asafra, Alexandria",
  "El Agamy, Alexandria",
  "Bolkly, Alexandria",
  "Bab Sharq, Alexandria",
  "Moharam Bek, Alexandria",
  "Al Ibrahimiyyah, Alexandria",
  "Camp Caesar, Alexandria",
  "Kafr Abdu, Alexandria",
];

export default function Shipping() {
  /* ————————————————— env & axios ————————————————— */
  const raw = import.meta.env.VITE_API_URL || "";
  const API_BASE_URL = raw.endsWith("/") ? raw : `${raw}/`;
  const navigate = useNavigate();
  /* ————————————————— cart totals ————————————————— */
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  });

  /* ————————————————— local state ————————————————— */
  const [discountCode, setDiscountCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  /* ————————————————— SweetAlert helper ————————————————— */
  const toast = (icon, title) =>
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

  /* ————————————————— handlers ————————————————— */
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast("warning", "Enter a discount code first");
      return;
    }
    try {
      const { data } = await axios.patch(
        `${API_BASE_URL}api/v1/cart/apply_couponDiscount`,
        { discount_code: discountCode.trim() },
        { withCredentials: true }
      );
      toast("success", data?.msg || "Coupon applied!");

      const cart = data?.user_Cart;
      if (cart) {
        setCartTotals({
          subtotal: cart.total_price,
          shipping: 0,
          discount: Math.abs(cart.savedAmount) || 0,
          total: cart.priceAfterDiscount || cart.total_price,
        });
      }
    } catch {
      toast("error", "Invalid discount code");
    }
  };

  const handleProceedToPay = async () => {
    if (!city) {
      toast("warning", "Please select your city");
      return;
    }
    try {
      const payload = {
        paymentMethod,
        shippingAddress: city, // ◀️ send city only
      };
      await axios.post(`${API_BASE_URL}api/v1/order/new`, payload, {
        withCredentials: true,
      });
      await Swal.fire({
        title: "Placing your order…",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      navigate("/order-success");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops…",
        text: err?.response?.data?.message || "Failed to place order",
        confirmButtonColor: "#E02424",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-700 hover:text-blue-900 mb-6"
      >
        <ArrowLeft className="mr-2" /> Back to Cart
      </button>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* ————————————————— Left: Shipping Form ————————————————— */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Shipping Details</h1>

          {/* Payment selector */}
          <div className="space-y-2">
            <span className="block text-gray-600 font-medium">
              Payment Method
            </span>
            <div className="flex gap-3">
              {["Cash", "Credit Card", "Vodafone Cash"].map((m) => (
                <label
                  key={m}
                  className={`flex-1 text-center py-2 rounded-lg border 
                    ${
                      paymentMethod === m
                        ? "bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                >
                  <input
                    type="radio"
                    value={m}
                    checked={paymentMethod === m}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  {m}
                </label>
              ))}
            </div>
          </div>

          {/* Name fields */}
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { label: "First Name", value: firstName, setter: setFirstName },
              { label: "Last Name", value: lastName, setter: setLastName },
            ].map(({ label, value, setter }) => (
              <div key={label} className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">
                  {label}*
                </label>
                <input
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full h-10 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            ))}
          </div>

          {/* Contact & Address */}
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-600">
                Phone*
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-600">
                Address*
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-10 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {/* City dropdown */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">
                  City*
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="" disabled>
                    Select City
                  </option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zip */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600">
                  Zip Code*
                </label>
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full h-10 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          {/* Credit Card Details */}
          {paymentMethod === "Credit Card" && (
            <div className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-inner overflow-hidden">
              <img
                src={shippingImg}
                alt="decor"
                className="hidden lg:block absolute -right-24 top-10 w-56 opacity-20"
              />
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Card Information
              </h2>
              <div className="space-y-4">
                <input
                  placeholder="Name on Card"
                  className="w-full h-10 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex items-center gap-4">
                  <input
                    placeholder="0000 0000 0000 0000"
                    className="flex-1 h-10 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200"
                  />
                  <div className="flex space-x-2">
                    {[card1, card2, card3, card4].map((src, i) => (
                      <img key={i} src={src} className="w-7 h-7" alt="" />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-end">
                  <select className="h-10 px-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200">
                    <option>MM</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i}>{String(i + 1).padStart(2, "0")}</option>
                    ))}
                  </select>
                  <select className="h-10 px-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200">
                    <option>YY</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const y = new Date().getFullYear() + i;
                      return (
                        <option key={i} value={y}>
                          {String(y).slice(-2)}
                        </option>
                      );
                    })}
                  </select>
                  <input
                    placeholder="CVC"
                    maxLength={4}
                    className="h-10 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <label className="inline-flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="text-sm text-gray-700">
                    Save this card for next time
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Vodafone Cash */}
          {paymentMethod === "Vodafone Cash" && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Vodafone Cash
              </h2>
              <input
                placeholder="Phone Number"
                className="w-full h-10 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200"
              />
              <input
                type="password"
                placeholder="PIN Code"
                className="w-1/2 h-10 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          )}
        </div>

        {/* ————————————————— Right: Order Summary ————————————————— */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Order Summary
            </h1>
            <div className="divide-y divide-gray-200 space-y-4 text-gray-700">
              {[
                { label: "Subtotal", value: cartTotals.subtotal },
                { label: "Shipping", value: cartTotals.shipping },
                { label: "Discount", value: -cartTotals.discount },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 text-sm">
                  <span>{label}</span>
                  <span>${value.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Discount Code */}
            <div className="mt-6 flex items-center gap-3">
              <input
                type="text"
                placeholder="Coupon code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 h-10 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200"
              />
              <button
                onClick={handleApplyDiscount}
                className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between items-center">
            <span className="text-lg font-medium text-gray-800">Total</span>
            <span className="text-xl font-bold text-gray-900">
              ${cartTotals.total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleProceedToPay}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold shadow-md transition"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
}
