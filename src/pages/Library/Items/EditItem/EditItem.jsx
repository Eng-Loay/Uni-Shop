import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../../../../components/Loader/Loader";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const EditItem = () => {
  const { id } = useParams(); // Get item ID from URL
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    faculty: "",
    department: "",
    type: "",
    price: "",
    quantity: "",
    brand: "",
    in_stock: "",
    product_pictures: [],
  });
  useEffect(() => {
    const fetchItem = async () => {
      console.log("Fetching item with ID:", id);
      try {
        const response = await axios.get(
          `${API_BASE_URL}api/v1/auth/library/${userId}/items`
);
        const allItems = response.data.data;

        // Find the specific item by ID
        const selectedItem = allItems.find((item) => item._id === id);
        if (!selectedItem) {
          throw new Error("Item not found");
        }

        setItem(selectedItem);
        setFormData({
          name: selectedItem.name,
          description: selectedItem.description,
          faculty: selectedItem.faculty,
          department: selectedItem.department,
          type: selectedItem.type,
          price: selectedItem.price,
          quantity: selectedItem.quantity,
          brand: selectedItem.brand,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, userId]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${API_BASE_URL}api/v1/auth/library/${userId}/edite_product/${id}`,
        formData,
        {
          withCredentials: true,

}
      );
      Swal.fire({
        title: "Item updated successfully!",
        icon: "success",
        draggable: true,
      });
      setIsEditing(false);
    } catch {
      console.error("Error updating item:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update item!",
      });
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto max-w-7xl px-20 py-4 ">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="font-bold text-xl">Edit Item </h2>
        <button
          onClick={() => setIsEditing(true)}
          disabled={isEditing}
          className={`px-5 py-2.5 text-center rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
            isEditing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#001F54] hover:bg-indigo-600 text-white"
          }`}
        >
          {" "}
          Edit
        </button>
      </div>

      <div className="container mx-auto max-w-7xl px-20 py-4">
        <div className="container mx-auto max-w-2xl mt-10 max-w-md mx-auto">
          <div className="w-full max-w-sm m-2 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col items-center p-5 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ">
              {/* Display item photo */}
              {item.product_pictures?.length > 0 && (
                <img
                  className="w-35 h-35 object-cover rounded-lg mb-4"
                  src={item.product_pictures[0]?.secure_url}
                  alt={item.name}
                />
              )}

              {/* Display item name */}
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>

              {/* Edit Form */}

              <form onSubmit={handleUpdate}>
                <div>
                  <label className="block mb-2">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-auto p-2 border rounded mb-4"
                  />

                  <label className="block mb-2">Price (EGP)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-auto p-2 border rounded mb-4"
                  />

                  <label className="block mb-2">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-auto p-2 border rounded mb-4"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isEditing}
                  onClick={() => navigate("/minidrawer/items")}
                  className={`px-4 py-2 rounded text-white ${
                    isEditing
                      ? "bg-[#001F54] hover:bg-indigo-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditItem;
