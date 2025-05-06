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
import ItemsLibrary from "./pages/Library/Items/ItemsLibrary/ItemsLibrary";
import AddItem from "./pages/Library/Items/AddItem/AddItem";
import HomePage from "./pages/Library/Dashboard/HomePage";
import { ItemsProvider } from "./pages/Library/Items/ItemsContext/ItemsContext";
import EditItem from "./pages/Library/Items/EditItem/EditItem";
import Information from "./pages/Library/Information/Information";
import OrderTable from "./pages/Library/Order/order";
import Stores from "./components/adminComponents/stores/Stores.jsx";
import Requests from "./components/adminComponents/requests/Requests.jsx";
import MiniDrawer2 from "./components/Drawer/adminDrawer/AdminDrawer.jsx";
import AdminDashboard from "./components/adminComponents/adminDashboard/AdminDashboard.jsx";
import Chatbot from "./pages/ChatBot/chatbot.jsx";

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
      { path: "/chat", element: <Chatbot /> },
      { path: "forgetpassword", element: <ForgotPassword /> },
      { path: "MiniDrawer", element: <MiniDrawer /> },
      { path: "HomeDrawer", element: <HomeDrawer /> },
      { path: "home", element: <Home /> },
      { path: "items", element: <ItemsLibrary /> },
      // children: [{path:"/addItem",element:<AddItem/>}]},
      { path: "MiniDrawer/add-items", element: <AddItem /> },
    ],
  },
  {
    path: "/minidrawer",
    element: <Layout />,
    children: [
      {
        element: <MiniDrawer />,
        children: [
          { index: true, element: <Home /> },
          { path: "home", element: <HomePage /> },
          { path: "items", element: <ItemsLibrary /> },
          { path: "items/additems", element: <AddItem /> },
          { path: "items/edititems/:id", element: <EditItem /> },
          // Add other nested routes as needed
          {
            path: "orders",
            element: <OrderTable />,
          },
          { path: "information", element: <Information /> },
          { path: "logout", element: <div>Logout Page</div> },
        ],
      },
    ],
  },
  {
    path: "/adminedrawer",
    element: <Layout />,
    children: [
      {
        element: <MiniDrawer2 />,
        children: [
          { index: true, element: <div>Welcome to MiniDrawer2</div> }, // optional default
          { path: "adminDashboard", element: <AdminDashboard /> },
          { path: "stores", element: <Stores /> },
          { path: "request", element: <Requests /> },
          // other nested routes can go here
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ItemsProvider>
      <RouterProvider router={x} />
    </ItemsProvider>
  );
}

export default App;
