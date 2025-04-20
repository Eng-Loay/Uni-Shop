import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Header/Navbar";
import Footer from "../Footer/Footer";
import DrawerChecker from "../DrawerChecker/DrawerChecker";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex mx-auto text-gray-950 ">
      <DrawerChecker />

      <div className="flex flex-col flex-1">
        <Navbar />
        <Outlet />
        {location.pathname === "/" && <Footer />}
      </div>
    </div>
  );
}
