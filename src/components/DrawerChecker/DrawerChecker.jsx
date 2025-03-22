import { useLocation } from "react-router-dom";
import HomeDrawer from "../Drawer/HomeDrawer";
import MiniDrawer from "../Drawer/Drawer";


const DrawerChecker = () => {
  const { pathname } = useLocation();
  console.log("Current Path:",pathname);
  // Only render HomeDrawer for the root path
  if (pathname === "/") return <HomeDrawer />;
 if (pathname.startsWith("/addItem"))return<MiniDrawer/>;
  
  return null; // No drawer for other routes
};

export default DrawerChecker;
