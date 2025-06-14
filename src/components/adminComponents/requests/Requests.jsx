/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import {
  DataGrid,
  gridClasses,
  GridPagination,
  useGridApiContext,
} from "@mui/x-data-grid";
import {
  Avatar,
  Button,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: `${API_BASE_URL}api/v1/admin`,
  withCredentials: true,
});

// ✅ Custom pagination at bottom-right
function BottomRightPagination() {
  const apiRef = useGridApiContext();
  return (
    <Box
      sx={{
        width: "100%",
        py: 1,
        pr: 1,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <GridPagination apiRef={apiRef} />
    </Box>
  );
}

export default function Requests() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const pageSz = isXs ? 5 : 10;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationModel, setPagModel] = useState({
    page: 0,
    pageSize: pageSz,
  });

  /* ───── Fetch join requests on mount ───── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/pending/join_requests");
        setRows(
          (data?.data || []).map((d) => ({
            id: d._id,
            logo: d.logo?.secure_url || d.logo || "/default-logo.png",
            username: d.username || "Unknown",
          }))
        );
      } catch (e) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ───── Handle approve / reject ───── */
  const decide = async (id, action) => {
    const status = action; // action will be "approved" or "rejected"
    try {
      await axios.patch(
        `${API_BASE_URL}api/v1/auth/admin/approve-library/${id}`,
        { status },
        { withCredentials: true }
      );
      setRows((prev) => prev.filter((r) => r.id !== id));
      Swal.fire("Done!", `Request ${status}.`, "success");
    } catch {
      Swal.fire("Error", `Could not ${status}.`, "error");
    }
  };

  const confirm = (id, action) =>
    Swal.fire({
      title: `${action === "approved" ? "Approve" : "Reject"} request?`,
      icon: action === "approved" ? "success" : "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}!`,
      confirmButtonColor: action === "approved" ? "#2e7d32" : "#c62828",
    }).then((res) => res.isConfirmed && decide(id, action));

  /* ───── DataGrid columns ───── */
  const cols = useMemo(
    () =>
      [
        {
          field: "logo",
          headerName: "Logo",
          width: 90,
          headerAlign: "center",
          align: "center",
          renderCell: ({ value }) => (
            <Avatar
              src={value}
              alt="logo"
              sx={{ width: isXs ? 40 : 56, height: isXs ? 40 : 56 }}
            />
          ),
        },
        !isXs && {
          field: "username",
          headerName: "Username",
          flex: 1,
          minWidth: 140,
        },
        {
          field: "actions",
          headerName: "Actions",
          sortable: false,
          flex: 1,
          minWidth: 170,
          headerAlign: "center",
          align: "center",
          renderCell: ({ row }) => (
            <Box
              sx={{
                display: "flex",
                gap: 0.8,
                flexDirection: isXs ? "column" : "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                fullWidth
                size="small"
                variant="outlined"
                color="error"
                onClick={() => confirm(row.id, "rejected")}
                sx={{
                  fontSize: "0.75rem",
                  py: 0.4,
                  px: 1,
                  minWidth: "auto",
                }}
              >
                Reject
              </Button>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                color="success"
                onClick={() => confirm(row.id, "approved")}
                sx={{
                  fontSize: "0.75rem",
                  py: 0.4,
                  px: 1,
                  minWidth: "auto",
                }}
              >
                Approve
              </Button>
            </Box>
          ),
        },
      ].filter(Boolean),
    [isXs]
  );

  /* ───── Render states ───── */
  if (loading) return <Box sx={{ p: 2 }}>Loading…</Box>;
  if (error) return <Box sx={{ p: 2, color: "error.main" }}>{error}</Box>;
  if (!rows.length)
    return <Box sx={{ p: 2 }}>No pending join requests found.</Box>;

  /* ───── Main UI ───── */
  return (
    <Box sx={{ height: "100vh", overflow: "hidden" }}>
      <Paper
        elevation={3}
        sx={{
          width: "clamp(320px, 95%, 1200px)",
          mx: "auto",
          mt: { xs: 0, md: 4 },
          mb: { xs: 0, md: 4 },
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          height: { xs: "100vh", md: "auto" }, // Full height on mobile
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DataGrid
          rows={rows}
          columns={cols}
          domLayout="autoHeight"
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPagModel}
          pageSizeOptions={[5, 10]}
          components={{ Pagination: BottomRightPagination }}
          density={isXs ? "compact" : "standard"}
          getRowHeight={() => (isXs ? 72 : 75)}
          sx={{
            flexGrow: 1,
            border: 0,
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
            [`& .${gridClasses.row}`]: {
              my: 1,
              px: 2,
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              bgcolor: "background.paper",
            },
            "& .MuiDataGrid-footerContainer": {
              border: 0,
              mt: 2,
              p: 0,
              justifyContent: "flex-end",
            },
          }}
        />
      </Paper>
    </Box>
  );
}
