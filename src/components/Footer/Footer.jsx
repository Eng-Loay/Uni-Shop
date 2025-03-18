import FaceBook from "../../assets/Fotter/Facebook.svg";
import Instagram from "../../assets/Fotter/Instgram.svg";
import Tiktok from "../../assets/Fotter/TikTok.svg";
import Phone from "../../assets/Fotter/Phone.svg";
import Email from "../../assets/Fotter/Email.svg";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#001F54] text-white py-8 px-4 w-full flex flex-col items-center  bottom-0">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center ">
        {/* UNI SHOP Section */}
        <div>
          <h2 className="text-lg font-semibold underline mb-4">UNI SHOP</h2>
          <p className="mt-2 text-sm">
            Various versions have evolved over the years, sometimes by accident,
            sometimes on purpose (injected humour and the like).
          </p>
        </div>

        {/* About Section */}
        <div>
          <h2 className="text-lg font-semibold underline mb-4">About</h2>
          <p className="mt-2 text-sm">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-semibold underline mb-4">Contact Us</h2>
          <p className="mt-2 text-sm flex items-center justify-center">
            <img src={Phone} alt="Phone" className="mr-2 w-3 h-5" /> 01200254718
          </p>
          <p className="mt-1 text-sm flex items-center justify-center">
            <img src={Email} alt="Email" className="mr-2 w-4 h-5" />
            unishoop453@gmail.com
          </p>
          {/* Social Icons */}
          <div className="flex justify-center space-x-4 mt-4 py-[22px]">
            <a href="#" className="text-xl hover:text-gray-300">
              <img src={Tiktok} alt="Tiktok" width="35" height="35" />
            </a>
            <a href="#" className="text-xl hover:text-gray-300">
              <img src={Instagram} alt="Instagram" width="35" height="35" />
            </a>
            <a href="#" className="text-xl hover:text-gray-300">
              <img src={FaceBook} alt="Facebook" width="35" height="35" />
            </a>
          </div>
        </div>
      </div>

      {/* Join as Library Link */}
      <div className="text-center mt-6">
        <NavLink
          to="/signuplibrary"
          className="border-2 border-white rounded-[66px] w-[160px] h-[48px] flex items-center justify-center hover:bg-white hover:text-[#001F54] transition-all duration-300 text-white"
        >
          Join as Library
        </NavLink>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-xs text-gray-400 mt-2">
        &copy; 2024-2025 by UNI SHOP. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
