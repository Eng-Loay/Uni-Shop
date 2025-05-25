import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: `${API_BASE_URL}api/v1/admin`,
  withCredentials: true,
});

export default function Stores() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: isXs ? 5 : isSm ? 7 : isMd ? 10 : 15,
  });

  useEffect(() => {
    setPaginationModel((prev) => ({
      ...prev,
      pageSize: isXs ? 5 : isSm ? 7 : isMd ? 10 : 15,
    }));
  }, [isXs, isSm, isMd]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const columns = useMemo(() => {
    const base = [
      {
        field: "logo",
        headerName: "Logo",
        flex: 1,
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
                width: 60,
                height: 60,
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid #210876",
                cursor: "pointer",
              }}
            />
          </Box>
        ),
      },
    ];

    if (!isXs) {
      base.push({
        field: "username",
        headerName: "Username",
        flex: 1,
        align: "left",
        headerAlign: "left",
      });
    }

    return base;
  }, [isXs]);

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            onClick={() => handleDelete(params.row.id)}
            sx={{
              px: isXs ? 1 : 1.5,
              py: isXs ? 0.25 : 0.5,
              fontSize: isXs ? "0.7rem" : "0.8rem",
              borderRadius: "4px",
              color: "crimson",
              border: "1px solid crimson",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              minHeight: 24,
            }}
          >
            Delete
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        px: { xs: 1, sm: 2 },
        py: { xs: 2, sm: 2 },
        bgcolor: "#f9f9f9",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          flexGrow: 1, 
          display: "flex",
          flexDirection: "column",
          width: "clamp(320px, 95%, 1200px)",
          mx: "auto",
          p: { xs: 1, sm: 2 },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns.concat(actionColumn)}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 7, 10, 15]}
          rowHeight={isXs ? 100 : 120}
          loading={loading}
          disableRowSelectionOnClick
          sx={{
            flexGrow: 1, 
            border: 0,
            "& .MuiDataGrid-row": {
              boxShadow: 1,
              borderRadius: 2,
              backgroundColor: "#fff",
              mb: 1,
            },
            "& .MuiDataGrid-footerContainer": {
              justifyContent: "center",
              mt: 2,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#fafafa",
              fontWeight: "bold",
              textAlign: "center",
            },
          }}
        />
      </Paper>
    </Box>
  );
}
