import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink
import searchIcon from "../../assets/Header/search-icon.svg";
import fav from "../../assets/Header/favoritte.svg";
import hug from "../../assets/Header/hug.svg";
import cart from "../../assets/Header/cart.svg";
import logo from "../../assets/Header/UNI SHOP logo.svg";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 860);

  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 860);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Disable scroll behind the sidebar when it's open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="overflow-x-hidden">
      <nav className="w-full bg-[#001F54]">
        <div className="mx-auto max-w-[1440px] h-[88px] flex items-center px-4 sm:px-8 relative">
          {/* Hamburger Menu */}
          <button
            type="button"
            ref={hamburgerRef}
            className="space-y-1 mr-4 focus:outline-none"
            onClick={toggleMenu}
          >
            <div className="w-[28px] h-[5px] bg-white rounded-md"></div>
            <div className="w-[28px] h-[5px] bg-white rounded-md"></div>
            <div className="w-[28px] h-[5px] bg-white rounded-md"></div>
          </button>

          {/* Log in & Sign up (Desktop Only) */}
          {!isMobile && (
            <ul
              className="hidden sm:flex space-x-[20px]"
              style={{ fontFamily: "Hedvig Letters Sans" }}
            >
              <li className="nav-login">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `border-2 border-white rounded-[66px] w-[117px] h-[48px]
                    flex items-center justify-center 
                    hover:bg-white hover:text-[#001F54]
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-white text-[#001F54]" // Active state
                        : "text-white" // Default (non-active) state
                    }`
                  }
                >
                  Log in
                </NavLink>
              </li>
              <li className="nav-signup">
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `border-2 border-white rounded-[66px] w-[117px] h-[48px]
                    flex items-center justify-center 
                    hover:bg-white hover:text-[#001F54]
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-white text-[#001F54]" // Active state
                        : "text-white" // Default (non-active) state
                    }`
                  }
                >
                  Sign up
                </NavLink>
              </li>
            </ul>
          )}

          {/* Logo & Title */}
          <div className="flex items-center space-x-3 lg:ml-10">
            <NavLink to="/">
              <img
                src={logo}
                alt="Uni Shop Logo"
                className="w-8 h-8 sm:w-16 sm:h-16 transition duration-300 hover:scale-110"
              />
            </NavLink>

            <span
              className="text-white font-bold text-lg sm:text-xl md:text-2xl"
              style={{ fontFamily: "Inter" }}
            >
              Uni Shop
            </span>
          </div>

          {/* Search Bar (Tablet & Desktop) */}
          <div className="hidden sm:flex items-center bg-white rounded-md px-2 lg:ml-[450px] md:ml-16 lg:mr-5 ">
            <img src={searchIcon} alt="Search Icon" className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              className="w-[180px] md:w-[250px] h-[40px] bg-transparent border-none outline-none text-[#001F54] text-sm md:text-base"
            />
          </div>

          {/* Icons */}
          <div className="ml-auto flex items-center space-x-3">
            <button type="button">
              <img
                src={fav}
                alt="Favourite Icon"
                className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer"
              />
            </button>
            <button type="button">
              <img
                src={hug}
                alt="User Icon"
                className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer"
              />
            </button>
            <button type="button">
              <img
                src={cart}
                alt="Cart Icon"
                className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer"
              />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobile && (
          <div className="w-full px-4 pb-2 sm:hidden">
            <div className="flex items-center bg-white rounded-md px-2">
              <img src={searchIcon} alt="Search Icon" className="w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                className="w-full h-[40px] bg-transparent border-none outline-none text-[#001F54] text-sm"
              />
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed 
            top-[88px] 
            left-0 
            w-64 
            h-[calc(100vh-88px)] 
            bg-[#001F54] 
            z-50 
            transform 
            transition-transform 
            duration-300 
            ease-in-out
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Sidebar Content */}
          <div className="p-4 " style={{ fontFamily: "Hedvig Letters Sans" }}>
            {isMobile && (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `text-white text-center font-bold block mb-4 hover:bg-[#003366] transition-colors duration-200 p-2 rounded ${
                      isActive ? "bg-[#003366]" : ""
                    }`
                  }
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `text-white text-center font-bold block hover:bg-[#003366] transition-colors duration-200 p-2 rounded ${
                      isActive ? "bg-[#003366]" : ""
                    }`
                  }
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
