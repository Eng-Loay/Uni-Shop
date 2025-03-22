// import Navbar from "../Header/Navbar";

// import { Outlet } from "react-router-dom";
// import Footer from "../Footer/Footer";
// import DrawerChecker from "../DrawerChecker/DrawerChecker";
// // import MiniDrawer from "../Drawer/Drawer";

// export default function Layout() {
//   return (
//     <>
//       <div className="flex  min-h-screen  mx-auto  text-gray-950">

//       <DrawerChecker/>
//       <div className= "flex flex-col">
//       <Navbar />
//       <Outlet/>
//       <Footer />
//       </div>

//       </div>

//     </>
//   );
// }

import Navbar from "../Header/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer/Footer";
import DrawerChecker from "../DrawerChecker/DrawerChecker";

export default function Layout() {
  return (
    <div className="flex min-h-screen mx-auto text-gray-950">
      {/* Use DrawerChecker to determine which drawer to render */}
      <DrawerChecker />
      
      <div className="flex flex-col flex-1">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}