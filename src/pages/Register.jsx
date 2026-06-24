import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff, User, Sparkles,
  CheckCircle, AlertCircle, Phone
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

  const heroSlides = [
    {
      image: "https://i.pinimg.com/736x/12/da/f8/12daf885924c4d60bedd30fb1c088782.jpg",
      title: "Join the",
      subtitle: "Legacy.",
      description: "Create an account to unlock early access to sales, tailored styling tips, and faster checkouts."
    },
    {
      image: "https://i.pinimg.com/736x/ae/d7/22/aed722220bbb4454e656c57f7a989c05.jpg",
      title: "Exclusive",
      subtitle: "Benefits.",
      description: "Get 10% off your first order, birthday surprises, and members-only previews."
    },
    {
      image: "https://i.pinimg.com/1200x/b7/a1/7b/b7a17bc21c9cc3cb37e77d9a60754cee.jpg",
      title: "Become a",
      subtitle: "VIP.",
      description: "Earn points on every purchase and unlock premium rewards and experiences."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "password") checkPasswordStrength(value);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (formData.name.length < 3) { setErrorMsg("Name must be at least 3 characters long."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) { setErrorMsg("Please enter a valid email address."); return; }
    if (formData.phone && formData.phone.length < 10) { setErrorMsg("Please enter a valid 10-digit phone number."); return; }
    if (formData.password.length < 6) { setErrorMsg("Password must be at least 6 characters long."); return; }
    if (formData.password !== formData.confirmPassword) { setErrorMsg("Passwords do not match."); return; }
    if (!agreeToTerms) { setErrorMsg("Please agree to the Terms & Conditions."); return; }

    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("userAuth", JSON.stringify({ 
        email: formData.email, 
        password: formData.password, 
        name: formData.name, 
        phone: formData.phone 
      }));
      setSuccessMsg("Account created successfully! Redirecting...");
      setTimeout(() => { 
        setIsLoading(false); 
        navigate("/account"); 
      }, 1500);
    }, 1000);
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
      
      {/* 🔥 FIXED: Mobile responsive slider - visible on all screens */}
      <div className="w-full lg:w-1/2 relative bg-stone-900 overflow-hidden h-[250px] sm:h-[300px] lg:h-auto">
        {heroSlides.map((slide, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="absolute inset-0 w-full h-full object-cover bg-stone-900" 
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent"></div>
            
            {/* 🔥 FIXED: Responsive padding for mobile */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 lg:p-16 text-right">
              <div className={`transition-all duration-700 transform ${currentSlide === idx ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <span className="inline-flex items-center gap-2 bg-primary/90 backdrop-blur-sm text-white text-[10px] sm:text-xs uppercase tracking-[0.3em] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-6">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />Join Now<Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </span>
                
                {/* 🔥 FIXED: Responsive text sizes */}
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl text-white mb-2 sm:mb-3 leading-tight">
                  {slide.title} <br/>
                  <span className="text-primary italic text-3xl sm:text-4xl lg:text-6xl">{slide.subtitle}</span>
                </h2>
                <p className="font-body text-white/70 sm:text-white/80 text-xs sm:text-sm lg:text-base tracking-wide ml-auto max-w-md line-clamp-2 sm:line-clamp-none">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Logo - desktop only */}
        <div className="hidden lg:flex absolute top-10 right-10 z-30">
          <Link to="/" className="font-heading text-3xl font-bold text-white tracking-widest flex items-center gap-2 hover:text-primary transition-colors">
            LM <span className="text-primary italic">Showroom</span>
          </Link>
        </div>

        {/* Slide dots */}
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

      {/* 🔥 FIXED: Form section - responsive spacing */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-5 sm:px-10 md:px-14 lg:px-20 py-8 lg:py-12 relative">
        {/* Back to Home - mobile only */}
        <Link to="/" className="lg:hidden absolute top-4 left-4 sm:top-8 sm:left-8 text-stone-500 hover:text-primary flex items-center gap-2 font-body text-xs sm:text-sm transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Back to Home
        </Link>
        
        {/* Logo - mobile only */}
        <div className="lg:hidden text-center mb-6 sm:mb-8">
          <Link to="/" className="font-heading text-2xl sm:text-3xl font-bold text-stone-800 tracking-widest">
            LLM <span className="text-primary italic">Showroom</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          
          {/* Header */}
          <div className="mb-4 sm:mb-5">
            <h1 className="font-heading text-3xl sm:text-4xl text-stone-800 mb-1.5 sm:mb-2">Register</h1>
            <p className="font-body text-stone-500 text-xs sm:text-sm">Become a part of our exclusive fashion club.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5 sm:space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />Full Name
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full bg-white border border-stone-200 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder="Enter your full name" 
                required 
              />
            </div>

            {/* Email */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />Email Address
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

            {/* Phone */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />Phone Number 
                <span className="text-stone-400 text-[10px] sm:text-xs font-normal">(Optional)</span>
              </label>
              <div className="flex gap-1.5 sm:gap-2">
                <select className="w-20 sm:w-24 bg-white border border-stone-200 rounded-xl px-2 sm:px-3 py-3 sm:py-3.5 font-body text-xs sm:text-sm focus:outline-none focus:border-primary transition-all">
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="flex-1 bg-white border border-stone-200 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder="Phone number" 
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />Create Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  className="w-full bg-white border border-stone-200 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 pr-11 sm:pr-12 font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 text-stone-400 hover:text-stone-600 transition-colors rounded-full hover:bg-stone-100"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
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
                    <span className="text-[10px] sm:text-xs text-stone-500">{getStrengthText()}</span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-stone-400 mt-0.5 sm:mt-1">Use 8+ characters with letters, numbers & symbols</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="font-body text-xs sm:text-sm font-medium text-stone-700 flex items-center gap-1.5 sm:gap-2">
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />Confirm Password
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  className={`w-full bg-white border rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 pr-11 sm:pr-12 font-body text-sm focus:outline-none transition-all ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                  }`} 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 text-stone-400 hover:text-stone-600 transition-colors rounded-full hover:bg-stone-100"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5 sm:mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />Passwords do not match
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1 sm:pt-2">
              <label className="flex items-start gap-1.5 sm:gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={agreeToTerms} 
                  onChange={(e) => setAgreeToTerms(e.target.checked)} 
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 rounded border-stone-300 text-primary focus:ring-primary/20 cursor-pointer" 
                />
                <span className="text-[10px] sm:text-xs text-stone-600 group-hover:text-stone-800 transition-colors">
                  I agree to the <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            {/* Error/Success Messages */}
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

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-body font-medium text-sm transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /></>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="font-body text-xs sm:text-sm text-stone-500">
              Already a member? 
              <Link to="/account" className="text-primary font-medium hover:text-primary/80 transition-colors ml-1.5 sm:ml-2 border-b-2 border-primary/30 hover:border-primary pb-0.5">
                Sign In
              </Link>
            </p>
          </div>

          {/* Footer Links */}
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

export default Register;