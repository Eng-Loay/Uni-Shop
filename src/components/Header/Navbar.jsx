/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";

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
import { useCart } from "../../pages/Student/CartContext/CartContext";
import { useWishlist } from "../../pages/Student/WishListContext/WishListContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Navbar() {
  /* Role & auth helpers */
  const userRole = localStorage.getItem("role"); // 'library' | 'user' | 'admin'
  const isLibrary = userRole === "library";
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  /* Component state */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1024);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);

  /* 1 ▪ Check login status on mount */
  useEffect(() => {
    const checkLoginStatus = async () => {
      const endpoint =
        userRole === "library"
          ? "auth/library/library-data"
          : "auth/student/user-data"; // users & admins share this

      try {
        const { status } = await axios.get(
          `${API_BASE_URL}api/v1/${endpoint}`,
          { withCredentials: true }
        );

        if (status === 200) {
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("isLoggedIn");
        }
      } catch (err) {
        console.error(
          "Error checking login status:",
          err?.response?.data ?? err
        );
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
      }
    };

    checkLoginStatus();
  }, []); // run once

  /* 2 ▪ Track viewport size */
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* 3 ▪ Freeze scroll while sidebar open */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  /* 4 ▪ Close sidebar / dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target))
        setIsMenuOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsDropdownOpen(false);
    };
    if (isMenuOpen || isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, isDropdownOpen]);

  /* 5 ▪ Close dropdown on scroll */
  useEffect(() => {
    const handleScroll = () => isDropdownOpen && setIsDropdownOpen(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDropdownOpen]);

  /* UI handlers */
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () =>
    isSmallScreen && setIsDropdownOpen(!isDropdownOpen);
  const handleMouseEnter = () => !isSmallScreen && setIsDropdownOpen(true);
  const handleMouseLeave = () => !isSmallScreen && setIsDropdownOpen(false);
  const toggleLanguageDropdown = () =>
    setLanguageDropdownOpen(!languageDropdownOpen);

  const handleLanguageSelect = (lang) => {
    console.log(`Selected language: ${lang}`);
    setLanguageDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      const { status } = await axios.post(
        `${API_BASE_URL}api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (status === 200) {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        setIsDropdownOpen(false);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  /* JSX */
  return (
    <div className="overflow-x-hidden">
      <nav className="w-full bg-[#001F54]">
        <div className="mx-auto max-w-[1440px] h-[88px] flex items-center px-4 sm:px-8 relative">
          {/* Logo */}
          <NavLink to="/" className="flex items-center overflow-hidden">
            <img
              src={logo}
              alt="Uni Shop logo"
              className="w-20 m-10 sm:m-0 md:m-0 h-15 sm:w-40 sm:h-22 transition duration-300 hover:scale-110"
            />
          </NavLink>

          {/* Desktop search */}
          {!isSmallScreen && (
            <div className="flex-grow flex justify-center mx-4">
              <div className="flex items-center bg-white rounded-md px-2 w-full max-w-[600px]">
                <img src={searchIcon} alt="Search" className="w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-[40px] bg-transparent border-none outline-none text-[#001F54] text-sm md:text-base"
                />
              </div>
            </div>
          )}

          {/* Right-side icons */}
          <div className="flex items-center space-x-3 ml-auto">
            {isLoggedIn &&userRole!="student"? (
              <>
                <button>
                  <IoIosNotificationsOutline className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </button>
                <button>
                  <IoSettingsOutline className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </button>
              </>
            ) : (
              <>
              <div className="relative">
                <button onClick={() => navigate('/wishlist')}>
                  <img
                    src={fav}
                    alt="Favourite"
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  />
                </button>
                {wishlistCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
                </div>
                <div className="relative">
                <button onClick={() => navigate('/cart')}>
                  <img
                    src={cart}
                    alt="Cart"
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  />
                </button>
                {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {cartCount}
        </span>
      )}
                </div>
              </>
            )}

            {/* Avatar + dropdown */}
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={dropdownRef}
              className="relative"
            >
              <button onClick={toggleDropdown}>
                <img src={hug} alt="User" className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {isDropdownOpen && (
                <div
                  className={`fixed w-[299px] ${
                    isSmallScreen ? "top-[88px] right-4" : "right-0"
                  } bg-[#001F54] shadow-lg rounded-md z-50`}
                  style={{ boxShadow: "0 4px 4px 0 #00000040" }}
                >
                  <div className="p-4">
                    {isLoggedIn ? (
                      <>
                        <NavLink
                          to="/minidrawer/information"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-white">Profile</span>
                          <img src={profileIcon} alt="" className="w-6 h-6" />
                        </NavLink>
                        <NavLink
                          to="/"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-white">Home</span>
                          <img src={homeIcon} alt="" className="w-6 h-6" />
                        </NavLink>
                        <NavLink
                          to="/privacy"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-white">Privacy</span>
                          <img src={privacyIcon} alt="" className="w-6 h-6" />
                        </NavLink>
                        <NavLink
                          to="/help"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-white">Help</span>
                          <img src={helpIcon} alt="" className="w-6 h-6" />
                        </NavLink>
                        <NavLink
                          to="/MiniDrawer/home"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-white">Dashboard</span>
                          <MdDashboard className="w-6 h-6 text-white" />
                        </NavLink>

                        {/* Language selector */}
                        <div className="flex items-center justify-between mb-4 relative">
                          <span className="text-white">Language</span>
                          <div className="flex items-center">
                            <img
                              src={languageIcon}
                              alt=""
                              className="w-6 h-6"
                            />
                            <button
                              onClick={toggleLanguageDropdown}
                              className="ml-2 text-white"
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
                          onClick={handleLogout}
                          className="flex items-center justify-between mb-4 w-full"
                        >
                          <span className="text-white">Logout</span>
                          <img src={logoutIcon} alt="" className="w-6 h-6" />
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
                          <img src={profileIcon} alt="" className="w-6 h-6" />
                        </NavLink>
                        <NavLink
                          to="/signup"
                          className="flex items-center justify-between"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-white">Signup</span>
                          <img src={profileIcon} alt="" className="w-6 h-6" />
                        </NavLink>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
        {isSmallScreen && (
          <div className="w-full px-4 pb-2">
            <div className="flex items-center bg-white rounded-md px-2">
              <img src={searchIcon} alt="Search" className="w-5 h-5" />
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
            className="fixed top-0 left-0 w-full h-full bg-[#D9D9D980] z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 w-64 h-screen bg-[#001F54] z-50 transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4" style={{ fontFamily: "Hedvig Letters Sans" }}>
            <div className="flex items-center mb-6">
              <button onClick={toggleMenu} className="space-y-1">
                <div className="w-[28px] h-[5px] bg-white rounded-md" />
                <div className="w-[28px] h-[5px] bg-white rounded-md" />
                <div className="w-[28px] h-[5px] bg-white rounded-md" />
              </button>
              <span
                className="text-white ml-4"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: "32px",
                  lineHeight: "38.73px",
                }}
              >
                Categories
              </span>
            </div>

            {/* TODO: sidebar links */}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
