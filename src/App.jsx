/* eslint-disable react/prop-types */
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import Signup from "./pages/Auth/Student/Signup/Signup";
import Login from "./pages/Auth/Student/Login/Login";
import SignupLibrary from "./pages/Auth/Library/SingupLibrary/signuplibrary";
import LibraryLogin from "./pages/Auth/Library/LoginLibrary/loginlibrary";
import ForgotPassword from "./pages/Auth/Student/ForgetPassword/forgetpassword";
import ForgotPasswordLibrary from "./pages/Auth/Library/ForgetPasswordLibrary/forgetpasswordlibrary";

import Layout from "./components/Layout/Layout";
import MiniDrawer from "./components/Drawer/Drawer";
import HomeDrawer from "./components/Drawer/HomeDrawer";

import ItemsLibrary from "./pages/Library/Items/ItemsLibrary/ItemsLibrary";
import AddItem from "./pages/Library/Items/AddItem/AddItem";
import HomePage from "./pages/Library/Dashboard/HomePage";
import { ItemsProvider } from "./pages/Library/Items/ItemsContext/ItemsContext";
import EditItem from "./pages/Library/Items/EditItem/EditItem";
import Information from "./pages/Library/Information/Information";
import OrderTable from "./pages/Library/Order/order";

// Authentication guard using cookie-based session
function RequireAuth({ children }) {
  // Adjust 'sessionId' to match your actual session cookie name
  const hasSession = document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith("sessionId="));
  if (!hasSession) {
    // No session cookie found, redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "signuplibrary", element: <SignupLibrary /> },
      { path: "loginlibrary", element: <LibraryLogin /> },
      { path: "forgetpasswordlibrary", element: <ForgotPasswordLibrary /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "forgetpassword", element: <ForgotPassword /> },
      { path: "homedrawer", element: <HomeDrawer /> },
      { path: "items", element: <ItemsLibrary /> },
      { path: "add-items", element: <AddItem /> },
    ],
  },
  {
    path: "/minidrawer",
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      {
        element: <MiniDrawer />,
        children: [
          { index: true, element: <Home /> },
          { path: "home", element: <HomePage /> },
          { path: "items", element: <ItemsLibrary /> },
          { path: "items/additems", element: <AddItem /> },
          { path: "items/edititems/:id", element: <EditItem /> },
          { path: "orders", element: <OrderTable /> },
          { path: "information", element: <Information /> },
          {
            path: "logout",
            element: <Navigate to="/login" replace />, // On logout, clear session cookie on server side
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ItemsProvider>
      <RouterProvider router={router} />
    </ItemsProvider>
  );
}

export default App;
