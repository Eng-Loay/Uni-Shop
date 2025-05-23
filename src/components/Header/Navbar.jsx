// src/components/Header/Navbar.jsx
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { MdDashboard } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
// import { IoSettingsOutline } from "react-icons/io5";

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

import { useCart } from "../../pages/Student/CartContext/CartContext";
import { useWishlist } from "../../pages/Student/WishListContext/WishListContext";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Navbar() {
  /* ─── Role & Auth ─────────────────────────────────────────────────── */
  const { isAuthenticated, userRole, userId, logout } = useAuth();
  const isLibrary = userRole === "library";
  const isStudent = userRole === "student";
  const isAdmin = userRole === "admin";
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  /* ─── SEARCH (pure front-end with auto-complete) ──────────────────── */
  const [allNames, setAllNames] = useState([]); // [{ raw, lower }]
  const [term, setTerm] = useState("");
  const [suggestions, setSuggest] = useState([]); // array of raw names
  const [index, setIndex] = useState(-1); // highlighted suggestion
  const searchRef = useRef(null);
  const suggestBoxRef = useRef(null);

  /* load names once */
  // useEffect(() => {
  //   // debounce – wait 300 ms after the last key-stroke
  //   const id = setTimeout(() => {
  //     const t = term.trim();
  //     const base = isLibrary ? "/minidrawer/items" : "/productshome";

  //     if (t) {
  //       // replace:true so we don’t clutter browser history
  //       navigate(`${base}?search=${encodeURIComponent(t)}`, { replace: true });
  //     } else {
  //       navigate(base, { replace: true });
  //     }
  //   }, 300);

  //   return () => clearTimeout(id); // clear on next key-stroke
  // }, [term, isLibrary, navigate]);

  const refreshSuggestions = (value) => {
    const v = value.toLowerCase().trim();
    if (!v) {
      setSuggest([]);
      return;
    }
    setSuggest(
      allNames
        .filter(({ lower }) => lower.includes(v))
        .slice(0, 6)
        .map(({ raw }) => raw)
    );
    setIndex(-1);
  };

  const commitSearch = (value) => {
    const name = value?.trim();
    if (!name) return;
    const path = isLibrary
      ? `/minidrawer/items?search=${encodeURIComponent(name)}`
      : `/productshome?search=${encodeURIComponent(name)}`;
    navigate(path);
    setTerm("");
    setSuggest([]);
    setIndex(-1);
    searchRef.current?.blur();
  };

  const onChange = (e) => {
    const v = e.target.value;
    setTerm(v);
    refreshSuggestions(v);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (index >= 0) {
        commitSearch(suggestions[index]);
      } else {
        commitSearch(term);
      }
    } else if (e.key === "Escape") {
      setSuggest([]);
      setIndex(-1);
    }
  };

  /* click outside -> close suggestions */
  useEffect(() => {
    const handler = (e) => {
      if (
        suggestBoxRef.current &&
        !suggestBoxRef.current.contains(e.target) &&
        !searchRef.current?.contains(e.target)
      ) {
        setSuggest([]);
        setIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ───  Admin / Library notifications (unchanged)  ─────────────────── */
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [adminNotifDropdownOpen, setAdminNotifDropdownOpen] = useState(false);
  const adminNotifRef = useRef(null);

  const [orderNotifications, setOrderNotifications] = useState([]);
  const [orderNotifDropdownOpen, setOrderNotifDropdownOpen] = useState(false);
  const orderNotifRef = useRef(null);

  /* outside click for notification dropdowns */
  useEffect(() => {
    const handler = (e) => {
      if (
        adminNotifDropdownOpen &&
        adminNotifRef.current &&
        !adminNotifRef.current.contains(e.target)
      )
        setAdminNotifDropdownOpen(false);

      if (
        orderNotifDropdownOpen &&
        orderNotifRef.current &&
        !orderNotifRef.current.contains(e.target)
      )
        setOrderNotifDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [adminNotifDropdownOpen, orderNotifDropdownOpen]);

  /* ─── SOCKET: admin library-request ──────────────────────────────── */
  useEffect(() => {
    if (userRole !== "admin" || !userId) return;
    socket.emit("register", userId);

    const listener = (library) => {
      const name = library.name || library.username || "New Library";
      const id = library._id || Date.now();
      setAdminNotifications((prev) => [{ id, name }, ...prev]);

      toast.info(
        <div className="bg-[#001F54] rounded-lg shadow-lg overflow-hidden w-80">
          <div className="flex items-center px-4 py-3 space-x-2">
            <IoIosNotificationsOutline className="text-xl text-blue-300" />
            <span className="font-medium text-blue-300">
              New library registered:{" "}
              <strong className="text-white">{name}</strong>
            </span>
          </div>
          <div className="h-1 bg-white/30">
            <div className="h-full bg-white animate-toast-progress" />
          </div>
          <div className="px-4 py-3 border-t border-white/20 text-right">
            <button
              onClick={() => navigate("/adminedrawer/request")}
              className="inline-block px-5 py-2 bg-white text-[#001F54] font-semibold rounded-full shadow-md hover:bg-gray-100 transition"
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
    };

    socket.on("library-request", listener);
    return () => socket.off("library-request", listener);
  }, [userRole, userId, navigate]);

  /* ─── SOCKET: library order-notification ─────────────────────────── */
  useEffect(() => {
    if (!isLibrary || !userId) return;
    socket.emit("register", userId);

    const listener = (payload) => {
      const id = `${payload.orderId}-${Date.now()}`;
      const title = `Order #${payload.orderId} from ${payload.customer_name}`;
      setOrderNotifications((prev) => [{ id, title, ...payload }, ...prev]);

      toast.info(
        <div className="bg-[#001F54] rounded-lg shadow-lg overflow-hidden w-80">
          <div className="flex items-center px-4 py-3 space-x-2">
            <IoIosNotificationsOutline className="text-xl text-green-300" />
            <span className="font-medium text-green-300">
              New order received:{" "}
              <strong className="text-white">#{payload.orderId}</strong>
            </span>
          </div>
          <div className="h-1 bg-white/30">
            <div className="h-full bg-white animate-toast-progress" />
          </div>
          <div className="px-4 py-3 border-t border-white/20 text-right">
            <button
              onClick={() => navigate("/minidrawer/orders")}
              className="inline-block px-5 py-2 bg-white text-[#001F54] font-semibold rounded-full shadow-md hover:bg-gray-100 transition"
            >
              View Orders
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
    };

    socket.on("order-notification", listener);
    return () => socket.off("order-notification", listener);
  }, [isLibrary, userId, navigate]);
  useEffect(() => {
    // Run ONLY for logged-in students
    if (!isStudent || !userId) return;

    // Make sure the user is registered
    socket.emit("register", userId);
    console.log("🎈 Registering socket for birthday check:", userId);

    // Listener for birthday event (expects a simple message string)
    const listener = (message) => {
      console.log("🎁 Birthday message received:", message);
      Swal.fire({
        title: `🎉 Happy Birthday!`,
        html: `
        <div class="flex flex-col items-center">
          <img src="https://cdn-icons-png.flaticon.com/512/3159/3159066.png" style="width:190px;margin-bottom:12px;border-radius:8px" />
          <p class="text-[#001F54]">${message}</p>
          </div>
        `,
        width: 360,
        background: "#fff",
        confirmButtonColor: "#001F54",
        confirmButtonText: "Thanks!",
        showCloseButton: true,
        padding: "1.5rem",
      });
    };

    socket.on("birthday", listener);

    return () => {
      socket.off("birthday", listener); // cleanup
    };
  }, [isStudent, userId]);

  /* ─── Login state (using AuthContext) ────────────────────────────── */
  // isAuthenticated comes directly from AuthContext now
  // No need to manually check or update localStorage

  /* ─── Responsive helper ─────────────────────────────────────────── */
  const [isSmall, setIsSmall] = useState(window.innerWidth <= 1024);
  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth <= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ─── Sidebar & dropdowns (unchanged) ───────────────────────────── */
  const [sideOpen, setSideOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const sideRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = sideOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [sideOpen]);

  useEffect(() => {
    const clickOutside = (e) => {
      if (sideRef.current && !sideRef.current.contains(e.target))
        setSideOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target))
        setAvatarOpen(false);
    };
    if (sideOpen || avatarOpen)
      document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [sideOpen, avatarOpen]);

  /* ─── Handlers ──────────────────────────────────────────────────── */
  const handleLogout = async () => {
    try {
      await logout(); // Use the logout function from AuthContext
      navigate("/"); // Use React Router's navigate instead of window.location
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /* ─── Render ───────────────────────────────────────────────────── */
  return (
    <div className="overflow-x-hidden">
      <nav className="w-full bg-[#001F54] overflow-visible relative ">
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
          {!isSmall && (
            <div className="flex-grow flex justify-center mx-4 relative">
              <div className="flex items-center bg-white rounded-md px-2 w-full max-w-[600px]">
                <img src={searchIcon} alt="Search" className="w-5 h-5" />
                <input
                  ref={searchRef}
                  type="text"
                  value={term}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  placeholder="Search"
                  className="w-full h-[40px] bg-transparent border-none outline-none text-[#001F54] text-sm md:text-base"
                />
              </div>

              {suggestions.length > 0 && (
                <ul
                  ref={suggestBoxRef}
                  className="absolute top-10 w-full max-w-[600px] bg-white rounded shadow-lg z-[200]"
                >
                  {suggestions.map((name, i) => (
                    <li
                      key={name}
                      onMouseDown={() => commitSearch(name)}
                      className={`px-4 py-2 cursor-pointer ${
                        i === index ? "bg-gray-100" : "hover:bg-gray-50"
                      }`}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Right-side icons (notifications, wishlist, cart, avatar…) */}
          {/* ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */}
          <div className="flex items-center space-x-3 ml-auto overflow-visible">
            {/* Admin notifications */}
            {isAuthenticated && isAdmin && (
              <div ref={adminNotifRef} className="relative">
                <button
                  onClick={() => setAdminNotifDropdownOpen((o) => !o)}
                  className="cursor-pointer relative"
                >
                  <IoIosNotificationsOutline className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  {adminNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                {adminNotifDropdownOpen && (
                  <div className="fixed right-8 top-[88px] w-64 bg-[#001F54] text-white shadow-lg rounded max-h-80 overflow-y-auto z-[120]">
                    {adminNotifications.length > 0 ? (
                      adminNotifications.map((n) => (
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
                        className="w-full px-6 py-2 bg-white text-[#001F54] font-bold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-200"
                      >
                        View All Requests
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Library order notifications */}
            {isAuthenticated && isLibrary && (
              <div ref={orderNotifRef} className="relative">
                <button
                  onClick={() => setOrderNotifDropdownOpen((o) => !o)}
                  className="cursor-pointer relative"
                >
                  <IoIosNotificationsOutline className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  {orderNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </button>

                {orderNotifDropdownOpen && (
                  <div className="fixed right-8 top-[88px] w-72 bg-[#001F54] text-white shadow-lg rounded max-h-80 overflow-y-auto z-[120]">
                    {orderNotifications.length > 0 ? (
                      orderNotifications.map((n) => (
                        <div
                          key={n.id}
                          className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                        >
                          {n.title}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-white/50">
                        No notifications
                      </div>
                    )}

                    <div className="border-t border-white/20 p-4">
                      <button
                        onClick={() => navigate("/minidrawer/orders")}
                        className="w-full px-6 py-2 bg-white text-[#001F54] font-bold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-200"
                      >
                        View Orders
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings (non-student) */}
            {/* {isLoggedIn && !isStudent && (
              <button className="cursor-pointer">
                <IoSettingsOutline className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </button>
            )} */}

            {/* Wishlist & Cart for students / guests */}
            {(!isAuthenticated || isStudent) && (
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
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </>
            )}

            {/* Avatar */}
            {/* Avatar (click-to-open dropdown) */}
            <div ref={avatarRef} className="relative">
              <button
                onClick={() => setAvatarOpen((o) => !o)}
                className="cursor-pointer"
              >
                <img src={hug} alt="User" className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {/* ---------------- DROPDOWN ---------------- */}
              {avatarOpen && (
                <div
                  className={`fixed w-[299px] ${isSmall ? "top-[88px] right-4" : "right-4"}
                  bg-[#001F54] shadow-lg rounded-md z-[120]`}
                  style={{ boxShadow: "0 4px 4px 0 #00000040" }}
                >
                  <div className="p-4">
                    {isAuthenticated ? (
                      <>
                        {/* ───── link visible ONLY for libraries ───── */}
                        {isLibrary && (
                          <NavLink
                            to="/minidrawer/information"
                            className="flex items-center justify-between mb-4"
                            onClick={() => setAvatarOpen(false)}
                          >
                            <span className="text-white">Profile</span>
                            <img src={profileIcon} alt="" className="w-6 h-6" />
                          </NavLink>
                        )}

                        {/* Home (all roles) */}
                        <NavLink
                          to="/"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setAvatarOpen(false)}
                        >
                          <span className="text-white">Home</span>
                          <img src={homeIcon} alt="" className="w-6 h-6" />
                        </NavLink>

                        {/* Privacy & Help (all roles) */}
                        {/* <NavLink
                          to="/privacy"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setAvatarOpen(false)}
                        >
                          <span className="text-white">Privacy</span>
                          <img src={privacyIcon} alt="" className="w-6 h-6" />
                        </NavLink>
                        <NavLink
                          to="/help"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setAvatarOpen(false)}
                        >
                          <span className="text-white">Help</span>
                          <img src={helpIcon} alt="" className="w-6 h-6" />
                        </NavLink> */}

                        {/* ───── dashboard / products variations ───── */}
                        {userRole === "admin" && (
                          <NavLink
                            to="/adminedrawer/adminDashboard"
                            className="flex items-center justify-between mb-4"
                            onClick={() => setAvatarOpen(false)}
                          >
                            <span className="text-white">Dashboard</span>
                            <MdDashboard className="w-6 h-6 text-white" />
                          </NavLink>
                        )}

                        {isLibrary && (
                          <NavLink
                            to="/MiniDrawer/home"
                            className="flex items-center justify-between mb-4"
                            onClick={() => setAvatarOpen(false)}
                          >
                            <span className="text-white">Dashboard</span>
                            <MdDashboard className="w-6 h-6 text-white" />
                          </NavLink>
                        )}

                        {isStudent && (
                          <NavLink
                            to="/productshome"
                            className="flex items-center justify-between mb-4"
                            onClick={() => setAvatarOpen(false)}
                          >
                            <span className="text-white">Products</span>
                            <MdDashboard className="w-6 h-6 text-white" />
                          </NavLink>
                        )}

                        {/* Language picker (unchanged) … */}
                        {/* … */}

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-between mb-4 w-full"
                        >
                          <span className="text-white">Logout</span>
                          <img src={logoutIcon} alt="" className="w-6 h-6" />
                        </button>
                      </>
                    ) : (
                      /* not logged-in: Login / Signup options */
                      <>
                        <NavLink
                          to="/login"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setAvatarOpen(false)}
                        >
                          <span className="text-white">Login</span>
                          <img src={profileIcon} alt="" className="w-6 h-6" />
                        </NavLink>
                        <NavLink
                          to="/signup"
                          className="flex items-center justify-between mb-4"
                          onClick={() => setAvatarOpen(false)}
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
        {isSmall && (
          <div className="w-full px-4 pb-2 relative">
            <div className="flex items-center bg-white rounded-md px-2">
              <img src={searchIcon} alt="Search" className="w-5 h-5" />
              <input
                ref={searchRef}
                type="text"
                value={term}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder="Search"
                className="w-full h-[40px] bg-transparent border-none outline-none text-[#001F54] text-sm"
              />
            </div>

            {suggestions.length > 0 && (
              <ul
                ref={suggestBoxRef}
                className="absolute w-full bg-white rounded shadow-lg z-[200]"
              >
                {suggestions.map((name, i) => (
                  <li
                    key={name}
                    onMouseDown={() => commitSearch(name)}
                    className={`px-4 py-2 cursor-pointer ${
                      i === index ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Overlay when sidebar open */}
        {sideOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-[#D9D9D980] z-[90]"
            onClick={() => setSideOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          ref={sideRef}
          className={`fixed top-0 left-0 w-64 h-screen bg-[#001F54] z-[110] transform transition-transform duration-300 ${
            sideOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4" style={{ fontFamily: "Hedvig Letters Sans" }}>
            <div className="flex items-center mb-6">
              <button onClick={() => setSideOpen(false)} className="space-y-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[28px] h-[5px] bg-white rounded-md"
                  />
                ))}
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
            {/* Add sidebar links … */}
          </div>
        </div>
      </nav>
    </div>
  );
}
