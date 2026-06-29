import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../ShopContext.jsx";
import {
  ArrowRight,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Key,
  Timer,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { forgotPassword, resetPassword } from "@/services/customerAuthService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { openLoginModal } = useShop();

const goToLogin = () => {
  navigate("/", { replace: true });
  setTimeout(() => openLoginModal(), 100);
};
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const otpRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const getPhoneDigits = () => phone.replace(/\D/g, "").slice(-10);

  const validatePhone = () => {
    const digits = getPhoneDigits();
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number.");
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!validatePhone()) return;

    setIsLoading(true);
    try {
      await forgotPassword({ phone: getPhoneDigits() });
      setStep("otp");
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      setSuccessMsg("OTP sent to your WhatsApp!");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || error.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      await forgotPassword({ phone: getPhoneDigits() });
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit OTP.");
      return;
    }

    setStep("password");
    setSuccessMsg("OTP verified. Set your new password.");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        phone: getPhoneDigits(),
        otp: otp.join(""),
        password,
      });
      setStep("success");
      setSuccessMsg("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/", { replace: true });
        setTimeout(() => openLoginModal(), 100);
      }, 2000);
      // setTimeout(() => {
      //   navigate("/account", {
      //     replace: true,
      //     state: { registrationSuccess: "Password reset successful. Please login with your new password." },
      //   });
      // }, 2000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || error.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const titles = {
    phone: "Forgot Password",
    otp: "Verify OTP",
    password: "Set New Password",
    success: "Password Reset",
  };

  const subtitles = {
    phone: "Enter your registered phone number to receive a WhatsApp OTP.",
    otp: `Enter the 6-digit OTP sent to +91 ${getPhoneDigits()} on WhatsApp.`,
    password: "Create a new password for your account.",
    success: "Your password has been updated successfully.",
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-white to-stone-100 px-5 py-10">
      <div className="max-w-md w-full">
        <button
  type="button"
  onClick={goToLogin}
  className="inline-flex items-center gap-2 text-stone-500 hover:text-primary font-body text-xs sm:text-sm transition-colors mb-6"
>
  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
  Back to Sign In
</button>
        {/* <Link
          to="/account"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-primary font-body text-xs sm:text-sm transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to Sign In
        </Link> */}

        <div className="bg-white border border-stone-200 rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="font-heading text-2xl sm:text-3xl text-stone-800 mb-1.5">
              {titles[step]}
            </h1>
            <p className="font-body text-stone-500 text-xs sm:text-sm">{subtitles[step]}</p>
          </div>

          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-stone-400" />
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select className="w-20 bg-white border border-stone-200 rounded-xl px-2 py-3 font-body text-xs sm:text-sm">
                    <option value="+91">+91</option>
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrorMsg("");
                    }}
                    className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
              </div>

              {errorMsg && <AlertBox message={errorMsg} type="error" />}
              {successMsg && <AlertBox message={successMsg} type="success" />}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-medium text-sm disabled:opacity-50"
              >
                {isLoading ? "Sending OTP..." : <>Send WhatsApp OTP <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-2">
                    <Key className="w-4 h-4 text-stone-400" />
                    Enter OTP
                  </label>
                  {timer > 0 ? (
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5" />
                      {timer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Resend OTP
                    </button>
                  )}
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
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      maxLength={1}
                      className="w-full aspect-square text-center text-lg font-bold bg-stone-50 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  ))}
                </div>
              </div>

              {errorMsg && <AlertBox message={errorMsg} type="error" />}
              {successMsg && <AlertBox message={successMsg} type="success" />}

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-medium text-sm"
              >
                Verify OTP <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-stone-400" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 pr-11 font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="New password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-stone-400" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 pr-11 font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && <AlertBox message={errorMsg} type="error" />}
              {successMsg && <AlertBox message={successMsg} type="success" />}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-medium text-sm disabled:opacity-50"
              >
                {isLoading ? "Resetting..." : <>Reset Password <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-stone-600 text-sm">{successMsg}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AlertBox = ({ message, type }) => {
  const isError = type === "error";
  return (
    <div
      className={`flex items-center gap-2 rounded-xl p-3 border ${
        isError ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
      }`}
    >
      {isError ? (
        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
      ) : (
        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
      )}
      <p className={`font-body text-xs ${isError ? "text-red-600" : "text-green-600"}`}>{message}</p>
    </div>
  );
};

export default ForgotPassword;
