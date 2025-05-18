import { FaPlus } from "react-icons/fa";
import Coupon from "../couponsCards/Coupons";
import AddCoupon from "../couponsCards/AddCoupon";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function AdminDashboard() {
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [refreshCoupons, setRefreshCoupons] = useState(false);

  const handleAddCoupon = async (formData) => {
    try {
      // Prepare the data for the API
      const couponData = {
        code: formData.code,
        discount: formData.discount,
        expiresAt: new Date(formData.expiresAt).toISOString(),
      };

      // Make the API call
      await axios.post(
        "http://localhost:3000/api/v1/admin/add_copoun",
        couponData,
        { withCredentials: true }
      );

      Swal.fire({
        title: "Success!",
        text: "Coupon added successfully",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Close the dialog
      setIsAddCouponOpen(false);

      // Trigger a refresh of the coupons list
      setRefreshCoupons((prev) => !prev);
    } catch (error) {
      console.error("Failed to add coupon:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to add coupon",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="dataTable " style={{ backgroundColor: "whitesmoke" }}>
      <div
        className="dataTableTitle"
        style={{
          width: "100%",
          fontSize: "24px",
          color: "#616161",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "10px",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "lightgrey",
        }}
      >
        <span>Add New Coupon </span>

        <button
          title="Add New"
          onClick={() => setIsAddCouponOpen(true)}
          style={{
            color: "white",
            fontSize: "16px",
            border: "1px solid #001F54",
            backgroundColor: "#001f54",
            padding: "10px",
            borderRadius: "10px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <FaPlus />
        </button>
      </div>
      <div
        className="coupons"
        style={{ display: "flex", padding: "20px", gap: "20px" }}
      >
        <Coupon refresh={refreshCoupons} />
      </div>

      <AddCoupon
        open={isAddCouponOpen}
        onClose={() => setIsAddCouponOpen(false)}
        onSubmit={handleAddCoupon}
        initialData={{ code: "", discount: "", expiresAt: "" }}
      />
    </div>
  );
}

export default AdminDashboard;
