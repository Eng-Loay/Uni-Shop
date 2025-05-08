import React from 'react'
import { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../../components/Loader/Loader';
const API_BASE_URL = import.meta.env.VITE_API_URL;


function ItemsDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const productImages = item?.product_pictures?.map(pic => pic?.secure_url) || [];

    const handleEdit = (itemId) => {
        navigate(`/minidrawer/items/edititems/${itemId}`); 
      };
    
    useEffect(() => {
      const fetchItem = async () => {
        try {
            const userId = localStorage.getItem("userId");
          const response = await axios.get(`${API_BASE_URL}api/v1/product/${id}/details`);
          setItem(response.data.data);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };
  
      fetchItem();
    }, [id]);
  
    if (loading) return <Loader/>;
    if (error) return <div className="text-center text-red-600">Error: {error.message}</div>;
    if (!item) return <div className="text-center">Item not found.</div>;
  
  return (
    <>
   




    <div className="container mx-auto max-w-7xl px-4 py-18">
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left side - Image + thumbnails */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden flex-grow flex items-center justify-center p-8">
          <img
              src={productImages[selectedImageIndex]}
              alt={`${item.name} - Main view`}
              className="max-h-[400px] w-auto object-contain"
              style={{ maxWidth: '80%' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Available';
              }}
            />
           </div>
            {/* Thumbnail gallery */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${item.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

      
        </div>

        {/* Right side - Product Info */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-sm flex flex-col">
        <div className="flex-grow">
            <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
            {/* Reviews */}
            <div className="flex items-center mt-2 text-yellow-400">
              ★★★★☆ <span className="text-gray-600 text-sm ml-2">(150 reviews)</span>
            </div>
          </div>

          {/* Availability, Brand, Category */}
          <div className="text-sm text-gray-700 space-y-1">
            <p><span className="font-semibold">Availability:</span> <span className="text-green-600">In Stock</span></p>
            <p><span className="font-semibold">Brand:</span> Apex</p>
            <p><span className="font-semibold">Category:</span> {item.Faculties_and_levels?.[0]?.faculty || "General"}</p>
            <p><span className="font-semibold">Level:</span> {item.Faculties_and_levels?.[0]?.level || "All"}</p>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-[#001F54]">{item.price} EGP</span>
            <span className="line-through text-gray-400">599 EGP</span>
          </div>

          {/* Description */}
          <p className="text-gray-600">{item.description}</p>

         

        

     

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button  onClick={() => handleEdit(item._id)} className="flex-1 bg-[#001F54] text-white py-3 rounded-md hover:bg-indigo-600 text-white">
              Edit
            </button>
        
          </div>
        </div>
      </div>
    </div>



    </>
  )
}

export default ItemsDetails