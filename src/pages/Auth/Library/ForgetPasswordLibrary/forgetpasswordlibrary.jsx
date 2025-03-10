import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowRightCircle,
  Library,
  Key,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

function ForgotPasswordLibrary() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password Update
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setpasswordConfirm] = useState("");
  const [errors, setErrors] = useState({}); // To store validation errors
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [showpasswordConfirm, setShowpasswordConfirm] = useState(false); // Toggle confirm password visibility
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const togglepasswordConfirmVisibility = () => {
    setShowpasswordConfirm(!showpasswordConfirm);
  };

  // Validate OTP
  const validateOtp = () => {
    const otpRegex = /^\d{6}$/; // Exactly 6 digits
    if (!otpRegex.test(otp)) {
      setErrors({
        otp: "OTP must be exactly 6 digits and contain only numbers.",
      });
      return false;
    }
    setErrors({}); // Clear errors if validation passes
    return true;
  };

  // Validate Password
  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrors({
        password:
          "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one number.",
      });
      return false;
    }
    if (password !== passwordConfirm) {
      setErrors({ passwordConfirm: "Passwords do not match." });
      return false;
    }
    setErrors({}); // Clear errors if validation passes
    return true;
  };

  // Handle "Forgot Password" - Send OTP to email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}api/v1/auth/library/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send reset link");
      }

      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setStep(2); // Move to OTP verification step
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ email: error.message });
    }
  };

  // Handle OTP Verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return; // Validate OTP before proceeding

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}api/v1/auth/library/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Include credentials to ensure the session cookie is stored
          credentials: "include",
          body: JSON.stringify({ email, otp }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify OTP");
      }

      // The backend returns the verified user data,
      // but the session is stored in a cookie automatically.
      const responseData = await response.json();
      console.log("OTP Verification Response:", responseData);

      // If you need to persist any user info, you can store it locally.
      // For example:
      // localStorage.setItem("user", JSON.stringify(responseData.data.user));

      setIsSubmitting(false);
      setStep(3); // Move to password update step
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ otp: error.message });
    }
  };

  // Handle Password Update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return; // Validate password before proceeding

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}api/v1/auth/library/update-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          // Credentials included to send the session cookie for authentication
          credentials: "include",
          body: JSON.stringify({ password, passwordConfirm }),
        }
      );
      console.log("Update Password Response:", response);

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/loginlibrary"); // Redirect to login page after success
      }, 3000);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ password: error.message });
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}api/v1/auth/library/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resend OTP");
      }

      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ otp: error.message });
    }
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

  return (
    <div className="min-h-screen bg-[#001F54] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        <div className="flex flex-col lg:flex-row">
          {/* Form Section */}
          <div className="lg:w-3/5 bg[#000C21] p-8 md:p-16 relative">
            {step === 1 && (
              <>
                <div className="mb-12">
                  <h1 className="text-3xl font-bold text-white">
                    Forgot Your Password?
                  </h1>
                  <p className="text-gray-400 mt-2">
                    No worries, we&apos;ll send you a reset link!
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-8">
                  <div className="space-y-6">
                    {/* Email Field */}
                    <div className="relative">
                      <label className="text-white text-sm font-medium mb-2 block">
                        Email Address
                      </label>
                      <div className="relative group">
                        <input
                          type="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className={`w-full h-14 bg-[#001F54] hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
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
                        <span>Send Reset Link</span>
                        <ArrowRightCircle size={18} />
                      </>
                    )}
                  </motion.button>

                  {/* Back to Login */}
                  <p className="text-center text-gray-400">
                    Remembered it?{" "}
                    <NavLink
                      to="/loginlibrary"
                      className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                    >
                      Back to Login
                    </NavLink>
                  </p>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-12">
                  <h1 className="text-3xl font-bold text-white">Verify OTP</h1>
                  <p className="text-gray-400 mt-2">
                    Please enter the 6-digit OTP sent to your email. The OTP is
                    valid for 10 minutes.
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-8">
                  <div className="space-y-6">
                    {/* OTP Field */}
                    <div className="relative">
                      <label className="text-white text-sm font-medium mb-2 block">
                        6-Digit OTP
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          name="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full h-14 rounded-xl bg-white/10 text-white placeholder:text-gray-400 text-sm pl-12 pr-4 border border-white/20 focus:border-indigo-400 focus:outline-none transition-all duration-200 group-hover:border-indigo-400/50"
                          placeholder="123456"
                          required
                          maxLength={6}
                        />
                        <Key
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200"
                          size={20}
                        />
                      </div>
                      {errors.otp && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.otp}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className={`w-full h-14 bg-[#001F54] hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
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
                        <span>Verify OTP</span>
                        <ArrowRightCircle size={18} />
                      </>
                    )}
                  </motion.button>

                  {/* Resend OTP Button */}
                  <p className="text-center text-gray-400">
                    Didn&apos;t receive the OTP?{" "}
                    <button
                      type="button"
                      className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 cursor-pointer"
                      onClick={handleResendOtp}
                      disabled={isSubmitting}
                    >
                      Resend OTP
                    </button>
                  </p>
                </form>
              </>
            )}

            {step === 3 && (
              <>
                <div className="mb-12">
                  <h1 className="text-3xl font-bold text-white">
                    Update Password
                  </h1>
                  <p className="text-gray-400 mt-2">
                    Please enter your new password.
                  </p>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-8">
                  <div className="space-y-6">
                    {/* Password Field */}
                    <div className="relative">
                      <label className="text-white text-sm font-medium mb-2 block">
                        New Password
                      </label>
                      <div className="relative group">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-14 rounded-xl bg-white/10 text-white placeholder:text-gray-400 text-sm pl-12 pr-12 border border-white/20 focus:border-indigo-400 focus:outline-none transition-all duration-200 group-hover:border-indigo-400/50"
                          placeholder="New Password"
                          required
                        />
                        <Key
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200"
                          size={20}
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                      <label className="text-white text-sm font-medium mb-2 block">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <input
                          type={showpasswordConfirm ? "text" : "password"}
                          name="passwordConfirm"
                          value={passwordConfirm}
                          onChange={(e) => setpasswordConfirm(e.target.value)}
                          className="w-full h-14 rounded-xl bg-white/10 text-white placeholder:text-gray-400 text-sm pl-12 pr-12 border border-white/20 focus:border-indigo-400 focus:outline-none transition-all duration-200 group-hover:border-indigo-400/50"
                          placeholder="Confirm Password"
                          required
                        />
                        <Key
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200"
                          size={20}
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                          onClick={togglepasswordConfirmVisibility}
                        >
                          {showpasswordConfirm ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {errors.passwordConfirm && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.passwordConfirm}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className={`w-full h-14 bg-[#001F54] hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
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
                        <span>Update Password</span>
                        <CheckCircle size={18} />
                      </>
                    )}
                  </motion.button>
                </form>
              </>
            )}

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
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Library className="w-full h-full" />
                    </motion.div>
                    <motion.h3
                      className="text-2xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {step === 1
                        ? "Reset Link Sent!"
                        : step === 2
                        ? "OTP Resent!"
                        : "Password Updated!"}
                    </motion.h3>
                    <motion.p
                      className="text-gray-400 mb-8"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      {step === 1
                        ? `We've emailed a password reset link to ${email}`
                        : step === 2
                        ? "A new OTP has been sent to your email."
                        : "Your password has been updated successfully."}
                    </motion.p>
                    <motion.button
                      className="px-8 py-3 bg-[#001F54] hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      onClick={() => {
                        setShowSuccess(false);
                        if (step === 3) {
                          navigate("/loginlibrary"); // Redirect to login only after password update
                        }
                      }}
                    >
                      OK
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
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80"
              alt="Reset password library background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordLibrary;
