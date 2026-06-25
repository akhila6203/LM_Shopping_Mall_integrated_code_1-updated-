import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Shield,
  Percent,
  Truck,
  Gift,
} from "lucide-react";
import { useShop } from "../ShopContext.jsx";
import { getBanners } from "@/services/bannerService";
import { getImageUrl } from "@/api/axiosClient";

const isActiveBanner = (status) =>
  status === "active" || status === 1 || status === true;

const mapBannerToSlide = (banner) => ({
  id: banner.id,
  image: getImageUrl(banner.image),
  title: banner.title || "",
  subtitle: banner.description || "",
  badge: banner.subtitle || banner.subtitle1 || "",
});

const benefits = [
  { icon: Percent, text: "10% OFF first order" },
  { icon: Truck, text: "Free shipping" },
  { icon: Gift, text: "Birthday surprise" },
];

const LoginModal = () => {
  const {
    loginModal,
    closeLoginModal,
    login,
    addToCart,
    toggleWishlist,
    customer,
    authLoading,
  } = useShop();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState([]);

  const isOpen = loginModal?.open;

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setErrorMsg("");
      setShowPassword(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !authLoading && customer) {
      closeLoginModal();
    }
  }, [isOpen, authLoading, customer, closeLoginModal]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const loadBanners = async () => {
      try {
        const data = await getBanners();
        const slides = (data || [])
          .filter((b) => isActiveBanner(b.status))
          .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))
          .map(mapBannerToSlide)
          .filter((slide) => slide.image);
        setHeroSlides(slides);
        setActiveSlide(0);
      } catch (error) {
        console.error("Login modal banner fetch error:", error);
        setHeroSlides([]);
      }
    };
    loadBanners();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || heroSlides.length === 0) return undefined;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen, heroSlides.length]);

  const getReturnPath = () => {
    const from = loginModal?.from;
    if (from?.pathname) {
      return `${from.pathname}${from.search || ""}${from.hash || ""}`;
    }
    return "/";
  };

  const handlePostLogin = async () => {
    const pending = loginModal?.pendingAction;
    const returnPath = getReturnPath();

    if (pending?.type === "addToCart" && pending.product) {
      await addToCart(pending.product);
      closeLoginModal();
      navigate(returnPath, { replace: true });
      return;
    }

    if (pending?.type === "buyNow" && pending.product) {
      await addToCart(pending.product);
      closeLoginModal();
      navigate("/cart", { replace: true });
      return;
    }

    if (pending?.type === "toggleWishlist" && pending.product) {
      await toggleWishlist(pending.product);
      closeLoginModal();
      navigate(returnPath, { replace: true });
      return;
    }

    closeLoginModal();
    if (returnPath && returnPath !== "/") {
      navigate(returnPath, { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setErrorMsg("Please enter a valid email address");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters");
        return;
      }

      await login(email.trim(), password);
      await handlePostLogin();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem("login_popup_dismissed", "1");
    closeLoginModal();
  };

  if (!isOpen || authLoading) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all"
          type="button"
        >
          <X className="w-5 h-5 text-stone-700" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="relative h-[280px] md:h-[520px] overflow-hidden bg-stone-900">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id ?? idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  activeSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover bg-stone-900"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div
                    className={`transition-all duration-500 ${
                      activeSlide === idx ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                  >
                    {slide.badge && (
                    <span className="inline-flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                      <Sparkles className="w-3 h-3" />
                      {slide.badge}
                    </span>
                    )}
                    <h2 className="font-heading text-3xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-sm text-white/80">{slide.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}

            {heroSlides.length > 0 && (
            <div className="absolute bottom-6 left-8 z-20 flex gap-1.5">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1 rounded-full transition-all ${
                    activeSlide === idx ? "w-8 bg-white" : "w-4 bg-white/40"
                  }`}
                />
              ))}
            </div>
            )}

            <div className="absolute top-6 left-6 z-20">
              <span className="font-heading text-2xl font-bold text-white tracking-wider">
                LM <span className="text-primary italic">Showroom</span>
              </span>
            </div>
          </div>

          <div className="p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-white via-stone-50 to-white">
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  Exclusive Access
                </span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-stone-800 mb-1">Welcome Back</h3>
              <p className="text-stone-500 text-sm">Sign in to unlock exclusive offers</p>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-stone-100 px-2.5 py-1.5 rounded-full">
                  <benefit.icon className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-medium text-stone-600">{benefit.text}</span>
                </div>
              ))}
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg("");
                    }}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter email"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    className="w-full pl-11 pr-12 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <p className="text-center text-xs text-stone-500 mt-4">
              New to LM Showroom?{" "}
              <Link
                to="/register"
                onClick={closeLoginModal}
                className="text-primary hover:underline font-medium"
              >
                Create an account
              </Link>
            </p>

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

export default LoginModal;
