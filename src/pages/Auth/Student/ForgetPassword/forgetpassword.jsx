import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Mail, ArrowRightCircle, BookOpen } from "lucide-react";

function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccess(true);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        <div className="flex flex-col lg:flex-row">
          {/* Form Section */}
          <div className="lg:w-3/5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-16 relative">
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-white">
                Forgot Your Password?
              </h1>
              <p className="text-gray-400 mt-2">
                No worries, we&apos;ll send you a reset link!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
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
                      placeholder="john.doe@example.com"
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
                  to="/login"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                >
                  Back to Login
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
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <BookOpen className="w-full h-full" />
                    </motion.div>
                    <motion.h3
                      className="text-2xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Reset Link Sent!
                    </motion.h3>
                    <motion.p
                      className="text-gray-400 mb-8"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      We&apos;ve emailed a password reset link to {email}
                    </motion.p>
                    <motion.button
                      className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      onClick={() => window.location.reload()}
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

export default ForgotPassword;
