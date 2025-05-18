import { Box, Typography } from "@mui/material";
import { red, green, grey } from "@mui/material/colors";
import { CiGift, CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import PropTypes from "prop-types";
import EditCoupon from "./EditCoupon";

function StatBox({ discount, code, expiresAt, onEdit, onDelete, couponId }) {
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleOpenEditDialog = () => setOpenEditDialog(true);
  const handleCloseEditDialog = () => setOpenEditDialog(false);

  const handleEditSubmit = (editedData) => {
    onEdit(editedData, couponId);
    handleCloseEditDialog();
  };

  const handleDeleteClick = () => {
    onDelete();
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          minWidth: "250px",
          maxWidth: "300px",
          p: "20px",
          borderRadius: "30px",
          backgroundImage:
            "linear-gradient(180deg, rgb(100, 117, 244) 20%, rgb(135, 135, 187) 90%)",
          boxShadow: "10px 10px 5px rgba(0,0,0,0.3)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Box>
            <CiGift style={{ color: "white", fontSize: "48px" }} />
            <Typography
              fontSize="60px"
              fontWeight="bold"
              sx={{ color: "white" }}
            >
              {discount}%
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <CiEdit
              style={{
                color: green[900],
                fontSize: "26px",
                cursor: "pointer",
              }}
              onClick={handleOpenEditDialog}
            />
            <MdDeleteOutline
              style={{
                color: red[700],
                fontSize: "26px",
                cursor: "pointer",
              }}
              onClick={handleDeleteClick}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography sx={{ color: grey[800] }}>{code}</Typography>
          <Typography sx={{ color: grey[800] }}>
            {new Date(expiresAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Typography>
        </Box>
      </Box>

      <EditCoupon
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        onSubmit={handleEditSubmit}
        initialData={{
          code,
          discount: discount.toString(),
          expiresAt: new Date(expiresAt).toISOString().split("T")[0],
        }}
      />
    </>
  );
}

StatBox.propTypes = {
  discount: PropTypes.number.isRequired,
  code: PropTypes.string.isRequired,
  expiresAt: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  couponId: PropTypes.string.isRequired,
};

export default StatBox;
