
import axios from "axios";
import { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../../../../components/Loader/Loader";
import {Eye , Menu } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function ItemsLibrary() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [libraryData, setLibraryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userId = localStorage.getItem("userId");
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get(
          `${API_BASE_URL}api/v1/auth/library/${userId}/items?page=${currentPage}`
        );
        setItems(itemsResponse.data.data);
        setTotalPages(itemsResponse.data.totalPages || 1);

        const libraryDataResponse = await axios.get(
          `${API_BASE_URL}api/v1/auth/library/${userId}/info`
        );
        setLibraryData(libraryDataResponse.data.data);

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]); 

  const handleViewDetails=(itemId)=>{
navigate(`/minidrawer/items/itemsdetails/${itemId}`)
  };
 
  const handleEdit = (itemId) => {
    navigate(`/minidrawer/items/edititems/${itemId}`); 
  };

  const handleDelete = async (itemId) => {
    console.log("Deleting item with ID:", itemId);
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
        await axios.delete(`${API_BASE_URL}api/v1/auth/library/items/delete/${itemId}`,
        {
          withCredentials:true,
        }
        );
        
        // Update state to remove deleted item
        setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  
        // Show success alert
        Swal.fire({
          title: "Deleted!",
          text: "The item has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }); 
      } catch (error) {
        console.error("Error deleting item:", error);
        Swal.fire({
          title: "Error!",
          text: "There was an issue deleting the item.",
          icon: "error",
        });
      }
    }
  };
  
 

 
  if (loading) return <Loader/>;
  if (error) return <div>Error: {error.message}</div>;

  
  
  return (
    <>
      <div className="container mx-auto max-w-7xl px-20 py-4">
        
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <img className="p-2 w-16 h-16 rounded-lg" src={libraryData?.logo.secure_url} />
            <span className="p-2 font-bold text-lg">{libraryData?.username}</span>
          </div>

          <button
            onClick={() => navigate("/minidrawer/items/additems")}
            className=" w-full sm:w-auto px-4 py-2 text-center bg-[#001F54] hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 mt-3 sm:mt-0 flex items-center justify-center space-x-2"
          >
            Add items
          </button>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl ">
       <div className="flex flex-wrap justify-center gap-2">
      
        {items.map((item) => (
  <div
    key={item._id}
    className="relative bg-white rounded-xl shadow-md overflow-hidden w-80 flex flex-col"
  >
    {/* ─── Menu (Edit/Delete) ───────────────────────────── */}
    <div className="absolute top-3 right-3">
      <button
        onClick={() =>
          setMenuOpen(menuOpen === item._id ? null : item._id)
        }
        className="text-gray-500 hover:text-gray-700"
      >
        <Menu size={24} />
      </button>
      {menuOpen === item._id && (
        <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg">
          <button
            onClick={() => handleEdit(item._id)}
            className="block w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="block w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>

    {/* ─── Fixed-height Image ─────────────────────────────── */}
    <div className="h-56 w-full overflow-hidden">
      <img
        className="w-full h-full object-cover"
        src={item.product_pictures?.[0]?.secure_url}
        alt={item.name}
      />
    </div>

    {/* ─── Content + stats ────────────────────────────────── */}
    <div className="p-4 flex flex-col flex-1">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500">{item.department}</p>
        </div>
      </div>

      <div className="mt-4 space-y-1 text-sm flex-grow">
        <div className="flex justify-between">
          <span className="text-gray-400">Price</span>
          <span className="text-gray-900 font-medium">
            {item.price} EGP
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Inventory</span>
          <span className="text-gray-900 font-medium">
            45 units
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Status</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              item.in_stock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.in_stock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* ─── View Details button pinned to bottom ──────────── */}
      <button
        onClick={() => handleViewDetails(item._id)}
        className="mt-auto w-full flex items-center justify-center gap-2 border border-gray-200 py-2 rounded-lg hover:bg-gray-100"
      >
        <Eye size={18} />
        <span className="text-sm font-medium text-gray-700">
          View Details
        </span>
      </button>
    </div>
  </div>
))}

        </div>
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2 bg-gray-300 rounded-lg">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
        </div>
    
    </>
    )}
  

export default ItemsLibrary;
