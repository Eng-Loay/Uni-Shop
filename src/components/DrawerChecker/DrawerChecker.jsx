import { useLocation } from "react-router-dom";
import HomeDrawer from "../Drawer/HomeDrawer";

const DrawerChecker = () => {
  const { pathname } = useLocation();
  console.log("Current Path:", pathname);
  // Only render HomeDrawer for the root path
  if (pathname === "/") return <HomeDrawer />;

  return null; // No drawer for other routes
};

export default DrawerChecker;
