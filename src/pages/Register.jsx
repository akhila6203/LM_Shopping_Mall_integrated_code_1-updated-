import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Phone,
  Key,
  Timer,
  RefreshCw,
} from "lucide-react";
import { useShop } from "../ShopContext.jsx";
import { getBanners } from "@/services/bannerService";
import { getImageUrl } from "@/api/axiosClient";
import { sendOtp, verifyOtp } from "@/services/customerAuthService";

const isActiveBanner = (status) =>
  status === "active" || status === 1 || status === true;

const mapBannerToSlide = (banner) => ({
  id: banner.id,
  image: getImageUrl(banner.image),
  title: banner.title || "",
  subtitle: banner.subtitle || banner.subtitle1 || "",
  description: banner.description || "",
});

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [step, setStep] = useState("form");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const otpRefs = useRef([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [heroSlides, setHeroSlides] = useState([]);

  const navigate = useNavigate();
  const { register, openLoginModal } = useShop();

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await getBanners();
        const slides = (data || [])
          .filter((b) => isActiveBanner(b.status))
          .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))
          .map(mapBannerToSlide)
          .filter((slide) => slide.image);

        setHeroSlides(slides);
      } catch (error) {
        console.error("Register banner fetch error:", error);
      }
    };

    loadBanners();
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return undefined;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.match(/[a-z]+/)) strength++;
    if (pwd.match(/[A-Z]+/)) strength++;
    if (pwd.match(/[0-9]+/)) strength++;
    if (pwd.match(/[$@#&!]+/)) strength++;
    setPasswordStrength(strength);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") checkPasswordStrength(value);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const validateForm = () => {
    if (formData.first_name.trim().length < 2) {
      setErrorMsg("First name must be at least 2 characters long.");
      return false;
    }
    if (formData.last_name.trim().length < 1) {
      setErrorMsg("Last name is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Please enter a valid email address.");
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMsg("Phone number is required.");
      return false;
    }
    const phoneDigits = formData.phone.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number.");
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return false;
    }
    if (!agreeToTerms) {
      setErrorMsg("Please agree to the Terms & Conditions.");
      return false;
    }
    return true;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, "");
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);
    if (pastedData.length === 6) otpRefs.current[5]?.focus();
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const phoneDigits = formData.phone.replace(/\D/g, "").slice(-10);

    try {
      await sendOtp({
        phone: phoneDigits,
        email: formData.email.trim(),
        purpose: "register",
      });
      setStep("otp");
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      setSuccessMsg("OTP sent to your WhatsApp!");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setErrorMsg("");
    const phoneDigits = formData.phone.replace(/\D/g, "").slice(-10);

    try {
      await sendOtp({
        phone: phoneDigits,
        email: formData.email.trim(),
        purpose: "register",
      });
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      setSuccessMsg("OTP resent to your WhatsApp!");
      otpRefs.current[0]?.focus();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || error.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    const phoneDigits = formData.phone.replace(/\D/g, "").slice(-10);

    try {
      const verifyResponse = await verifyOtp({
        phone: phoneDigits,
        otp: otpString,
        purpose: "register",
      });

      const token =
        verifyResponse?.data?.verification_token ||
        verifyResponse?.verification_token;

      if (!token) {
        throw new Error("OTP verification failed. Please try again.");
      }

      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: phoneDigits,
        password: formData.password,
        verification_token: token,
      };

      await register(payload);
      navigate("/account", {
        replace: true,
        state: { registrationSuccess: "Registration successful. Please login." },
      });
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (step === "form") {
      await handleSendOtp();
    } else {
      await handleVerifyAndRegister(e);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row-reverse bg-gradient-to-bl from-stone-50 via-white to-stone-100">
      <div className="w-full lg:w-1/2 relative bg-stone-900 overflow-hidden h-[250px] sm:h-[300px] lg:h-auto">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id ?? idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover bg-stone-900"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent"></div>

            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 lg:p-16 text-right">
              <div
                className={`transition-all duration-700 transform ${
                  currentSlide === idx
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <span className="inline-flex items-center gap-2 bg-primary/90 backdrop-blur-sm text-white text-[10px] sm:text-xs uppercase tracking-[0.3em] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-6">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  Join Now
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </span>

                <h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl text-white mb-2 sm:mb-3 leading-tight">
                  {slide.title} <br />
                  <span className="text-primary italic text-3xl sm:text-4xl lg:text-6xl">
                    {slide.subtitle}
                  </span>
                </h2>
                <p className="font-body text-white/70 sm:text-white/80 text-xs sm:text-sm lg:text-base tracking-wide ml-auto max-w-md line-clamp-2 sm:line-clamp-none">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="hidden lg:flex absolute top-10 right-10 z-30">
          <Link
            to="/"
            className="font-heading text-3xl font-bold text-white tracking-widest flex items-center gap-2 hover:text-primary transition-colors"
          >
            LM <span className="text-primary italic">Showroom</span>
          </Link>
        </div>

        {heroSlides.length > 0 && (
          <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1 sm:h-1.5 rounded-full transition-all ${
                  currentSlide === idx
                    ? "w-6 sm:w-8 bg-primary"
                    : "w-3 sm:w-4 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-5 sm:px-10 md:px-14 lg:px-20 py-8 lg:py-12 relative">
        <Link
          to="/"
          className="lg:hidden absolute top-4 left-4 sm:top-8 sm:left-8 text-stone-500 hover:text-primary flex items-center gap-2 font-body text-xs sm:text-sm transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to Home
        </Link>

        <div className="lg:hidden text-center mb-6 sm:mb-8">
          <Link
            to="/"
            className="font-heading text-2xl sm:text-3xl font-bold text-stone-800 tracking-widest"
          >
            LLM <span className="text-primary italic">Showroom</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-4 sm:mb-5">
            <h1 className="font-heading text-3xl sm:text-4xl text-stone-800 mb-1.5 sm:mb-2">
              {step === "form" ? "Register" : "Verify Phone"}
            </h1>
            <p className="font-body text-stone-500 text-xs sm:text-sm">
              {step === "form"
                ? "Become a part of our exclusive fashion club."
                : `Enter the 6-digit OTP sent to +91 ${formData.phone.replace(/\D/g, "").slice(-10)} on WhatsApp.`}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5 sm:space-y-4">
            {step === "form" ? (
              <>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="First name"
                      required
                    />
                  </div>

                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
                    Phone Number
                  </label>
                  <div className="flex gap-1.5 sm:gap-2">
                    <select className="w-20 sm:w-24 bg-white border border-stone-200 rounded-xl px-2 sm:px-3 py-3 sm:py-3.5 font-body text-xs sm:text-sm focus:outline-none focus:border-primary transition-all">
                      <option value="+91">+91</option>
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex-1 bg-white border border-stone-200 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 pr-11 sm:pr-12 font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 text-stone-400 hover:text-stone-600 transition-colors rounded-full hover:bg-stone-100"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="mt-1.5 sm:mt-2">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="flex-1 h-1 sm:h-1.5 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] sm:text-xs text-stone-500">
                          {getStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full bg-white border rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 pr-11 sm:pr-12 font-body text-sm focus:outline-none transition-all ${
                        formData.confirmPassword &&
                        formData.password !== formData.confirmPassword
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                      placeholder="confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 text-stone-400 hover:text-stone-600 transition-colors rounded-full hover:bg-stone-100"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-1 sm:pt-2">
                  <label className="flex items-start gap-1.5 sm:gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 rounded border-stone-300 text-primary focus:ring-primary/20 cursor-pointer"
                    />
                    <span className="text-[10px] sm:text-xs text-stone-600 group-hover:text-stone-800 transition-colors">
                      I agree to the{" "}
                      <Link to="/terms-conditions" className="text-primary hover:underline">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy-policy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                      <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
                      Enter WhatsApp OTP
                    </label>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {timer > 0 ? (
                        <span className="text-[10px] sm:text-xs text-stone-500 flex items-center gap-1">
                          <Timer className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {timer}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isLoading}
                          className="text-[10px] sm:text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                        >
                          <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        maxLength={1}
                        className="w-full aspect-square text-center text-base sm:text-lg font-bold bg-stone-50 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        autoComplete="one-time-code"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setOtp(["", "", "", "", "", ""]);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-xs text-stone-500 hover:text-primary transition-colors"
                >
                  ← Edit registration details
                </button>
              </>
            )}

            {errorMsg && (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-red-50 border border-red-200 rounded-xl p-2.5 sm:p-3">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                <p className="text-red-600 font-body text-[10px] sm:text-xs">{errorMsg}</p>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-green-50 border border-green-200 rounded-xl p-2.5 sm:p-3">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                <p className="text-green-600 font-body text-[10px] sm:text-xs">{successMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-body font-medium text-sm transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {step === "form" ? "Sending OTP..." : "Creating Account..."}
                </>
              ) : step === "form" ? (
                <>
                  Create Account <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              ) : (
                <>
                  Verify & Register <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="font-body text-xs sm:text-sm text-stone-500">
              Already a member?
              <button
  type="button"
  onClick={() => openLoginModal()}
  className="text-primary font-medium hover:text-primary/80 transition-colors ml-1.5 sm:ml-2 border-b-2 border-primary/30 hover:border-primary pb-0.5"
>
  Sign In
</button>
              {/* <Link
                to="/account"
                className="text-primary font-medium hover:text-primary/80 transition-colors ml-1.5 sm:ml-2 border-b-2 border-primary/30 hover:border-primary pb-0.5"
              >
                Sign In
              </Link> */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
