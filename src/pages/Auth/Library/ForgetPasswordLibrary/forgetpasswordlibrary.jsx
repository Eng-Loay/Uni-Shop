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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({}); // To store validation errors
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password visibility
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return false;
    }
    setErrors({}); // Clear errors if validation passes
    return true;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      setStep(2); // Move to OTP verification step
      setShowSuccess(false);
    }, 3000);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return; // Validate OTP before proceeding

    setIsSubmitting(true);

    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setStep(3); // Move to password update step
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return; // Validate password before proceeding

    setIsSubmitting(true);

    // Simulate password update
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/loginlibrary"); // Redirect to login page after successful password update
    }, 3000);
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
          <div className="lg:w-3/5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-16 relative">
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
                    className={`w-full h-14 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
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
                    Please enter the 6-digit OTP sent to your email.
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
                    className={`w-full h-14 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
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
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
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
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className={`w-full h-14 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
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
                        ? "OTP Verified!"
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
                        ? "You can now update your password."
                        : "Your password has been updated successfully."}
                    </motion.p>
                    <motion.button
                      className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      onClick={() => {
                        if (step === 1) {
                          setStep(2);
                        } else if (step === 2) {
                          setStep(3);
                        } else {
                          navigate("/loginlibrary");
                        }
                        setShowSuccess(false);
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
