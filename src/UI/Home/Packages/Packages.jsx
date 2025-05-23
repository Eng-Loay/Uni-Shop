import arrow from "../../../assets/Home/Packages/arrow.svg";
import eng from "../../../assets/Home/Packages/Eng-icon.gif"; // Engineering GIF
import arts from "../../../assets/Home/Packages/artist-icon.gif"; // Arts GIF
import sci from "../../../assets/Home/Packages/sci-icon.gif"; // Science GIF
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Packages() {
   const currentPage = 1;
  const API_BASE_URL = import.meta.env.VITE_API_URL;
    const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}api/v1/product/all/items?page=${currentPage}`)
      .then((res) => {
        console.log("API Response:", res.data);
        const uniqueDepartments = [
          ...new Set(res.data.data.map((item) => item.department)),
        ];
          console.log("Departments found:", uniqueDepartments);
        setDepartments(uniqueDepartments);
      })
      .catch((err) => console.error("Failed to fetch departments:", err));
  }, []);

  const handleClick = (targetKeyword) => {
    console.log("Searching for keyword:", targetKeyword);
    const found = departments.find((dept) =>
        dept?.toLowerCase().includes(targetKeyword.toLowerCase())

    );

    if (found) {
      console.log("Navigating to department:", found);
      const encoded = encodeURIComponent(found);
      navigate(`/department/${encoded}`);
    } else {
      alert("Department not found in API response");
       console.warn("Available departments:", departments);
    }
  };
 
  return (
    <div className="m-0 p-0 flex flex-col items-start w-full">
      {/* Group "PACKAGES" and the arrow icon into one div */}
      <div className="flex items-center pl-[5%]  mt-5">
        <p
          className="text-[#3E3B3B] text-[24px] lg:text-[28px] font-inter p-5 m-0 "
          style={{ fontFamily: "Inter" }}
        >
          PACKAGES
        </p>
        <img src={arrow} alt="arrow icon" className="w-6 h-6 mr-2.5" />
      </div>

      {/* Categories div */}
      <div className="mx-auto mt-2.5 pl-5 flex flex-wrap justify-center gap-28">
        <div className="flex flex-col items-center gap-2.5">
          <img
            src={eng}
            alt="Engineering GIF"
            className="w-[150px] h-[150px] lg:w-[250px] lg:h-[250px]"
          />
          <button
          onClick={() =>handleClick("Engineering tools")}
            className="text-[16px] lg:text-[20px] px-5 py-2.5 bg-[#D6DDEBA8] rounded-lg font-bold text-black"
            style={{ fontFamily: "Inter" }}
          >
            Engineering tools
          </button>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <img
            src={arts}
            alt="Arts GIF"
            className="w-[150px] h-[150px] lg:w-[250px] lg:h-[250px]"
          />
          <button
           onClick={() =>  handleClick("Fine arts tools")}
            className="text-[16px] lg:text-[20px] px-5 py-2.5 bg-[#D6DDEBA8] rounded-lg font-bold text-black"
            style={{ fontFamily: "Inter" }}
          >
            Fine arts tools
          </button>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <img
            src={sci}
            alt="Science GIF"
            className="w-[150px] h-[150px] lg:w-[250px] lg:h-[250px]"
          />
          <button
           onClick={() =>  handleClick("science")}
            className="text-[16px] lg:text-[20px] px-5 py-2.5 bg-[#D6DDEBA8] rounded-lg font-bold text-black"
            style={{ fontFamily: "Inter" }}
          >
            Science tools
          </button>
        </div>
      </div>
    </div>
  );
}
export default Packages;
