import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Swal from "sweetalert2";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1/admin",
  withCredentials: true,
});

const paginationModel = { page: 0, pageSize: 5 };

function Requests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/pending/join_requests");

        if (!response.data?.data) {
          throw new Error("Invalid data structure");
        }

        const formatted = response.data.data.map((item) => ({
          id: item._id || Math.random().toString(36).substr(2, 9),
          logo: item.logo?.secure_url || item.logo || "/default-logo.png",
          username: item.username || "Unknown",
          _id: item._id,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sendDecision = async (id, status) => {
    try {
      // Change to match your backend endpoint
      await api.delete("/update_library_status", {
        data: {
          id,
          status: status === "declined" ? "rejected" : status,
        },
      });
      setData((prev) => prev.filter((item) => item.id !== id));
      Swal.fire("Success", `Request ${status}`, "success");
    } catch (error) {
      console.error(`Failed to ${status} request:`, error);
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
    }).then((result) => {
      if (result.isConfirmed) {
        sendDecision(id, action);
      }
    });
  };

  const columns = [
    {
      field: "logo",
      headerName: "Logo",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={params.value}
            alt="Logo"
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: "1px solid #210876",
              objectFit: "cover",
              marginRight: "16px",
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
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div
            onClick={() => handleDecision(params.row.id, "declined")}
            style={{
              padding: "20px 30px",
              border: "1px solid crimson",
              color: "crimson",
              borderRadius: 5,
              cursor: "pointer",
              height: "fit-content",
              lineHeight: "normal",
            }}
          >
            Decline
          </div>
          <div
            onClick={() => handleDecision(params.row.id, "approved")}
            style={{
              padding: "20px 30px",
              border: "1px solid green",
              color: "green",
              borderRadius: 5,
              cursor: "pointer",
              height: "fit-content",
              lineHeight: "normal",
            }}
          >
            Approve
          </div>
        </div>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data.length) return <div>No requests found</div>;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "90%",
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
          columns={columns}
          columnHeaderHeight={0}
          rowHeight={100}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
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
            "& .MuiDataGrid-footerContainer": {
              position: "relative",
              bottom: 0,
              width: "100%",
            },
          }}
        />
      </Paper>
    </div>
  );
}

export default Requests;
