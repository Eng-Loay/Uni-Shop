/* eslint-disable no-unused-vars */
// src/pages/Auth/Signup.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Calendar,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";

/* ─────────── Variants ─────────── */
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 500 : -500,
    opacity: 0,
  }),
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.8 },
};

/* ═══════════════════════════════════ */

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    faculty: "",
    birthdate: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  /* ─────────── Handlers ─────────── */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    if (name === "password") {
      let s = 0;
      if (value.length >= 8) s += 25;
      if (/[A-Z]/.test(value)) s += 25;
      if (/[0-9]/.test(value)) s += 25;
      if (/[^A-Za-z0-9]/.test(value)) s += 25;
      setPasswordStrength(s);
    }
  };

  const handleBack = () => setCurrentStep((p) => Math.max(1, p - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* step-validation */
    if (currentStep === 2 && formData.password !== formData.passwordConfirm) {
      setPasswordMatchError(true);
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((p) => p + 1);
      return;
    }

    /* final submit */
    setIsSubmitting(true);
    try {
      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        email: formData.email,
        faculty: formData.faculty,
        birthdate: formData.birthdate,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      };

      const res = await axios.post(
        `${API_BASE_URL}api/v1/auth/student/signup`,
        payload
      );

      if (res.status === 201) setShowSuccess(true);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Network error. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─────────── Step renderer ─────────── */
  const renderStep = () => {
    /* STEP 1 — basic info */
    if (currentStep === 1)
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
          <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">
            Let&apos;s get started! 👋
          </h2>

          <div className="space-y-8 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            {/* first name */}
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-white">
                First Name
              </label>
              <div className="group relative">
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="peer h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-sm text-white placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none transition-colors duration-200"
                  placeholder="Loay"
                  required
                />
                <User
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 peer-focus:text-indigo-400"
                />
              </div>
            </div>

            {/* last name */}
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-white">
                Last Name
              </label>
              <div className="group relative">
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="peer h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-sm text-white placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none transition-colors duration-200"
                  placeholder="Essam"
                  required
                />
                <User
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 peer-focus:text-indigo-400"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            {/* email */}
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-white">
                Email Address
              </label>
              <div className="group relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="peer h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-sm text-white placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none transition-colors duration-200"
                  placeholder="loayessam@example.com"
                  required
                />
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 peer-focus:text-indigo-400"
                />
              </div>
            </div>

            {/* user name */}
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-white">
                User Name
              </label>
              <div className="group relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="peer h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-sm text-white placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none transition-colors duration-200"
                  placeholder="loay12"
                  required
                />
                <User
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 peer-focus:text-indigo-400"
                />
              </div>
            </div>
          </div>
        </motion.div>
      );

    /* STEP 2 — passwords */
    if (currentStep === 2)
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
          <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">
            Secure your account 🔒
          </h2>

          {/* password */}
          <div className="space-y-6">
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-white">
                Password
              </label>
              <div className="group relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="peer h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-12 text-sm text-white placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none transition-colors duration-200"
                  placeholder="Create a strong password"
                  required
                />
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 peer-focus:text-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 hover:text-indigo-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* strength bar */}
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    animate={{ width: `${passwordStrength}%` }}
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Password strength:
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
                      ? " Weak"
                      : passwordStrength < 75
                      ? " Medium"
                      : " Strong"}
                  </span>
                </p>
              </div>
            </div>

            {/* confirm */}
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-white">
                Confirm Password
              </label>
              <div className="group relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  className="peer h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-12 text-sm text-white placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none transition-colors duration-200"
                  placeholder="Re-enter your password"
                  required
                />
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 peer-focus:text-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 hover:text-indigo-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordMatchError && (
                <p className="mt-2 text-sm text-red-400">
                  Passwords do not match
                </p>
              )}
            </div>
          </div>
        </motion.div>
      );

    /* STEP 3 — faculty & birthdate */
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
        <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">
          Almost there! 🎓
        </h2>

        {/* faculty */}
        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-white">
            Faculty
          </label>
          <div className="group relative">
            <select
              name="faculty"
              value={formData.faculty}
              onChange={handleInputChange}
              required
              className="peer h-12 w-full appearance-none rounded-xl border border-white/20 bg-white/10 pl-12 pr-10 text-sm text-white focus:border-indigo-400 focus:outline-none transition-colors duration-200"
            >
              <option value="" disabled>
                Select your faculty
              </option>
              {[
                "Architecture",
                "Arts",
                "Dentistry",
                "Engineering",
                "Medicine",
                "Pharmacy",
                "Science",
                "Veterinary Medicine",
              ].map((fac) => (
                <option key={fac} value={fac} className="bg-gray-900/90">
                  {fac}
                </option>
              ))}
            </select>
            <GraduationCap
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 peer-focus:text-indigo-400"
            />
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* dob */}
        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-white">
            Date of Birth
          </label>
          <div className="group relative">
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleInputChange}
              required
              className="peer h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-sm text-white focus:border-indigo-400 focus:outline-none transition-colors duration-200"
            />
            <Calendar
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 peer-focus:text-indigo-400"
            />
          </div>
        </div>
      </motion.div>
    );
  };

  /* ─────────── UI ─────────── */
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#001F54] p-4 sm:p-6">
      <div className="w-full max-w-[440px] sm:max-w-2xl lg:max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gray-900/40 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col lg:flex-row">
          {/* form */}
          <div className="relative flex w-full flex-col lg:w-3/5">
            {/* progress */}
            <div className="px-6 pt-8 sm:px-8 md:px-12 lg:px-16">
              <div className="mb-8 flex items-center space-x-2 sm:space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold sm:h-10 sm:w-10 ${
                        currentStep >= step
                          ? "bg-[#001F54] text-white"
                          : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {currentStep > step ? <CheckCircle2 size={18} /> : step}
                    </motion.div>
                    {step < 3 && (
                      <div
                        className={`h-0.5 w-6 sm:w-10 ${
                          currentStep > step ? "bg-[#001F54]" : "bg-white/10"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-1 flex-col px-6 pb-8 sm:px-8 md:px-12 lg:px-16"
            >
              {/* steps */}
              <AnimatePresence mode="wait" initial={false}>
                {renderStep()}
              </AnimatePresence>

              {/* actions */}
              <div className="mt-10 flex space-x-4">
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-xl bg-gray-700 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-600"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <ArrowLeft size={18} />
                      <span>Back</span>
                    </div>
                  </motion.button>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className={`flex-1 rounded-xl bg-[#001F54] py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-600 ${
                    isSubmitting ? "cursor-not-allowed opacity-75" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>{currentStep === 3 ? "Sign Up" : "Continue"}</span>
                      <ArrowRight size={18} />
                    </div>
                  )}
                </motion.button>
              </div>

              {/* login link */}
              <p className="mt-6 text-center text-xs text-gray-400 sm:text-sm">
                Already have an account?{" "}
                <NavLink
                  to="/login"
                  className="text-indigo-400 transition-colors duration-200 hover:text-indigo-300"
                >
                  Login
                </NavLink>
              </p>
            </form>

            {/* success overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-md"
                >
                  <div className="text-center">
                    <PartyPopper className="mx-auto mb-6 h-16 w-16 text-indigo-500" />

                    <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl">
                      Welcome to the Web Site!
                    </h3>
                    <p className="mb-8 text-sm text-gray-400">
                      Your account has been successfully created
                    </p>
                    <button
                      onClick={() => (window.location.href = "/login")}
                      className="rounded-xl bg-[#001F54] px-8 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-600"
                    >
                      Get Started
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* side image (hidden < lg) */}
          <div className="relative hidden lg:block lg:w-2/5">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-sm" />
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1470&q=80"
              alt="Students studying"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
