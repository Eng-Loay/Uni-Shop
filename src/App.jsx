import "./App.css";
import Home from "./pages/Home/Home";
import Navbar from "./components/Header/Navbar";
import Fotter from "./components/Fotter/fotter";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Auth/Student/Signup/Signup";
import Login from "./pages/Auth/Student/Login/Login";
import SignupLibrary from "./pages/Auth/Library/SingupLibrary/signuplibrary";
import LibraryLogin from "./pages/Auth/Library/LoginLibrary/loginlibrary";
import ForgotPassword from "./pages/Auth/Student/ForgetPassword/forgetpassword";
import ForgotPasswordLibrary from "./pages/Auth/Library/ForgetPasswordLibrary/forgetpasswordlibrary";
import DashBoard from "./pages/Library/DashBoard/dashboard";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signuplibrary" element={<SignupLibrary />} />
          <Route path="/loginlibrary" element={<LibraryLogin />} />
          <Route path="/forgetpassword" element={<ForgotPassword />} />
          <Route path="/forgetpasswordlibrary" element={<ForgotPasswordLibrary />} />
          <Route path="/dashboardlibrary" element={<DashBoard/>} />
        </Routes>
        <Fotter />
      </Router>
      {/* <Home /> */}
    </>
  );
}

export default App;
