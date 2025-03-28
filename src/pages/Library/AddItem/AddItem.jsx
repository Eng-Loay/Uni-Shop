import {useState,useContext} from "react";
import { useNavigate } from "react-router-dom";
import { ItemsContext } from "../ItemsContext/ItemsContext";
import FormData from "form-data";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_URL;



 function  AddItem() {
  const userId = localStorage.getItem("userId");
  const { addItem } = useContext(ItemsContext);
  const [formState, setFormSate] = useState({ name: "",
     description: "",
     faculty:"",
     department:"",
     type:"",
     price:"",
     quantity:"",
     brand:"",
     product_pictures: [] ,
    });
    
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormSate((prev) => ({ ...prev, [name]: value }));
  };
  
  
  const handlePictureUpload = (e) => {
    setFormSate((prev) => ({
      ...prev,
      product_pictures: Array.from(e.target.files),
    }));
  };
  
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      setIsUploading(true);
    
try{
  const formData= new FormData();
  formData.append('name',formState.name);
  formData.append('description',formState.description);
  formData.append('faculty',formState.faculty);
  formData.append('department',formState.department);
  formData.append('type',formState.type);
  formData.append('price',formState.price);
  formData.append('quantity',formState.quantity);
  formData.append('brand',formState.brand);


  if (formState.product_pictures.length > 0) {
    formState.product_pictures.forEach((file) => {
      formData.append("product_pictures", file);
    });
  }
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  const response = await axios.post(`${API_BASE_URL}api/v1/auth/library/${userId}/new_product`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  } );


  if (response.status === 200 || response.status === 201) {
    setUploadSuccess(true);
    console.log("Upload successful:", response.data);
    addItem(response.data); 
    Swal.fire({
      title: "Item uploaded successfully!",
      icon: "success",
      timer: 2000, 
      showConfirmButton: false,
      draggable: true,
    });
    navigate("/minidrawer/items"); 
  }
}catch (error) {
  console.error('Error details:', {
    message: error.message,
    response: error.response?.data,
    stack: error.stack
  });
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: `Upload failed: ${error.response?.data?.message || 'Server error'}`,
    
  });
} finally {
  setIsUploading(false);
}
    };


  return( <>
  <div className="container mx-auto max-w-7xl px-20 py-4 ">
  <h2 className="font-bold text-xl mb-6 ">Item Details</h2>
<div className="container mx-auto max-w-7xl px-20 py-4">
 
  {uploadSuccess&& (<div className="success-message">
    Item uploaded successfully!
  </div>
 )}
 <div className="container mx-auto max-w-2xl mt-10">
 <form onSubmit={handleSubmit} className="w-full">
 
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <input type="text" name="name" id="name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={formState.name} onChange={handleChange} required />
          <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Item name</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
      <select
        name="faculty"
        id="faculty"
         defaultValue=""
        value={formState.faculty} onChange={handleChange}
        className="block  py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer dark:text-white dark:border-gray-600 dark:focus:border-blue-500"
        required
      >
         <option value="" disabled>Select Faculty</option>
        <option value="science">Science</option>
        <option value="arts">Arts</option>
        <option value="commerce">Commerce</option>
        <option value="engineering">Engineering</option>
      </select>
      <label
        htmlFor="faculty"
        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Faculty
      </label>
    
    </div>
    
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
      <div className="relative z-0 w-full mb-5 group">
      <select
        name="department"
        id="department"
         defaultValue=""
        value={formState.department} onChange={handleChange}
        className="block  py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer dark:text-white dark:border-gray-600 dark:focus:border-blue-500"
        required
      >
        <option value="" disabled>Select Department</option>
        <option value="science">Computer Science</option>
        <option value="arts">Arts</option>
        <option value="commerce">Medicine</option>
      </select>
      <label
        htmlFor="department"
        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Department
      </label>
    
    </div>
    <div className="relative z-0 w-full mb-5 group">
      <select
        name="type"
        id="type"
       
        value={formState.type} onChange={handleChange}
        className="block  py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer dark:text-white dark:border-gray-600 dark:focus:border-blue-500"
        required
        
      >
         <option value="" disabled>Select Type</option>
        <option value="single">single</option>
        <option value="package">package</option>
        
      </select>
      <label
        htmlFor="type"
        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Type
      </label>
    
    </div>
    
      </div>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
      <div className="relative z-0 w-full mb-5 group">
          <input type="number" name="price" id="price" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={formState.price} onChange={handleChange} required />
          <label htmlFor="price" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Price</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input type="number" name="quantity" id="quantity" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={formState.quantity} onChange={handleChange} required />
          <label htmlFor="quantity" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Quantity</label>
        </div>
      </div>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
      <div className="relative z-0 w-full mb-5 group">
          <input type="text" name="brand" id="brand" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={formState.brand} onChange={handleChange} required />
          <label htmlFor="brand" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Brand</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
      <input
        type="file"
        name="product_pictures"
        id="product_pictures"
         onChange={handlePictureUpload}
        multiple
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer dark:text-white dark:border-gray-600 dark:focus:border-blue-500 file:hidden"
        required
      />
      <label
        htmlFor="product_pictures"
        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Upload Pictures
      </label>
    
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        📁
      </div>
    </div>
    
      </div>
    
    
      <div className="relative z-0 w-full mb-5 group">
          <input type="text" name="description" id="description" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={formState.description} onChange={handleChange} required />
          <label
           htmlFor="description" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
      </div>
      <button type="submit"  className="w-full h-14 bg-[#001F54] hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ">
        Upload</button>
    </form>



 </div>
</div>
</div>

  </>
  );
    }
  

export default AddItem;
