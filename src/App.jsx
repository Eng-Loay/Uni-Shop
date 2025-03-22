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
import ItemsLibrary from "./pages/Auth/Library/ItemsLibrary/ItemsLibrary";
import AddItem from "./pages/Auth/Library/AddItem/AddItem";

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
      { path: "home", element: <Home /> },
      {path:"items",element:<ItemsLibrary/>},
      // children: [{path:"/addItem",element:<AddItem/>}]},
      { path: "addItem", element: <AddItem /> }
     
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
