/* eslint-disable no-unused-vars */
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import Loader from "../../../components/Loader/Loader";
import Divider from "@mui/material/Divider";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const columns = [
  { id: "customerName", label: "Customer", minWidth: 100 },
  { id: "paymentMethod", label: "Payment", minWidth: 80 },
  { id: "status", label: "Status", minWidth: 80 },
  {
    id: "totalAmount",
    label: "Total",
    minWidth: 100,
    align: "right",
    format: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "$0.00"),
  },
  { id: "actions", label: "Actions", minWidth: 100, align: "center" },
];

const statusTextColors = {
  delivered: "#56FF62",
  "on delivery": "#165BEF",
  pending: "#FFA500",
  cancelled: "#F51212",
  default: "#000000",
};

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const userId = localStorage.getItem("userId");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}api/v1/order/library_orders/${userId}`,
          {
            params: {
              page: currentPage,
              limit: 5, 
            },
          }
        );

        console.log("API Response:", response.data); // Debug log

        if (response.data.status === "success") {
          setOrders(response.data.data.orders || []);
          setTotalPages(response.data.pagination?.totalPages || 1);
          setTotalOrders(response.data.pagination?.totalItems || 0);
        } else {
          throw new Error(response.data.message || "Failed to fetch orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        Swal.fire("Error", "Failed to load orders", "error");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId, currentPage]);

  const handleViewOrder = (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}api/v1/order/cancel/${orderId}`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        Swal.fire({
          title: "Deleted!",
          text: "The order has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        // Refresh data after deletion
        setCurrentPage(1);
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the order.", "error");
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Paper
      sx={{
        width: "100%",
        overflowX: "auto",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <TableContainer
        sx={{
          maxHeight: 440,
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c1c1c1",
            borderRadius: "4px",
          },
        }}
      >
        <Table stickyHeader aria-label="orders table" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  sx={{
                    minWidth: column.minWidth,
                    backgroundColor: "#f8fafc",
                    fontWeight: "bold",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  hover
                  key={order._id}
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                      backgroundColor: "#f8fafc",
                    },
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    {order.user?.username || "N/A"}
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>{order.paymentMethod}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        statusTextColors[order.status?.toLowerCase()] || "#000",
                      fontWeight: "bold",
                      py: 2,
                    }}
                  >
                    {order.status}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2 }}>
                    {order.total_baseAmount !== undefined
                      ? `$${order.total_baseAmount.toFixed(2)}`
                      : "$0.00"}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOrder(order._id);
                      }}
                      color="primary"
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {order.status.toLowerCase() !== "cancelled" && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrder(order._id);
                        }}
                        sx={{
                          color: "#d33",
                          ml: 1,
                          "&:hover": {
                            cursor: "pointer",
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Custom Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 2,
          gap: 1,
        }}
      >
        <Box
          component="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          sx={{
            px: 3,
            py: 1,
            bgcolor: "#e2e8f0",
            borderRadius: "8px",
            border: "none",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
            "&:hover": {
              bgcolor: currentPage === 1 ? "#e2e8f0" : "#cbd5e1",
            },
          }}
        >
          Prev
        </Box>
        <Box
          sx={{
            px: 3,
            py: 1,
            bgcolor: "#e2e8f0",
            borderRadius: "8px",
          }}
        >
          {currentPage} / {totalPages}
        </Box>
        <Box
          component="button"
          onClick={() => {
            console.log("Attempting to go to page:", currentPage + 1);
            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
          }}
          disabled={currentPage >= totalPages}
          sx={{
            px: 3,
            py: 1,
            bgcolor: "#e2e8f0",
            borderRadius: "8px",
            border: "none",
            cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
            opacity: currentPage >= totalPages ? 0.5 : 1,
            "&:hover": {
              bgcolor: currentPage >= totalPages ? "#e2e8f0" : "#cbd5e1",
            },
          }}
        >
          Next
        </Box>
      </Box>

      {selectedOrder && (
        <Modal
          open={!!selectedOrder}
          onClose={handleCloseModal}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "90%",
              maxWidth: 500,
              bgcolor: "white",
              p: 4,
              mx: "auto",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              outline: "none",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Order Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography sx={{ mb: 1 }}>
              <strong>Order ID:</strong> {selectedOrder._id}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Customer:</strong> {selectedOrder.user?.username || "N/A"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Email:</strong> {selectedOrder.user?.email || "N/A"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Payment:</strong> {selectedOrder.paymentMethod}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Status:</strong> {selectedOrder.status}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Total:</strong> $
              {selectedOrder.total_baseAmount.toFixed(2)}
            </Typography>
          </Box>
        </Modal>
      )}
    </Paper>
  );
}
