import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff, Sparkles, 
  Shield, Truck, Award, Clock, CheckCircle, AlertCircle,
  Fingerprint, Smartphone, Globe, Key, Timer, RefreshCw,
  Gift, Percent, MessageCircle
} from "lucide-react";
import { useShop } from "../ShopContext.jsx";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useShop();
  
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timer, setTimer] = useState(0);
  const otpRefs = useRef([]);

  const heroSlides = [
    {
      image: "https://i.pinimg.com/736x/ae/d7/22/aed722220bbb4454e656c57f7a989c05.jpg",
      title: "Return to",
      subtitle: "Elegance.",
      description: "Log in to discover personalized recommendations and exclusive ethnic wear collections."
    },
    {
      image: "https://i.pinimg.com/736x/12/da/f8/12daf885924c4d60bedd30fb1c088782.jpg",
      title: "Your Style",
      subtitle: "Awaits.",
      description: "Access your wishlist, track orders, and get early access to new arrivals."
    },
    {
      image: "https://i.pinimg.com/1200x/b7/a1/7b/b7a17bc21c9cc3cb37e77d9a60754cee.jpg",
      title: "Join the",
      subtitle: "Community.",
      description: "Connect with thousands of fashion enthusiasts and share your style journey."
    }
  ];

  const benefits = [
    { icon: Percent, text: "10% OFF first order" },
    { icon: Truck, text: "Free shipping" },
    { icon: Gift, text: "Birthday surprise" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setInputValue(savedEmail);
      handleInputChange(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleInputChange = (value) => {
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

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => { if (idx < 6) newOtp[idx] = char; });
    setOtp(newOtp);
    if (pastedData.length === 6) otpRefs.current[5]?.focus();
  };

  const resendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(30);
    setSuccessMsg("OTP resent successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
    otpRefs.current[0]?.focus();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      if (isPhone) {
        if (!otpSent) {
          setOtpSent(true);
          setTimer(30);
          setSuccessMsg("OTP sent to your phone number!");
          setTimeout(() => setSuccessMsg(""), 3000);
          setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } else {
          const otpString = otp.join("");
          if (otpString.length === 6) {
            if (rememberMe) localStorage.setItem("rememberedEmail", inputValue);
            else localStorage.removeItem("rememberedEmail");
            
            const userData = { phone: inputValue, name: "User" };
            login(userData); // ✅ Update global state
            
            setSuccessMsg("✓ OTP Verified! Redirecting...");
            // ✅ FIX: Navigate directly WITHOUT setTimeout
            navigate("/profile", { replace: true });
          } else {
            setErrorMsg("Please enter complete 6-digit OTP");
          }
        }
      } else if (isEmail) {
        if (password.length >= 6) {
          const savedUser = JSON.parse(localStorage.getItem("userAuth"));
          const isValidRegisteredUser = savedUser && inputValue === savedUser.email && password === savedUser.password;
          const isTestAdmin = inputValue === "test@admin.com" && password === "123456";
          
          if (rememberMe) localStorage.setItem("rememberedEmail", inputValue);
          else localStorage.removeItem("rememberedEmail");
          
          if (isValidRegisteredUser || isTestAdmin) {
            const userData = isTestAdmin 
              ? { email: "test@admin.com", name: "Admin" }
              : savedUser;
            login(userData); // ✅ Update global state
            
            setSuccessMsg("Login Successful! Redirecting...");
            // ✅ FIX: Navigate directly WITHOUT setTimeout
            navigate("/profile", { replace: true });
          } else {
            setErrorMsg("Invalid Email or Password. Please try again.");
          }
        } else {
          setErrorMsg("Password must be at least 6 characters");
        }
      } else {
        setErrorMsg("Enter a valid email or 10-digit phone number starting with 6-9");
      }
    }, 800);
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-stone-50 via-white to-stone-100">
      
      <div className="w-full lg:w-1/2 relative bg-stone-900 overflow-hidden h-[250px] sm:h-[300px] lg:h-auto">
        {heroSlides.map((slide, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover bg-stone-900" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 lg:p-16">
              <div className={`transition-all duration-700 transform ${currentSlide === idx ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <span className="inline-flex items-center gap-2 bg-primary/90 backdrop-blur-sm text-white text-[10px] sm:text-xs uppercase tracking-[0.3em] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-6">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />Welcome Back<Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </span>
                
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl text-white mb-2 sm:mb-3 leading-tight">
                  {slide.title} <br/>
                  <span className="text-primary italic text-3xl sm:text-4xl lg:text-6xl">{slide.subtitle}</span>
                </h2>
                <p className="font-body text-white/70 sm:text-white/80 text-xs sm:text-sm lg:text-base tracking-wide max-w-md line-clamp-2 sm:line-clamp-none">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="hidden lg:flex absolute top-10 left-10 z-30">
          <Link to="/" className="font-heading text-3xl font-bold text-white tracking-widest flex items-center gap-2 hover:text-primary transition-colors">
            LM <span className="text-primary italic">Showroom</span>
          </Link>
        </div>

        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2">
          {heroSlides.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)} 
              className={`h-1 sm:h-1.5 rounded-full transition-all ${currentSlide === idx ? 'w-6 sm:w-8 bg-primary' : 'w-3 sm:w-4 bg-white/50 hover:bg-white/70'}`} 
            />
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-5 sm:px-10 md:px-14 lg:px-20 py-8 lg:py-12 relative">
        <Link to="/" className="lg:hidden absolute top-4 left-4 sm:top-8 sm:left-8 text-stone-500 hover:text-primary flex items-center gap-2 font-body text-xs sm:text-sm transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Back to Home
        </Link>
        
        <div className="lg:hidden text-center mb-6 sm:mb-8">
          <Link to="/" className="font-heading text-2xl sm:text-3xl font-bold text-stone-800 tracking-widest">
            LLM <span className="text-primary italic">Showroom</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-5 sm:mb-6">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest">Exclusive Access</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-stone-800 mb-1.5 sm:mb-2">Welcome Back</h1>
            <p className="font-body text-stone-500 text-xs sm:text-sm">Sign in to unlock exclusive offers & rewards.</p>
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-5 sm:mb-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-1 bg-stone-100 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full">
                <benefit.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                <span className="text-[9px] sm:text-[10px] font-medium text-stone-600">{benefit.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-4">
            <div className="space-y-1 sm:space-y-1.5">
              <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                {isEmail ? <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" /> : isPhone ? <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" /> : <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />}
                {isPhone ? "Phone Number" : "Email or Phone"}
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={inputValue} 
                  onChange={(e) => handleInputChange(e.target.value)} 
                  className={`w-full bg-white border rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 font-body text-sm focus:outline-none transition-all ${
                    errorMsg && !isEmail && !isPhone ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 
                    isEmail || isPhone ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-100' : 
                    'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                  }`} 
                  placeholder={isPhone ? "Enter 10-digit number" : "Enter email or phone number"} 
                  required 
                />
                {(isEmail || isPhone) && <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
              </div>
              {isPhone && <p className="text-[9px] sm:text-[10px] text-stone-400 mt-0.5 sm:mt-1">We'll send you a 6-digit OTP</p>}
            </div>

            {isEmail && (
              <div className="space-y-1 sm:space-y-1.5">
                <div className="flex justify-between items-end">
                  <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />Password
                  </label>
                  <Link to="/forgot-password" className="font-body text-[10px] sm:text-xs text-primary hover:text-primary/80 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className={`w-full bg-white border rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 pr-11 sm:pr-12 font-body text-sm focus:outline-none transition-all ${
                      errorMsg && errorMsg.includes("Password") ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 
                      'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`} 
                    placeholder="••••••••" 
                    required={isEmail} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 text-stone-400 hover:text-stone-600 transition-colors rounded-full hover:bg-stone-100"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </div>
              </div>
            )}

            {isPhone && otpSent && (
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                    <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />Enter OTP
                  </label>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {timer > 0 ? (
                      <span className="text-[10px] sm:text-xs text-stone-500 flex items-center gap-1">
                        <Timer className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{timer}s
                      </span>
                    ) : (
                      <button type="button" onClick={resendOtp} className="text-[10px] sm:text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                        <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />Resend OTP
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input 
                      key={idx} 
                      ref={el => otpRefs.current[idx] = el} 
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
            )}

            {(isEmail || isPhone) && (
              <div className="flex items-center justify-between pt-0.5 sm:pt-1">
                <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)} 
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-stone-300 text-primary focus:ring-primary/20 cursor-pointer" 
                  />
                  <span className="text-xs sm:text-sm text-stone-600 group-hover:text-stone-800 transition-colors">
                    {isPhone ? "Remember this device" : "Remember me"}
                  </span>
                </label>
              </div>
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
              className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-body font-medium text-sm transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isPhone && !otpSent ? "Sending OTP..." : "Verifying..."}
                </>
              ) : (
                <>
                  {isPhone ? (
                    otpSent ? (
                      <>Verify OTP <Fingerprint className="w-4 h-4 sm:w-5 sm:h-5" /></>
                    ) : (
                      <>Send OTP <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" /></>
                    )
                  ) : (
                    <>Sign In <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /></>
                  )}
                </>
              )}
            </button>
          </form>

          <div className="mt-5 sm:mt-6 text-center">
            <p className="font-body text-xs sm:text-sm text-stone-500">
              New to LM Showroom? 
              <Link to="/register" className="text-primary font-medium hover:text-primary/80 transition-colors ml-1.5 sm:ml-2 border-b-2 border-primary/30 hover:border-primary pb-0.5">
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-5 sm:mt-6 flex items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-stone-400">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
            <Link to="/help" className="hover:text-primary transition-colors">Help</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;