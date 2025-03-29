/* eslint-disable react/prop-types */
import { useContext } from 'react'
import { createContext, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const userId = localStorage.getItem("userId");
const API_URL=`${API_BASE_URL}api/v1/auth/library/${userId}/new_product`;

export const ItemsContext =createContext();
export const ItemsProvider=({ children }) => {

    const [items, setItems] = useState([]);
    const addItem=(newItem)=>{
      setItems(prevItems=>[...prevItems,newItem]);
    };

   const fetchItems=async()=>{
    try{
    const response=await axios.get(API_URL);
    setItems(response.data);
    }
    catch(error){
      console.error('Error fetching items:', error);
    }
   }
      
    
  return (
 <>
   <ItemsContext.Provider value={{ items, addItem, fetchItems }}>
      {children}
    </ItemsContext.Provider>
 </>
  )
}
export const useItems=()=>useContext(ItemsContext);