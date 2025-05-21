// src/components/Layout/Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Header/Navbar";
import Footer from "../Footer/Footer";
import DrawerChecker from "../DrawerChecker/DrawerChecker";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex mx-auto text-gray-950">
      <DrawerChecker />
      <div className="flex flex-col flex-1">
        <Navbar />
        <Outlet />
        {location.pathname === "/" && <Footer />}
        {/* This renders your toast “View Requests” button */}
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </div>
  );
}
