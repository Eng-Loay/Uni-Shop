import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  User,
  Image,
} from "lucide-react";

function SignupLibrary() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    location: "",
    license: { secure_url: "", public_id: "" }, // Updated license format
    logo: null, // Added logo field
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength += 25;
      if (value.match(/[A-Z]/)) strength += 25;
      if (value.match(/[0-9]/)) strength += 25;
      if (value.match(/[^A-Za-z0-9]/)) strength += 25;
      setPasswordStrength(strength);

      // Check if passwords match
      if (formData.passwordConfirm && value !== formData.passwordConfirm) {
        setPasswordMatchError(true);
      } else {
        setPasswordMatchError(false);
      }
    }

    if (name === "passwordConfirm") {
      // Check if passwords match
      if (formData.password && value !== formData.password) {
        setPasswordMatchError(true);
      } else {
        setPasswordMatchError(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if passwords match before submitting
    if (formData.password !== formData.passwordConfirm) {
      setPasswordMatchError(true);
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
      setErrorMessage(""); // Clear any previous error messages

      try {
        // Create FormData object
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("username", formData.username);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("passwordConfirm", formData.passwordConfirm);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("license", formData.license); // Append license file
        formDataToSend.append("logo", formData.logo); // Append logo file

        // Make API call to the signup endpoint
        const response = await axios.post(
          `${API_BASE_URL}api/v1/auth/library/signup`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Handle successful response
        if (response.status === 201) {
          setShowSuccess(true);
        }
      } catch (error) {
        // Handle API errors
        if (error.response) {
          setErrorMessage(
            error.response.data.message ||
              "An error occurred during registration."
          );
        } else {
          setErrorMessage("Network error. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const successVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              Welcome to Library Registration 📚
            </h2>

            <div className="relative">
              <label className="text-white text-sm font-medium mb-2 block">
                Library Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="name" // Updated from libraryName to name
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-14 rounded-xl bg-white/10 text-white placeholder:text-gray-400 text-sm pl-12 pr-4 border border-white/20 focus:border-indigo-400 focus:outline-none transition-all duration-200 group-hover:border-indigo-400/50"
                  placeholder="Enter library name"
                  required
                />
                <Building2
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200"
                  size={20}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-white text-sm font-medium mb-2 block">
                Username
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full h-14 rounded-xl bg-white/10 text-white placeholder:text-gray-400 text-sm pl-12 pr-4 border border-white/20 focus:border-indigo-400 focus:outline-none transition-all duration-200 group-hover:border-indigo-400/50"
                  placeholder="Enter username"
                  required
                />
                <User
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200"
                  size={20}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-white text-sm font-medium mb-2 block">
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-14 rounded-xl bg-white/10 text-white placeholder:text-gray-400 text-sm pl-12 pr-4 border border-white/20 focus:border-indigo-400 focus:outline-none transition-all duration-200 group-hover:border-indigo-400/50"
                  placeholder="library@example.com"
                  required
                />
                <Mail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200"
                  size={20}
                />
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              Secure your library account 🔒
            </h2>

            <div className="relative">
              <label className="text-white text-sm font-medium mb-2 block">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full h-14 rounded-xl bg-white/10 text-white placeholder:text-gray-400 text-sm pl-12 pr-12 border border-white/20 focus:border-indigo-400 focus:outline-none transition-all duration-200 group-hover:border-indigo-400/50"
                  placeholder="Create a secure password"
                  required
                />
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200"
                  size={20}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 focus:outline-none transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="mt-4">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Password strength:{" "}
                  <span
                    className={
                      passwordStrength < 50
                        ? "text-red-400"
                        : passwordStrength < 75
                          ? "text-yellow-400"
                          : "text-green-400"
                    }
                  >
                    {passwordStrength < 50
                      ? "Weak"
                      : passwordStrength < 75
                        ? "Medium"
                        : "Strong"}
                  </span>
                </p>
              </div>
            </div>

            <div className="relative">
              <label className="text-white text-sm font-medium mb-2 block">
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  className="w-full h-14 rounded-xl bg-white/10 text-white placeholder:text-gray-400 text-sm pl-12 pr-12 border border-white/20 focus:border-indigo-400 focus:outline-none transition-all duration-200 group-hover:border-indigo-400/50"
                  placeholder="Confirm your password"
                  required
                />
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200"
                  size={20}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 focus:outline-none transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {passwordMatchError && (
                <p className="text-sm text-red-400 mt-2">
                  Passwords do not match.
                </p>
              )}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              Final Details 📍
            </h2>

            {/* License Upload */}
            <div className="relative">
              <label className="text-white text-sm font-medium mb-2 block">
                Library License (PDF/Image)
              </label>
              <div className="relative group">
                <input
                  type="file"
                  name="license"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData((prev) => ({
                      ...prev,
                      license: file,
                    }));
                  }}
                  className="w-full h-14  p-4 rounded-xl bg-white/10 text-white placeholder:text-gray-400 text-sm pl-12 pr-4 border border-white/20 focus:border-indigo-400 focus:outline-none transition-all duration-200 group-hover:border-indigo-400/50"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
                <FileCheck
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200"
                  size={20}
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div className="relative">
              <label className="text-white text-sm font-medium mb-2 block ">
                Library Logo (Image)
              </label>
              <div className="relative group">
                <input
                  type="file"
                  name="logo"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData((prev) => ({
                      ...prev,
                      logo: file,
                    }));
                  }}
                  className="w-full h-14 p-4 rounded-xl bg-white/10 text-white placeholder:text-gray-400 text-sm pl-12 pr-4 border border-white/20 focus:border-indigo-400 focus:outline-none transition-all duration-200 group-hover:border-indigo-400/50"
                  accept=".jpg,.jpeg,.png"
                  required
                />
                <Image
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200"
                  size={20}
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="relative">
              <label className="text-white text-sm font-medium mb-2 block">
                Location
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full h-14 rounded-xl bg-white/10 text-white placeholder:text-gray-400 text-sm pl-12 pr-4 border border-white/20 focus:border-indigo-400 focus:outline-none transition-all duration-200 group-hover:border-indigo-400/50"
                  placeholder="Enter library address"
                  required
                />
                <MapPin
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200"
                  size={20}
                />
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#001F54] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        <div className="flex flex-col lg:flex-row">
          {/* Form Section */}
          <div className="lg:w-3/5 bg[#000C21] p-8 md:p-16 relative">
            <div className="mb-12">
              <div className="flex items-center space-x-4 mb-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep >= step
                          ? "bg-indigo-500 text-white"
                          : "bg-white/10 text-gray-400"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {currentStep > step ? <CheckCircle2 size={20} /> : step}
                    </motion.div>
                    {step < 3 && (
                      <div
                        className={`w-12 h-0.5 ${
                          currentStep > step ? "bg-indigo-500" : "bg-white/10"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="relative">
              <AnimatePresence mode="wait" initial={false}>
                {renderStep()}
              </AnimatePresence>
              {errorMessage && (
                <p className="text-sm text-red-400 mt-4 text-center">
                  {errorMessage}
                </p>
              )}
              <div className="flex space-x-4 mt-12">
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 h-14 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                  </motion.button>
                )}
                <motion.button
                  type="submit"
                  className={`flex-1 h-14 bg-[#001F54] hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {currentStep === 3 ? "Registration" : "Continue"}
                      </span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </div>

              <p className="text-center text-gray-400 mt-5">
                Already registered?{" "}
                <NavLink
                  to="/loginlibrary"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                >
                  Login
                </NavLink>
              </p>
            </form>

            {/* Success Overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={successVariants}
                  className="absolute inset-0 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm z-50"
                >
                  <div className="text-center">
                    <motion.div
                      className="w-24 h-24 mx-auto mb-6 text-indigo-500"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.2,
                      }}
                    >
                      <CheckCircle2 className="w-full h-full" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.4,
                      }}
                      className="bg-indigo-500/20 rounded-full p-2 mb-8"
                    >
                      <motion.div
                        className="w-20 h-20 mx-auto text-indigo-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <BookOpen className="w-full h-full" />
                      </motion.div>
                    </motion.div>
                    <motion.h3
                      className="text-2xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      Registration Complete!
                    </motion.h3>
                    <motion.p
                      className="text-gray-400 mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      Your library has been successfully registered.
                    </motion.p>
                    <motion.p
                      className="text-gray-400 mb-8"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      Please wait for admin approval before logging in.
                    </motion.p>
                    <motion.button
                      className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 }}
                      onClick={() => (window.location.href = "/loginlibrary")} // Redirect to login page
                    >
                      Login
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Image Section */}
          <div className="hidden lg:block lg:w-2/5 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm" />
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Library interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupLibrary;
