import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import MiniDrawer from "../Drawer/Drawer";
import HomeDrawer from "../Drawer/HomeDrawer";

const DrawerChecker = () => {
  const location = useLocation();
  const { pathname } = location;

  const [showMiniDrawer, setShowMiniDrawer] = useState(false);

  useEffect(() => {
    setShowMiniDrawer(pathname === "/MiniDrawer");
  }, [pathname]);
  // Runs when the pathname changes

  let content;

  if (showMiniDrawer) {
    content = <MiniDrawer />;
  } else if (pathname === "/") {
    content = <HomeDrawer />;
  } else {
    content = null; // No drawer for other routes
  }

  return <>{content}</>;
};

export default DrawerChecker;
