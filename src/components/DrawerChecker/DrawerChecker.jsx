import { useLocation } from "react-router-dom";
import MiniDrawer from "../Drawer/Drawer";
import HomeDrawer from "../Drawer/HomeDrawer";

const DrawerChecker = () => {
  const { pathname } = useLocation();

  if (pathname === "/MiniDrawer") return <MiniDrawer />;
  if (pathname === "/") return <HomeDrawer />;
  
  return null; // No drawer for other routes
};

export default DrawerChecker;
