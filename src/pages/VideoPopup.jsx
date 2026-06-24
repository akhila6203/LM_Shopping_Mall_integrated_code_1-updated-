import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  X, Sparkles, Mail, Phone, Lock, Key, ArrowRight, 
  Fingerprint, Shield, Gift, Percent, Truck, Award,
  CheckCircle2, AlertCircle, ChevronRight, Eye, EyeOff,
  MessageCircle, Smartphone, Timer, RefreshCw
} from "lucide-react";

const VideoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [timer, setTimer] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const otpRefs = useRef([]);

  // Premium slides
  const slides = [
    {
      title: "Timeless Elegance",
      subtitle: "Experience the royal touch of handcrafted ethnic wear",
      badge: "New Collection",
      image: "https://i.pinimg.com/736x/e3/7e/e1/e37ee137d9d7ab7abb31b21519d5f208.jpg"
    },
    {
      title: "Artisanal Heritage",
      subtitle: "Centuries of craftsmanship in every thread",
      badge: "Handloom Special",
      image: "https://i.pinimg.com/1200x/b8/90/97/b890972e18b3aa7864e711410a850d5a.jpg"
    },
    {
      title: "Wedding Edit 2026",
      subtitle: "Discover our exclusive bridal collection",
      badge: "Bridal Exclusive",
      image: "https://i.pinimg.com/736x/d2/77/d7/d277d7316a19797d685993f10e6e51dc.jpg"
    }
  ];

  // Exclusive benefits
  const benefits = [
    { icon: Percent, text: "10% OFF first order" },
    { icon: Truck, text: "Free shipping" },
    { icon: Gift, text: "Birthday surprise" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen, slides.length]);

  // OTP Timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // SMART DETECTION
  const handleChange = (value) => {
    setInputValue(value);
    setErrorMsg("");
    setSuccessMsg("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (emailRegex.test(value)) {
      setIsEmail(true);
      setIsPhone(false);
      setOtpSent(false);
    } else if (phoneRegex.test(value)) {
      setIsPhone(true);
      setIsEmail(false);
    } else {
      setIsEmail(false);
      setIsPhone(false);
      setOtpSent(false);
    }
  };

  // OTP Input Handler
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // OTP Paste Handler
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);
    if (pastedData.length === 6) {
      otpRefs.current[5]?.focus();
    }
  };

  const handleSubmit = () => {
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (isPhone && !otpSent) {
        setOtpSent(true);
        setTimer(30);
        setSuccessMsg("OTP sent to your phone!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else if (isPhone && otpSent) {
        const otpString = otp.join("");
        if (otpString.length === 6) {
          setSuccessMsg("OTP Verified! Welcome!");
          setTimeout(() => {
            setIsOpen(false);
            resetForm();
          }, 1500);
        } else {
          setErrorMsg("Please enter complete 6-digit OTP");
        }
      } else if (isEmail) {
        if (password.length >= 6) {
          setSuccessMsg("Login Successful! Redirecting...");
          setTimeout(() => {
            setIsOpen(false);
            resetForm();
          }, 1500);
        } else {
          setErrorMsg("Password must be at least 6 characters");
        }
      } else {
        setErrorMsg("Enter a valid email or 10-digit phone number");
      }
    }, 1000);
  };

  const resetForm = () => {
    setInputValue("");
    setOtp(["", "", "", "", "", ""]);
    setPassword("");
    setIsEmail(false);
    setIsPhone(false);
    setOtpSent(false);
    setErrorMsg("");
    setSuccessMsg("");
    setTimer(0);
  };

  const resendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(30);
    setSuccessMsg("OTP resent successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/80 via-stone-900/80 to-black/80 backdrop-blur-md"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Main Modal */}
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all hover:scale-110 hover:rotate-90 duration-300"
        >
          <X className="w-5 h-5 text-stone-700" />
        </button>

        <div className="grid md:grid-cols-2">
          
          {/* LEFT: Image Carousel */}
          <div className="relative h-[300px] md:h-[500px] overflow-hidden bg-stone-900">
            {slides.map((slide, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  activeSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div className={`transition-all duration-500 ${
                    activeSlide === idx ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <span className="inline-flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                      <Sparkles className="w-3 h-3" />
                      {slide.badge}
                    </span>
                    <h2 className="font-heading text-3xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-sm text-white/80">{slide.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="absolute bottom-6 left-8 z-20 flex gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1 rounded-full transition-all ${
                    activeSlide === idx ? 'w-8 bg-white' : 'w-4 bg-white/40'
                  }`}
                />
              ))}
            </div>

            <div className="absolute top-6 left-6 z-20">
              <span className="font-heading text-2xl font-bold text-white tracking-wider">
                LM <span className="text-primary italic">Showroom</span>
              </span>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-white via-stone-50 to-white">
            
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Exclusive Access</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-stone-800 mb-1">Welcome Back</h3>
              <p className="text-stone-500 text-sm">Sign in to unlock exclusive offers</p>
            </div>

            {/* Benefits Pills */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-stone-100 px-2.5 py-1.5 rounded-full">
                  <benefit.icon className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-medium text-stone-600">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-3">
              
              {/* Input */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Email or Phone</label>
                <div className="relative">
                  {isEmail ? (
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  ) : isPhone ? (
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  ) : (
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  )}
                  <input
                    type="text"
                    placeholder="Enter email or phone"
                    value={inputValue}
                    onChange={(e) => handleChange(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 bg-stone-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      inputValue && !isEmail && !isPhone
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : isEmail || isPhone
                          ? "border-green-300 focus:border-green-500 focus:ring-green-100"
                          : "border-stone-200 focus:border-primary focus:ring-primary/20"
                    }`}
                    required
                  />
                  {(isEmail || isPhone) && (
                    <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>

              {/* Password (for email) */}
              {isEmail && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* OTP Section (for phone) */}
              {isPhone && otpSent && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-stone-700">Enter OTP</label>
                    <div className="flex items-center gap-2">
                      {timer > 0 ? (
                        <span className="text-[10px] text-stone-500 flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {timer}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={resendOtp}
                          className="text-[10px] text-primary hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => otpRefs.current[idx] = el}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        maxLength={1}
                        className="w-full aspect-square text-center text-lg font-bold bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Error/Success Messages */}
              {errorMsg && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-600 text-xs">{errorMsg}</p>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <p className="text-green-600 text-xs">{successMsg}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                ) : isPhone ? (
                  otpSent ? "Verify OTP" : "Send OTP"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Register Link */}
            <p className="text-center text-xs text-stone-500 mt-4">
              New to LM Showroom?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium" onClick={() => setIsOpen(false)}>
                Create an account
              </Link>
            </p>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-stone-100">
              <Shield className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                Secure & Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;