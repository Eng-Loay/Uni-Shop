import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1/admin",
  withCredentials: true,
});

const paginationModel = { page: 0, pageSize: 5 };

function Stores() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/approved");

        const formattedData = response.data.data.map((item) => ({
          id: item._id || item.id,
          username: item.username || "Unnamed Library",
          logo:
            typeof item.logo === "string"
              ? item.logo
              : item.logo?.secure_url || "/default-logo.png",
          originalData: item,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          title: "Error",
          text:
            error.response?.data?.message ||
            "Failed to load approved libraries",
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

        setData(data.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "The library has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting library:", error);
      Swal.fire("Error!", "There was an issue deleting the library.", "error");
    }
  };

  const columns = [
    {
      field: "logo",
      headerName: "Logo",
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <img
            src={params.row.logo}
            alt="Library Logo"
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #210876",
              cursor: "pointer",
            }}
          />
        </div>
      ),
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      flex: 2,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <div
            onClick={() => handleDelete(params.row.id)}
            style={{
              padding: "20px 30px",
              borderRadius: "5px",
              color: "crimson",
              border: "1px solid crimson",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              height: "fit-content",
              lineHeight: "normal",
            }}
          >
            Delete
          </div>
        </div>
      ),
      align: "right",
      headerAlign: "right",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "80%",
          margin: "0 auto",
          padding: 2,
          minHeight: "400px",
          flexGrow: 1,
          justifyContent: "space-between",
          flexDirection: "column",
          display: "flex",
        }}
      >
        <DataGrid
          rows={data}
          columns={columns.concat(actionColumn)}
          columnHeaderHeight={0}
          rowHeight={120}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          loading={loading}
          sx={{
            border: 0,
            "& .MuiDataGrid-row": {
              boxShadow: 1,
              borderRadius: 2,
              backgroundColor: "#fff",
              mb: 1,
              mt: 2,
              mx: 1,
              px: 1,
            },
          }}
        />
      </Paper>
    </div>
  );
}

export default Stores;
