import {
  Dialog,
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
import axios from "axios";

function AddCoupon({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    expiresAt: "",
  });
  const [errors, setErrors] = useState({
    code: false,
    discount: false,
    expiresAt: false,
    expiresAtMessage: "",
    duplicateCode: false,
  });
  const [isChecking, setIsChecking] = useState(false);
  const [existingCoupons, setExistingCoupons] = useState([]);

  // Get tomorrow's date in YYYY-MM-DD format
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Load existing coupons when dialog opens
  useEffect(() => {
    if (open) {
      const fetchCoupons = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/v1/admin/all/copouns",
            { withCredentials: true }
          );
          setExistingCoupons(response.data);
        } catch (error) {
          console.error("Failed to fetch coupons:", error);
        }
      };
      fetchCoupons();
    }
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || "",
        discount: initialData.discount || "",
        expiresAt: initialData.expiresAt || "",
      });
    }
  }, [initialData]);

  const checkCodeExists = (code) => {
    return existingCoupons.some(
      (coupon) => coupon.code.toLowerCase() === code.toLowerCase()
    );
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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "code") {
      // Validate length first
      const lengthError = value.length < 4 || value.length > 12;
      setErrors((prev) => ({
        ...prev,
        code: lengthError,
        duplicateCode: false,
      }));

      // Only check for duplicates if length is valid
      if (!lengthError && value.length >= 4) {
        setIsChecking(true);
        const exists = checkCodeExists(value);
        setErrors((prev) => ({
          ...prev,
          duplicateCode: exists,
        }));
        setIsChecking(false);
      }
    } else if (name === "expiresAt") {
      validateDate(value);
    }
  };

  const handleSubmit = async () => {
    // Check for empty fields
    const newErrors = {
      code:
        !formData.code || formData.code.length < 4 || formData.code.length > 12,
      discount: !formData.discount,
      expiresAt: !formData.expiresAt,
      expiresAtMessage: errors.expiresAtMessage,
      duplicateCode: errors.duplicateCode,
    };

    // Validate date
    const isDateValid = validateDate(formData.expiresAt);

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error) || !isDateValid) {
      return;
    }

    // Final duplicate check before submitting
    const exists = checkCodeExists(formData.code);
    if (exists) {
      setErrors((prev) => ({
        ...prev,
        duplicateCode: true,
      }));
      return;
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Add New Coupon
        <IconButton onClick={onClose} sx={{ float: "right" }}>
          <CloseIcon color="primary" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} margin={2}>
          <TextField
            name="code"
            label="Coupon Code (4-12 characters)"
            variant="outlined"
            value={formData.code}
            onChange={handleChange}
            error={errors.code || errors.duplicateCode}
            helperText={
              errors.code
                ? "Coupon code must be between 4 and 12 characters"
                : errors.duplicateCode
                  ? "This coupon code already exists"
                  : ""
            }
            required
            fullWidth
            inputProps={{ maxLength: 12 }}
            disabled={isChecking}
          />
          <TextField
            name="discount"
            label="Discount Percentage"
            variant="outlined"
            type="number"
            value={formData.discount}
            onChange={handleChange}
            inputProps={{ min: 1, max: 100 }}
            error={errors.discount}
            helperText={errors.discount ? "Please enter a discount value" : ""}
            required
            fullWidth
          />
          <TextField
            name="expiresAt"
            label="Expiry Date"
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.expiresAt}
            onChange={handleChange}
            error={errors.expiresAt}
            helperText={errors.expiresAtMessage}
            required
            fullWidth
            inputProps={{
              min: getTomorrow(), // Set min date to tomorrow
            }}
          />
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            size="large"
            disabled={isChecking}
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
            {isChecking ? "Checking..." : "Create Coupon"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

AddCoupon.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    code: PropTypes.string,
    discount: PropTypes.string,
    expiresAt: PropTypes.string,
  }),
};

AddCoupon.defaultProps = {
  initialData: {
    code: "",
    discount: "",
    expiresAt: "",
  },
};

export default AddCoupon;
