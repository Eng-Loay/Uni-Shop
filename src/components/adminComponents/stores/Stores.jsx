// src/components/Stores.jsx
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: `${API_BASE_URL}api/v1/admin`,
  withCredentials: true,
});

export default function Stores() {
  // ─── breakpoints ────────────────────────────────────────────────
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));

  // ─── pagination model (dynamic pageSize) ────────────────────────
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: isXs ? 3 : isSm ? 5 : isMd ? 8 : 12,
  });
  useEffect(() => {
    setPaginationModel((prev) => ({
      ...prev,
      pageSize: isXs ? 3 : isSm ? 5 : isMd ? 8 : 12,
    }));
  }, [isXs, isSm, isMd]);

  // ─── state ──────────────────────────────────────────────────────
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── fetch approved libraries ───────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/approved");
        const formatted = response.data.data.map((item) => ({
          id: item._id || item.id,
          username: item.username || "Unnamed Library",
          logo:
            typeof item.logo === "string"
              ? item.logo
              : item.logo?.secure_url || "/default-logo.png",
        }));
        setData(formatted);
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({
          title: "Error",
          text:
            err.response?.data?.message || "Failed to load approved libraries",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ─── delete handler ─────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#66ff66",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await api.delete("/update_library_status", {
          data: { _id: id },
        });
        setData((prev) => prev.filter((row) => row.id !== id));
        Swal.fire("Deleted!", "The library has been deleted.", "success");
      }
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire("Error!", "There was an issue deleting the library.", "error");
    }
  };

  // ─── columns ────────────────────────────────────────────────────
  const columns = [
    {
      field: "logo",
      headerName: "Logo",
      flex: isXs ? 0.8 : 1,
      minWidth: isXs ? 80 : 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            component="img"
            src={params.row.logo}
            alt="Library Logo"
            sx={{
              width: isXs ? 40 : isSm ? 50 : 60,
              height: isXs ? 40 : isSm ? 50 : 60,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #210876",
              cursor: "pointer",
            }}
          />
        </Box>
      ),
    },
    {
      field: "username",
      headerName: "Username",
      flex: isXs ? 1.5 : 2,
      minWidth: isXs ? 120 : 150,
      align: "left",
      headerAlign: "left",
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      flex: isXs ? 1 : 1.2,
      minWidth: isXs ? 80 : 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            onClick={() => handleDelete(params.row.id)}
            sx={{
              px: isXs ? 0.8 : isSm ? 1.2 : 2,
              py: isXs ? 0.4 : isSm ? 0.6 : 1,
              borderRadius: 1,
              color: "crimson",
              border: "1px solid crimson",
              cursor: "pointer",
              fontSize: isXs ? "0.7rem" : isSm ? "0.8rem" : "0.875rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: isXs ? 60 : 80,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "crimson",
                color: "white",
              },
            }}
          >
            Delete
          </Box>
        </Box>
      ),
    },
  ];

  // ─── render ─────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        py: { xs: 1, sm: 2, md: 4 },
        px: { xs: 0.5, sm: 1, md: 2 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: {
            xs: "98%",
            sm: "95%",
            md: "85%",
            lg: "70%",
            xl: "60%",
          },
          p: { xs: 0.5, sm: 1, md: 2 },
          borderRadius: { xs: 1, sm: 2 },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns.concat(actionColumn)}
          autoHeight
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[3, 5, 8, 12]}
          rowHeight={isXs ? 80 : isSm ? 90 : 100}
          loading={loading}
          sx={{
            border: 0,
            "& .MuiDataGrid-root": {
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
              fontWeight: 600,
            },
            "& .MuiDataGrid-row": {
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderRadius: { xs: 1, sm: 2 },
              backgroundColor: "#fff",
              mb: 0.5,
              "&:hover": {
                backgroundColor: "#f9f9f9",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              justifyContent: "center",
              mt: { xs: 1, sm: 2 },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
          }}
        />
      </Paper>
    </Box>
  );
}
