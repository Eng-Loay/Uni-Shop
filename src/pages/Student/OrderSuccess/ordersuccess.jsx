import { useNavigate, useLocation } from "react-router-dom";
import successIllustration from "../../../assets/order/success.svg"; // replace with your actual path

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderNumber = state?.orderNumber || "#0000";

  const handleContinue = () => {
    navigate("/productshome"); // adjust route as needed
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 flex items-center justify-center p-12">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-xl text-center">
        <img
          src={successIllustration}
          alt="Order Successful"
          className="mx-auto w-64 h-auto mb-8"
        />
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4">
          Successful!
        </h1>
        <p className="text-xl text-gray-700">
          Your order number{" "}
          <span className="text-blue-600 font-semibold">{orderNumber}</span>
          <br />
          You will receive the order confirmation email shortly.
        </p>
        <button
          onClick={handleContinue}
          className="mt-10 bg-blue-900 text-white px-8 py-3 rounded-2xl hover:bg-blue-800 transition text-lg font-semibold shadow-lg"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
