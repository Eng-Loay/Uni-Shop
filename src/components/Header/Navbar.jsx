// src/components/Header/Navbar.jsx
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import { toast } from "react-toastify";

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

export default function Navbar() {
  // Role & auth
  const userRole = localStorage.getItem("role"); // 'library' | 'user' | 'admin'
  const isLibrary = userRole === "library";
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const notifRef = useRef(null);

  // Close notifications dropdown on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (
        notifDropdownOpen &&
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [notifDropdownOpen]);

  // Admin socket
  useEffect(() => {
    if (userRole !== "admin" || !userId) return;
    socket.emit("register", userId);
    socket.on("library-request", (library) => {
      const libraryName = library.name || library.username || "New Library";
      const id = library._id || Date.now();
      setNotifications((prev) => [{ id, name: libraryName }, ...prev]);

      toast.info(
        <div className="bg-[#001F54] rounded-lg shadow-lg overflow-hidden w-80">
          <div className="flex items-center px-4 py-3 space-x-2">
            <IoIosNotificationsOutline className="text-xl text-blue-300" />
            <span className="font-medium text-blue-300">
              New library registered:{" "}
              <strong className="text-white">{libraryName}</strong>
            </span>
          </div>
          <div className="h-1 bg-white/30">
            <div className="h-full bg-white animate-toast-progress" />
          </div>
          <div className="px-4 py-3 border-t border-white/20 text-right">
            <button
              onClick={() => navigate("/adminedrawer/request")}
              className="
                inline-block px-5 py-2
                bg-white text-[#001F54]
                font-semibold
                rounded-full
                shadow-md
                hover:bg-gray-100
                transition
              "
            >
              View Requests
            </button>
          </div>
        </div>,
        {
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          icon: false,
          className: "bg-transparent p-0 shadow-none",
          bodyClassName: "bg-transparent p-0",
        }
      );
    });
    return () => socket.off("library-request");
  }, [userRole, userId, navigate]);

  // Login status
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      const endpoint =
        userRole === "library"
          ? "auth/library/library-data"
          : "auth/student/user-data";
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
      } catch {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
      }
    }
    checkLoginStatus();
  }, [userRole]);

  // Screen size
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth <= 1024
  );
  useEffect(() => {
    const onResize = () => setIsSmallScreen(window.innerWidth <= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Sidebar scroll lock
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMenuOpen]);

  // Avatar dropdown & sidebar ref
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isMenuOpen || isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, isDropdownOpen]);

  useEffect(() => {
    const onScroll = () => isDropdownOpen && setIsDropdownOpen(false);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDropdownOpen]);

  // UI handlers
  const toggleMenu = () => setIsMenuOpen((o) => !o);
  const handleDropdownToggle = () => setIsDropdownOpen((o) => !o);

  // Language selector
  const toggleLanguageDropdown = () =>
    setLanguageDropdownOpen((o) => !o);
  const handleLanguageSelect = (lang) => {
    console.log(`Selected language: ${lang}`);
    setLanguageDropdownOpen(false);
  };

  // Logout
  const handleLogout = async () => {
    try {
      const { status } = await axios.post(
        `${API_BASE_URL}api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (status === 200) {
        setIsLoggedIn(false);
        localStorage.clear();
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <nav className="w-full bg-[#001F54] overflow-visible relative z-20">
        <div className="mx-auto max-w-[1440px] h-[88px] flex items-center px-4 sm:px-8">
          {/* Logo */}
          <NavLink to="/" className="flex items-center overflow-hidden">
            <img
              src={logo}
              alt="Uni Shop logo"
              className="w-20 m-10 sm:m-0 h-15 sm:w-40 sm:h-22 transition duration-300 hover:scale-110"
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

          {/* Notifications, Settings, Avatar */}
          <div className="flex items-center space-x-3 ml-auto overflow-visible">
            {/* Admin‐only notifications */}
            {isLoggedIn && userRole === "admin" && (
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setNotifDropdownOpen((o) => !o)}
                  className="cursor-pointer relative"
                >
                  <IoIosNotificationsOutline className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
                {notifDropdownOpen && (
                  <div className="
                    fixed right-8 top-[88px] w-64
                    bg-[#001F54] text-white
                    shadow-lg rounded z-50
                    max-h-80 overflow-y-auto
                  ">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                        >
                          {n.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-white/50">
                        No notifications
                      </div>
                    )}
                    <div className="border-t border-white/20 p-4">
                      <button
                        onClick={() => navigate("/adminedrawer/request")}
                        className="
                          w-full px-6 py-2
                          bg-white text-[#001F54]
                          font-bold rounded-full
                          shadow-lg hover:bg-gray-100
                          transition-all duration-200
                        "
                      >
                        View All Requests
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings (all logged-in users) */}
            {isLoggedIn && (
              <button className="cursor-pointer">
                <IoSettingsOutline className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </button>
            )}

            {/* Guest favourites & cart */}
            {!isLoggedIn && (
              <>
                <div className="relative">
                  <button onClick={() => navigate("/wishlist")}>
                    <img
                      src={fav}
                      alt="Favourite"
                      className="w-6 h-6 sm:w-8 sm:h-8"
                    />
                  </button>
                  {wishlistCount > 0 && (
                    <span className="
                      absolute -top-2 -right-2
                      bg-red-500 text-white text-xs
                      rounded-full h-5 w-5 flex items-center justify-center
                    ">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <button onClick={() => navigate("/cart")}>
                    <img
                      src={cart}
                      alt="Cart"
                      className="w-6 h-6 sm:w-8 sm:h-8"
                    />
                  </button>
                  {cartCount > 0 && (
                    <span className="
                      absolute -top-2 -right-2
                      bg-red-500 text-white text-xs
                      w-5 h-5 rounded-full
                      flex items-center justify-center
                    ">
                      {cartCount}
                    </span>
                  )}
                </div>
              </>
            )}

            {/* ─── Avatar (always visible) ─── */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen((o) => !o)}
                className="cursor-pointer"
              >
                <img src={hug} alt="User" className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {isDropdownOpen && (
                <div
                  className={`
          fixed w-[299px]
          ${isSmallScreen ? "top-[88px] right-4" : "right-0"}
          bg-[#001F54] shadow-lg rounded-md z-50
        `}
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
