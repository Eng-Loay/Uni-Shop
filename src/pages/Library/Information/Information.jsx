import { useState, useEffect, useRef } from "react";
import {
  Pencil,
  Mail,
  FileText,
  MapPin,
  Book,
  Check,
  X,
  Upload,
} from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function LibraryInformation() {
  const [libraryData, setLibraryData] = useState({
    libraryName: "",
    email: "",
    license: "",
    location: "",
    logo: "",
  });
  const [editData, setEditData] = useState({
    libraryName: "",
    email: "",
    license: null,
    location: "",
    logo: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [licenseFileName, setLicenseFileName] = useState("");

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in local storage");
        }

        const response = await axios.get(
          `${API_BASE_URL}api/v1/library/${userId}/info`
        );

        setLibraryData({
          libraryName: response.data.data.username || "",
          email: response.data.data.email || "",
          license: response.data.data.license || "",
          location: response.data.data.location || "",
          logo: response.data.data.logo || "",
        });
        setEditData({
          libraryName: response.data.data.username || "",
          email: response.data.data.email || "",
          license: null,
          location: response.data.data.location || "",
          logo: null,
        });
        if (response.data.data.license) {
          setLicenseFileName("Current License.pdf");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // If canceling edit, reset editData to original libraryData
      setEditData({
        libraryName: libraryData.libraryName,
        email: libraryData.email,
        license: null,
        location: libraryData.location,
        logo: null,
      });
      setLicenseFileName(libraryData.license ? "Current License.pdf" : "");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData((prev) => ({
        ...prev,
        logo: file,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }

      const formData = new FormData();
      formData.append("username", editData.libraryName);
      formData.append("email", editData.email);
      formData.append("location", editData.location);

      if (editData.logo) {
        formData.append("logo", editData.logo);
      }
      // Either use the response or remove the assignment
      await axios.patch(
        `${API_BASE_URL}api/v1/library/${userId}/edite_profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle success
      setLibraryData({
        ...libraryData,
        libraryName: editData.libraryName,
        email: editData.email,
        location: editData.location,
        logo: editData.logo
          ? URL.createObjectURL(editData.logo)
          : libraryData.logo,
        license: editData.license ? licenseFileName : libraryData.license,
      });
      setIsEditing(false);
      window.location.href = "/minidrawer/information";
    } catch (err) {
      console.error("Error saving data:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl relative min-h-[calc(100vh-200px)]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-15 gap-4">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {isEditing ? (
            <div className="relative">
              {editData.logo ? (
                <img
                  src={
                    typeof editData.logo === "string"
                      ? editData.logo
                      : URL.createObjectURL(editData.logo)
                  }
                  alt="Library Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                />
              ) : libraryData.logo ? (
                <img
                  src={libraryData.logo.secure_url || libraryData.logo}
                  alt="Library Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg sm:text-xl">
                    {editData.libraryName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-[#001F54] text-white p-1 rounded-full"
              >
                <Pencil className="w-2 h-2 sm:w-3 sm:h-3" />
              </button>
            </div>
          ) : libraryData.logo ? (
            <img
              src={libraryData.logo.secure_url || libraryData.logo}
              alt="Library Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">
                {libraryData.libraryName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {isEditing ? (
            <input
              type="text"
              name="libraryName"
              value={editData.libraryName}
              onChange={handleInputChange}
              className="text-lg sm:text-xl font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
            />
          ) : (
            <h1 className="text-lg sm:text-xl font-semibold">
              {libraryData.libraryName}
            </h1>
          )}
        </div>
        <button
          onClick={handleEditClick}
          className={`bg-[#001F54] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 hover:bg-[#8E939D] transition-colors w-full sm:w-auto justify-center ${
            isEditing ? "bg-[#8E939D]" : ""
          }`}
        >
          <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Edit</span>
        </button>
      </div>

      {/* Information Fields */}
      <div className="space-y-6 sm:space-y-15">
        {/* Library Name */}
        <div className="relative z-0 w-full group">
          <div className="flex items-center relative">
            <Book className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3" />
            <div className="flex-1 relative">
              <input
                type="text"
                name="libraryName"
                id="libraryName"
                className="block py-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={
                  isEditing ? editData.libraryName : libraryData.libraryName
                }
                onChange={handleInputChange}
                readOnly={!isEditing}
                required
              />
              <label
                htmlFor="libraryName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Library Name
              </label>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="relative z-0 w-full group">
          <div className="flex items-center relative">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3" />
            <div className="flex-1 relative">
              <input
                type="email"
                name="email"
                id="email"
                className="block py-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={isEditing ? editData.email : libraryData.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
                required
              />
              <label
                htmlFor="email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email
              </label>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="relative z-0 w-full group">
          <div className="flex items-center relative">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3" />
            <div className="flex-1 relative">
              <input
                type="text"
                name="location"
                id="location"
                className="block py-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={isEditing ? editData.location : libraryData.location}
                onChange={handleInputChange}
                readOnly={!isEditing}
                required
              />
              <label
                htmlFor="location"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Location
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation buttons positioned at bottom center */}
      {isEditing && (
        <div className="mt-15 flex justify-center">
          <div className="w-full max-w-md px-4">
            <button
              onClick={handleSave}
              className="bg-[#001F54] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors w-full"
            >
              Confirm Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LibraryInformation;
