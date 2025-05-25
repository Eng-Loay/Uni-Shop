// src/components/Header/Navbar.jsx
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: `${API_BASE_URL}api/v1/admin`,
  withCredentials: true,
});

export default function Requests() {
  // ─── Responsive breakpoints ─────────────────────────────────────
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));

  // ─── Data + loading + error ─────────────────────────────────────
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Controlled pagination ──────────────────────────────────────
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: isXs ? 5 : isSm ? 7 : isMd ? 10 : 15,
  });
  // update pageSize when breakpoint changes
  useEffect(() => {
    setPaginationModel((prev) => ({
      ...prev,
      pageSize: isXs ? 5 : isSm ? 7 : isMd ? 10 : 15,
    }));
  }, [isXs, isSm, isMd]);

  // ─── Fetch pending requests ─────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/pending/join_requests");
        const list = response.data?.data;
        if (!Array.isArray(list)) {
          throw new Error("Invalid data structure");
        }
        const formatted = list.map((item) => ({
          id: item._id,
          logo: item.logo?.secure_url || item.logo || "/default-logo.png",
          username: item.username || "Unknown",
        }));
        setData(formatted);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ─── Approve / decline handlers ─────────────────────────────────
  const sendDecision = async (id, status) => {
    try {
      await api.delete("/update_library_status", {
        data: {
          id,
          status: status === "declined" ? "rejected" : status,
        },
      });
      setData((prev) => prev.filter((row) => row.id !== id));
      Swal.fire("Success", `Request ${status}`, "success");
    } catch (err) {
      console.error(`Failed to ${status} request:`, err);
      Swal.fire("Error", `Failed to ${status} request.`, "error");
    }
  };
  const handleDecision = (id, action) => {
    Swal.fire({
      title: `${action === "approved" ? "Approve" : "Decline"} Request?`,
      icon: action === "approved" ? "success" : "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
      confirmButtonColor: action === "approved" ? "#66ff66" : "#d33",
    }).then((res) => {
      if (res.isConfirmed) sendDecision(id, action);
    });
  };

  // ─── DataGrid columns ────────────────────────────────────────────
  const columns = [
    {
      field: "logo",
      headerName: "Logo",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={params.value}
            alt="Logo"
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: "1px solid #210876",
              objectFit: "cover",
            }}
          />
        </Box>
      ),
    },
    {
      field: "username",
      headerName: "Username",
      flex: 2,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 3,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box
            onClick={() => handleDecision(params.row.id, "declined")}
            sx={{
              px: isXs ? 1 : 2,
              py: isXs ? 0.5 : 1,
              border: "1px solid crimson",
              color: "crimson",
              borderRadius: 1,
              cursor: "pointer",
              typography: isXs ? "caption" : "body2",
              textAlign: "center",
            }}
          >
            Decline
          </Box>
          <Box
            onClick={() => handleDecision(params.row.id, "approved")}
            sx={{
              px: isXs ? 1 : 2,
              py: isXs ? 0.5 : 1,
              border: "1px solid green",
              color: "green",
              borderRadius: 1,
              cursor: "pointer",
              typography: isXs ? "caption" : "body2",
              textAlign: "center",
            }}
          >
            Approve
          </Box>
        </Box>
      ),
    },
  ];

  // ─── Loading / error / empty states ──────────────────────────────
  if (loading) return <Box sx={{ p: 2 }}>Loading...</Box>;
  if (error)
    return <Box sx={{ p: 2, color: "error.main" }}>Error: {error}</Box>;
  if (!data.length)
    return <Box sx={{ p: 2 }}>No pending join requests found.</Box>;

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        py: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2 },
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: {
            xs: "100%", // full width on mobile
            sm: "90%", // 90% on small
            md: "80%", // 80% on medium
            lg: "60%", // 60% on large
            xl: "50%", // 50% on extra-large
          },
          p: { xs: 1, sm: 2 },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          autoHeight // grow to fit content
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 7, 10, 15]}
          sx={{
            border: 0,
            "& .MuiDataGrid-row": {
              boxShadow: 1,
              borderRadius: 2,
              backgroundColor: "background.paper",
              mb: 1,
            },
            "& .MuiDataGrid-footerContainer": {
              justifyContent: "center",
              px: { xs: 0, sm: 2 },
            },
          }}
        />
      </Paper>
    </Box>
  );
}
