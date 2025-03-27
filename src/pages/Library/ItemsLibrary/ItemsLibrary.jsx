
import axios from "axios";
import { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";


const API_BASE_URL = import.meta.env.VITE_API_URL;

function ItemsLibrary() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [libraryData, setLibraryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const userId = localStorage.getItem("userId");
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get(
          `${API_BASE_URL}api/v1/auth/library/${userId}/items`
        );
        setItems(itemsResponse.data.data);
       
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
  }, []); 
 
  const handleEdit = (itemId) => {
    navigate(`/minidrawer/items/edititems/${itemId}`); 
  };

  const handleDelete = async (itemId) => {
    console.log("Deleting item with ID:", itemId);
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${API_BASE_URL}api/v1/auth/library/items/delete/${itemId}`);
        setItems(items.filter((item) => item._id !== itemId)); 
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };
  

 
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="container mx-auto max-w-7xl px-20 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <img className="p-2 w-25 rounded" src={libraryData?.logo.secure_url} />
            <span className="p-2 font-bold">{libraryData?.username}</span>
          </div>

          <button
            onClick={() => navigate("/minidrawer/items/additems")}
            className=" w-full sm:w-auto px-5 py-2.5 text-center bg-[#001F54] hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
          >
            Add items
          </button>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl ">

        <div className="flex flex-wrap justify-center">
          {items.map((item) => (
<div className="w-full max-w-sm m-2 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 sm:w-full md:1/2 lg:w-1/4">
<div className="top-3 right-3">
                  <button
                    onClick={() => setMenuOpen(menuOpen === item._id ? null : item._id)}
                    className="text-gray-500 hover:text-gray-700 ml-3"
                  >
                  ...
                  </button>
                  {menuOpen === item._id && (
                    <div className=" right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg">
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
  <div className="flex flex-col items-center p-5 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ">
 
    <img className="w-32 h-32 object-cover mb-4 rounded-lg shadow-md" src={item.product_pictures?.[0]?.secure_url} alt="image" />
    <h5 className="text-lg font-semibold text-gray-900 dark:text-white text-center">{item.name}</h5>
    <span className="mt-2 px-3 py-1 text-sm font-medium text-white bg-[#001F54] rounded">{item.price} EGP</span>
  </div>
</div>   
          ))}
        </div>
        </div>
    
    </>
    )}
  

export default ItemsLibrary;
