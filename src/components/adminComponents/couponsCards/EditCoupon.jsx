import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function EditCoupon({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    expiresAt: "",
  });
  const [errors, setErrors] = useState({
    discount: false,
    expiresAt: false,
    expiresAtMessage: "",
  });

  // Get tomorrow's date in YYYY-MM-DD format
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || "",
        discount: initialData.discount || "",
        expiresAt: initialData.expiresAt || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent changes to the coupon code
    if (name === "code") return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate date when changed
    if (name === "expiresAt") {
      validateDate(value);
    }
  };

  const validateDate = (dateString) => {
    if (!dateString) {
      setErrors((prev) => ({
        ...prev,
        expiresAt: true,
        expiresAtMessage: "Please select an expiry date",
      }));
      return false;
    }

    const selectedDate = new Date(dateString);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Reset time part for accurate comparison

    if (selectedDate < tomorrow) {
      setErrors((prev) => ({
        ...prev,
        expiresAt: true,
        expiresAtMessage: "Expiry date must be tomorrow or later",
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      expiresAt: false,
      expiresAtMessage: "",
    }));
    return true;
  };

  const validateDiscount = (discount) => {
    const num = Number(discount);
    const isValid = !isNaN(num) && num >= 1 && num <= 100;
    setErrors((prev) => ({
      ...prev,
      discount: !isValid,
    }));
    return isValid;
  };

  const handleSubmit = () => {
    const isDateValid = validateDate(formData.expiresAt);
    const isDiscountValid = validateDiscount(formData.discount);

    if (!isDateValid || !isDiscountValid) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Edit Coupon
        <IconButton onClick={onClose} sx={{ float: "right" }}>
          <CloseIcon color="primary" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} margin={2}>
          <TextField
            name="code"
            label="Code"
            variant="outlined"
            value={formData.code}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
            helperText="Coupon code cannot be modified"
          />
          <TextField
            name="discount"
            label="Discount % (1-100)"
            variant="outlined"
            type="number"
            value={formData.discount}
            onChange={handleChange}
            inputProps={{ min: 1, max: 100 }}
            error={errors.discount}
            helperText={
              errors.discount ? "Please enter a valid discount (1-100%)" : ""
            }
          />
          <TextField
            name="expiresAt"
            label="Expires At"
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.expiresAt}
            onChange={handleChange}
            error={errors.expiresAt}
            helperText={errors.expiresAtMessage}
            inputProps={{
              min: getTomorrow(), // Set min date to tomorrow
            }}
          />
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            sx={{
              width: {
                xs: "100%", // Full width on mobile
                sm: "300px", // 300px on tablets
                md: "250px", // 250px on desktop
              },
              minWidth: "120px", // Minimum width
              alignSelf: "center", // Center horizontally
              marginTop: 2, // Add some top margin
              padding: {
                xs: "8px 16px", // Smaller padding on mobile
                sm: "10px 22px", // Larger padding on tablets+
              },
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: 2,
              },
              transition: "all 0.2s ease",
            }}
          >
            Update Coupon
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions></DialogActions>
    </Dialog>
  );
}

EditCoupon.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    code: PropTypes.string,
    discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    expiresAt: PropTypes.string,
  }).isRequired,
};

export default EditCoupon;
