import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import img1 from '../../../../assets/Home/Libraries/Garo.svg'
const API_BASE_URL = import.meta.env.VITE_API_URL;

function ItemsLibrary() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [libraryData, setLibraryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get(`${API_BASE_URL}api/v1/auth/library/${userId}/items`);
        setItems(itemsResponse.data.data);

        const libraryDataResponse = await axios.get(`${API_BASE_URL}api/v1/auth/library/${userId}/info`);
        setLibraryData(libraryDataResponse.data.data);

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Run only once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="container mx-auto max-w-7xl px-20 py-4">
        <div className="flex justify-between items-center">
         <div className='flex items-center space-x-1'>
         <img className="p-2 w-25 rounded-full" src={img1}/> 
         <span className="p-2">{libraryData.username}</span>
            </div>
          
          <button
            onClick={() => navigate('/addItem')}
            className="bg-blue-600 text-white rounded-lg px-3 py-2 shadow-md focus:ring-2 focus:ring-blue-500 hover:bg-white hover:text-black transition-all"
          >
            Add items
          </button>
        

        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-50">
        <div className="flex justify-center items-center flex-wrap p-4">
          {items.map((item) => (
            <div
              key={item._id} // Add a unique key for each item
              className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 lg:w-1/4 md:1/2 sm:w-full"
            >
              <a href="#">
                <img className="w-150 " src={img1} alt="img" />
              </a>
              <div className="p-3">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {item.name}
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ItemsLibrary;