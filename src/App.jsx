/* eslint-disable no-unused-vars */
import "./App.css";
import Home from "./pages/Home/Home";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Auth/Student/Signup/Signup";
import Login from "./pages/Auth/Student/Login/Login";
import SignupLibrary from "./pages/Auth/Library/SingupLibrary/signuplibrary";
import LibraryLogin from "./pages/Auth/Library/LoginLibrary/loginlibrary";
import ForgotPassword from "./pages/Auth/Student/ForgetPassword/forgetpassword";
import ForgotPasswordLibrary from "./pages/Auth/Library/ForgetPasswordLibrary/forgetpasswordlibrary";
import Layout from "./components/LayOut/Layout.jsx";
import MiniDrawer from "./components/Drawer/Drawer";
import HomeDrawer from "./components/Drawer/HomeDrawer";
import ItemsLibrary from "./pages/Library/Items/ItemsLibrary/ItemsLibrary";
import AddItem from "./pages/Library/Items/AddItem/AddItem";
import HomePage from "./pages/Library/DashBoard/HomePage";
import { ItemsProvider } from "./pages/Library/Items/ItemsContext/ItemsContext";
import EditItem from "./pages/Library/Items/EditItem/EditItem";
import Information from "./pages/Library/Information/Information";
import OrderTable from "./pages/Library/Order/order";
import ItemsDetails from "./pages/Library/ItemsDetails/ItemsDetails";
import ProductsHome from "./pages/Student/ProductsHome/ProductsHome";
import Cart from "./pages/Student/Cart/Cart";
import { CartProvider } from "./pages/Student/CartContext/CartContext";
import { WishlistProvider } from "./pages/Student/WishListContext/WishListContext";
import Wishlist from "./pages/Student/WishList/WishList";
import ProductDetails from "./pages/Student/ProductDetails/ProductDetails";
import Stores from "./components/adminComponents/stores/Stores.jsx";
import Requests from "./components/adminComponents/requests/Requests.jsx";
import MiniDrawer2 from "./components/Drawer/adminDrawer/AdminDrawer.jsx";
import AdminDashboard from "./components/adminComponents/adminDashboard/AdminDashboard.jsx";
import Chatbot from "./pages/ChatBot/chatbot.jsx";
import Shipping from "./pages/Student/Shipping/shipping.jsx";
import OrderSuccess from "./pages/Student/OrderSuccess/ordersuccess.jsx";
import PredictForm from "./components/adminComponents/PredictForm/predictform.jsx";
import LevelProducts from "./pages/Student/LevelProducts/levelproducts.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import TestAuthGuard from "./components/TestAuthGuard/TestAuthGuard.jsx";
import {
  AuthGuard,
  NoAuthGuard,
  RoleBasedGuard,
} from "./components/AuthGuard/AuthGuard";

let x = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // Public routes accessible to everyone
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "auth-status", element: <TestAuthGuard /> },

      // Auth routes (accessible only when NOT logged in)
      {
        path: "signuplibrary",
        element: (
          <NoAuthGuard>
            <SignupLibrary />
          </NoAuthGuard>
        ),
      },
      {
        path: "loginlibrary",
        element: (
          <NoAuthGuard>
            <LibraryLogin />
          </NoAuthGuard>
        ),
      },
      {
        path: "forgetpasswordlibrary",
        element: (
          <NoAuthGuard>
            <ForgotPasswordLibrary />
          </NoAuthGuard>
        ),
      },
      {
        path: "signup",
        element: (
          <NoAuthGuard>
            <Signup />
          </NoAuthGuard>
        ),
      },
      {
        path: "login",
        element: (
          <NoAuthGuard>
            <Login />
          </NoAuthGuard>
        ),
      },
      {
        path: "forgetpassword",
        element: (
          <NoAuthGuard>
            <ForgotPassword />
          </NoAuthGuard>
        ),
      },

      // Student-specific routes
      {
        path: "productshome",
        element: (
          <AuthGuard allowedRoles={["student"]}>
            <ProductsHome />
          </AuthGuard>
        ),
      },
      {
        path: "cart",
        element: (
          <AuthGuard allowedRoles={["student"]}>
            <Cart />
          </AuthGuard>
        ),
      },
      {
        path: "shipping",
        element: (
          <AuthGuard allowedRoles={["student"]}>
            <Shipping />
          </AuthGuard>
        ),
      },
      {
        path: "order-success",
        element: (
          <AuthGuard allowedRoles={["student"]}>
            <OrderSuccess />
          </AuthGuard>
        ),
      },
      {
        path: "wishlist",
        element: (
          <AuthGuard allowedRoles={["student"]}>
            <Wishlist />
          </AuthGuard>
        ),
      },
      {
        path: "productdetails/:id",
        element: (
          <AuthGuard allowedRoles={["student"]}>
            <ProductDetails />
          </AuthGuard>
        ),
      },
      {
        path: "faculty/:facultyName/level/:levelNumber",
        element: (
          <AuthGuard allowedRoles={["student"]}>
            <LevelProducts />
          </AuthGuard>
        ),
      },

      // Common authenticated routes
      {
        path: "/chat",
        element: (
          <AuthGuard allowedRoles={["student", "library", "admin"]}>
            <Chatbot />
          </AuthGuard>
        ),
      },

      // Legacy routes with student access

      {
        path: "HomeDrawer",
        element: (
          <AuthGuard allowedRoles={["student"]}>
            <HomeDrawer />
          </AuthGuard>
        ),
      },
      {
        path: "items",
        element: (
          <AuthGuard allowedRoles={["student", "library"]}>
            <ItemsLibrary />
          </AuthGuard>
        ),
      },
      {
        path: "MiniDrawer/add-items",
        element: (
          <AuthGuard allowedRoles={["student", "library"]}>
            <AddItem />
          </AuthGuard>
        ),
      },
    ],
  },

  // Library routes
  {
    path: "/minidrawer",
    element: (
      <RoleBasedGuard requiredRole="library" redirectPath="/">
        <Layout />
      </RoleBasedGuard>
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

  // Admin routes
  {
    path: "/adminedrawer",
    element: (
      <RoleBasedGuard requiredRole="admin" redirectPath="/">
        <Layout />
      </RoleBasedGuard>
    ),
    children: [
      {
        element: <MiniDrawer2 />,
        children: [
          { index: true, element: <div>Welcome to MiniDrawer2</div> },
          { path: "adminDashboard", element: <AdminDashboard /> },
          { path: "stores", element: <Stores /> },
          { path: "request", element: <Requests /> },
          { path: "predict", element: <PredictForm /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ItemsProvider>
      <CartProvider>
        <WishlistProvider>
          <AuthProvider>
            <RouterProvider router={x} />
          </AuthProvider>
        </WishlistProvider>
      </CartProvider>
    </ItemsProvider>
  );
}

export default App;
