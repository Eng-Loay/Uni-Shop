import { Box } from "@mui/material";
import StatBox from "./StatBox";
import Grid from "@mui/material/Grid"; // Changed to consistent import
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

function Coupon({ refresh }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/admin/all/copouns",
          { withCredentials: true }
        );
        setCoupons(response.data.coupons || response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Failed to load coupons",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [refresh]);

  const handleEditCoupon = async (editedData, couponId) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/admin/update_copoun/${couponId}`,
        {
          code: editedData.code,
          discount: Number(editedData.discount),
          expiresAt: new Date(editedData.expiresAt).toISOString(),
        },
        { withCredentials: true }
      );

      setCoupons(
        coupons.map((coupon) =>
          coupon._id === couponId
            ? {
                ...coupon,
                ...editedData,
                expiresAt: new Date(editedData.expiresAt).toISOString(),
              }
            : coupon
        )
      );

      Swal.fire({
        title: "Success!",
        text: "Coupon updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Failed to update coupon:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to update coupon",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `http://localhost:3000/api/v1/admin/remove_copoun/${couponId}`,
          { withCredentials: true }
        );
        setCoupons(coupons.filter((coupon) => coupon._id !== couponId));

        Swal.fire("Deleted!", "Coupon has been deleted.", "success");
      }
    } catch (err) {
      console.error("Failed to delete coupon:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to delete coupon",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (loading)
    return <Box sx={{ p: 3, textAlign: "center" }}>Loading coupons...</Box>;
  if (error)
    return <Box sx={{ p: 3, color: "error.main" }}>Error: {error}</Box>;
  if (coupons.length === 0)
    return <Box sx={{ p: 3 }}>No coupons available</Box>;

  return (
    <Grid container spacing={3}>
      {coupons.map((coupon) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={coupon._id}>
          <StatBox
            discount={coupon.discount}
            code={coupon.code}
            expiresAt={coupon.expiresAt}
            onEdit={(editedData) => handleEditCoupon(editedData, coupon._id)}
            onDelete={() => handleDeleteCoupon(coupon._id)}
            couponId={coupon._id}
          />
        </Grid>
      ))}
    </Grid>
  );
}

Coupon.propTypes = {
  refresh: PropTypes.bool.isRequired,
};

export default Coupon;
