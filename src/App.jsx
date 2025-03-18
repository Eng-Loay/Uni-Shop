import "./App.css";
import Home from "./pages/Home/Home";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./pages/Auth/Student/Signup/Signup";
import Login from "./pages/Auth/Student/Login/Login";
import SignupLibrary from "./pages/Auth/Library/SingupLibrary/signuplibrary";
import LibraryLogin from "./pages/Auth/Library/LoginLibrary/loginlibrary";
import ForgotPassword from "./pages/Auth/Student/ForgetPassword/forgetpassword";
import ForgotPasswordLibrary from "./pages/Auth/Library/ForgetPasswordLibrary/forgetpasswordlibrary";
import Layout from "./components/Layout/Layout";
import MiniDrawer from "./components/Drawer/Drawer";
import HomeDrawer from "./components/Drawer/HomeDrawer";

let x = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      // { path: " ", element: <Home /> },
      { path: "signuplibrary", element: <SignupLibrary /> },
      { path: "loginlibrary", element: <LibraryLogin /> },
      { path: "forgetpasswordlibrary", element: <ForgotPasswordLibrary /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "forgetpassword", element: <ForgotPassword /> },
      { path: "MiniDrawer", element: <MiniDrawer /> },
      { path: "HomeDrawer", element: <HomeDrawer /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={x}></RouterProvider>
    </>
  );
}

export default App;

// import "./App.css";
// import Home from "./pages/Home/Home";
// import Navbar from "./components/Header/Navbar";
// import Footer from "./components/Footer/Footer";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Signup from "./pages/Auth/Student/Signup/Signup";
// import Login from "./pages/Auth/Student/Login/Login";
// import SignupLibrary from "./pages/Auth/Library/SingupLibrary/signuplibrary";
// import LibraryLogin from "./pages/Auth/Library/LoginLibrary/loginlibrary";
// import ForgotPassword from "./pages/Auth/Student/ForgetPassword/forgetpassword";
// import ForgotPasswordLibrary from "./pages/Auth/Library/ForgetPasswordLibrary/forgetpasswordlibrary";
// import MiniDrawer from "./components/Drawer/Drawer";
// import HomeDrawer from "./components/Drawer/HomeDrawer";
// import DrawerChecker from "./components/DrawerChecker/DrawerChecker";

// function App() {
//   return (
//     <>
//       <Router>

//         <Navbar />

//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signuplibrary" element={<SignupLibrary />} />
//           <Route path="/loginlibrary" element={<LibraryLogin />} />
//           <Route path="/forgetpassword" element={<ForgotPassword />} />
//           <Route path="/forgetpasswordlibrary" element={<ForgotPasswordLibrary />} />
//           <Route path="/MiniDrawer" element={<MiniDrawer/>}/>
//           <Route path="/HomeDrawer" element={<HomeDrawer/>}/>
//         </Routes>
//   <DrawerChecker />
//         <Footer />
//       </Router>
//       {/* <Home /> */}
//     </>
//   );
// }

// export default App;
