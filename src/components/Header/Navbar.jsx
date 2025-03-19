import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";

import searchIcon from "../../assets/Header/search-icon.svg";
import fav from "../../assets/Header/favoritte.svg";
import hug from "../../assets/Header/hug.svg";
import cart from "../../assets/Header/cart.svg";
import logo from "../../assets/Header/UNI SHOP logo.svg";
import profileIcon from "../../assets/Header/hug.svg";
import homeIcon from "../../assets/Header/home.svg";
import privacyIcon from "../../assets/Header/privacy.svg";
import helpIcon from "../../assets/Header/help.svg";
import languageIcon from "../../assets/Header/language.svg";
import logoutIcon from "../../assets/Header/logout.svg";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1024); // Adjusted for tablets
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}api/v1/auth/library/library-data`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true"); // Save login state
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("isLoggedIn"); // Clear login state
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error("Endpoint not found:", error.response.data);
        } else {
          console.error("Error checking login status:", error);
        }
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn"); // Clear login state
      }
    };

    checkLoginStatus();
  }, []);

  // Handle window resize for screen size detection
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1024); // Adjusted for tablets
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Disable body scroll when sidebar is open
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

  // Handle click outside sidebar and dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeMenu();
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isMenuOpen || isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleMouseEnter = () => {
    if (!isSmallScreen) {
      setIsDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isSmallScreen) {
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    if (isSmallScreen) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
  };

  const handleLanguageSelect = (language) => {
    console.log(`Selected language: ${language}`);
    setLanguageDropdownOpen(false); // Close the language dropdown
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}api/v1/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role"); // Clear login state
        localStorage.removeItem("userId"); // Clear login state
        setIsDropdownOpen(false);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <nav className="w-full bg-[#001F54]">
        <div className="mx-auto max-w-[1440px] h-[88px] flex items-center px-4 sm:px-8 relative">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <NavLink to="/">
              <img
                src={logo}
                alt="Uni Shop Logo"
                className="w-20 h-15 sm:w-40 sm:h-22 transition duration-300 hover:scale-110"
              />
            </NavLink>
          </div>

          {/* Search Bar - Hidden on small and tablet screens */}
          {!isSmallScreen && (
            <div className="flex-grow flex justify-center mx-4">
              <div className="flex items-center bg-white rounded-md px-2 w-full max-w-[600px]">
                <img src={searchIcon} alt="Search Icon" className="w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-[40px] bg-transparent border-none outline-none text-[#001F54] text-sm md:text-base"
                />
              </div>
            </div>
          )}

          {/* Icons - Aligned to the right */}
          <div className="flex items-center space-x-3 ml-auto">
            <button type="button">
              <img
                src={fav}
                alt="Favourite Icon"
                className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer"
              />
            </button>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={dropdownRef}
              className="relative"
            >
              <button type="button" onClick={toggleDropdown}>
                <img
                  src={hug}
                  alt="User Icon"
                  className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer"
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className={`fixed w-[299px] ${
                    isSmallScreen ? "top-[88px] right-4" : "right-0"
                  } bg-[#001F54] shadow-lg rounded-md z-50`}
                  style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
                >
                  <div className="p-4">
                    {isLoggedIn ? (
                      <>
                        <NavLink
                          to="/profile"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-white">Profile</span>
                          <img
                            src={profileIcon}
                            alt="Profile Icon"
                            className="w-6 h-6"
                          />
                        </NavLink>
                        <NavLink
                          to="/"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-white">Home</span>
                          <img
                            src={homeIcon}
                            alt="Home Icon"
                            className="w-6 h-6"
                          />
                        </NavLink>
                        <NavLink
                          to="/privacy"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-white">Privacy</span>
                          <img
                            src={privacyIcon}
                            alt="Privacy Icon"
                            className="w-6 h-6"
                          />
                        </NavLink>
                        <NavLink
                          to="/help"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-white">Help</span>
                          <img
                            src={helpIcon}
                            alt="Help Icon"
                            className="w-6 h-6"
                          />
                        </NavLink>
                        <NavLink
                          to="/MiniDrawer"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-white">Dashboard</span>
                          <MdDashboard className="w-6 h-6 text-white" />
                        </NavLink>

                        <div className="flex items-center justify-between mb-4 relative">
                          <span className="text-white">Language</span>
                          <div className="flex items-center">
                            <img
                              src={languageIcon}
                              alt="Language Icon"
                              className="w-6 h-6"
                            />
                            <button
                              onClick={toggleLanguageDropdown}
                              className="ml-2 focus:outline-none text-white"
                            >
                              ▼
                            </button>
                          </div>
                          {languageDropdownOpen && (
                            <div className="absolute top-8 right-0 bg-[#001F54] shadow-lg rounded-md p-2">
                              <button
                                onClick={() => handleLanguageSelect("Arabic")}
                                className="text-white hover:bg-[#003366] p-2 w-full text-left"
                              >
                                Arabic
                              </button>
                              <button
                                onClick={() => handleLanguageSelect("English")}
                                className="text-white hover:bg-[#003366] p-2 w-full text-left"
                              >
                                English
                              </button>
                            </div>
                          )}
                        </div>
                        <button
                          className="flex items-center justify-between mb-4 cursor-pointer w-full"
                          onClick={handleLogout}
                        >
                          <span className="text-white">Logout</span>
                          <img
                            src={logoutIcon}
                            alt="Logout Icon"
                            className="w-6 h-6"
                          />
                        </button>
                      </>
                    ) : (
                      <>
                        <NavLink
                          to="/login"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-white">Login</span>
                          <img
                            src={profileIcon}
                            alt="Login Icon"
                            className="w-6 h-6"
                          />
                        </NavLink>
                        <NavLink
                          to="/signup"
                          className="flex items-center justify-between"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-white">Signup</span>
                          <img
                            src={profileIcon}
                            alt="Signup Icon"
                            className="w-6 h-6"
                          />
                        </NavLink>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button type="button">
              <img
                src={cart}
                alt="Cart Icon"
                className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer"
              />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Only visible on small and tablet screens */}
        {isSmallScreen && (
          <div className="w-full px-4 pb-2">
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

        {/* Overlay */}
        {isMenuOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-[#D9D9D980] bg-opacity-50 z-40"
            onClick={closeMenu}
          />
        )}

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 w-64 h-screen bg-[#001F54] z-50 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Content */}
          <div className="p-4 " style={{ fontFamily: "Hedvig Letters Sans" }}>
            {/* Hamburger Icon and Categories Text */}
            <div className="flex items-center mb-6">
              <button
                type="button"
                onClick={toggleMenu}
                className="space-y-1 focus:outline-none cursor-pointer"
              >
                <div className="w-[28px] h-[5px] bg-white rounded-md"></div>
                <div className="w-[28px] h-[5px] bg-white rounded-md"></div>
                <div className="w-[28px] h-[5px] bg-white rounded-md"></div>
              </button>
              <span
                className="text-white ml-4"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: "32px",
                  lineHeight: "38.73px",
                  letterSpacing: "0%",
                }}
              >
                Categories
              </span>
            </div>

            {isSmallScreen && <></>}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
