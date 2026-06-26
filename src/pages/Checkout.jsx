import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ChevronLeft, ShieldCheck, CheckCircle2, CreditCard, Smartphone,
  Truck, Clock, Award, Sparkles, MapPin, Phone, Mail, User, Home, Building,
  Tag, Percent, Gift, ArrowRight, AlertCircle, Calendar, Package
} from "lucide-react";
import { useShop } from "../ShopContext.jsx";
import { validateCoupon } from "@/services/couponService";
import { createPayment, verifyPayment } from "@/services/paymentService";
import { createAddress, updateAddress, getAddresses } from "@/services/addressService";
import { getCustomerProfile } from "@/services/customerAuthService";
import { getImageUrl } from "@/api/axiosClient";

const mapAddressToForm = (addr, customerEmail = "") => {
  const nameParts = String(addr.full_name || "").trim().split(" ");
  return {
    email: customerEmail,
    phone: addr.phone || "",
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    address: addr.address_line1 || "",
    apartment: addr.address_line2 || "",
    city: addr.city || "",
    state: addr.state || "",
    pincode: addr.pincode || "",
    country: addr.country || "India",
  };
};

const Checkout = () => {
  const { cart, clearCart, fetchCart, customer } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [saveInfo, setSaveInfo] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  // Trust badges
  const trustBadges = [
    { icon: ShieldCheck, title: "Secure", desc: "256-bit SSL" },
    { icon: Truck, title: "Free Shipping", desc: "Above ₹999" },
    { icon: Clock, title: "Easy Returns", desc: "7-day policy" },
    { icon: Award, title: "Authentic", desc: "100% genuine" }
  ];

  // Price Calculation Logic
  const getNumericPrice = (priceVal) => {
    if (typeof priceVal === 'number') return priceVal;
    if (!priceVal) return 0;
    const cleanString = String(priceVal).replace(/[^\d.]/g, ''); 
    return Number(cleanString) || 0;
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + getNumericPrice(item.price) * Number(item.qty || item.quantity || 1),
    0
  );
  const totalQuantity = cart.reduce(
    (sum, item) => sum + Number(item.qty || item.quantity || 1),
    0
  );
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal + shipping - discount);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (cart.length === 0) return;

    const checkoutState = location.state;
    if (checkoutState?.coupon_code) {
      setCouponCode(checkoutState.coupon_code);
      setDiscount(Number(checkoutState.discount_amount || 0));
      setCouponApplied(Boolean(checkoutState.coupon_code));
      setCouponMessage(checkoutState.coupon_message || "Coupon applied successfully!");
      setAppliedCoupon({
        coupon_id: checkoutState.coupon_id || null,
        coupon_code: checkoutState.coupon_code || "",
        coupon_type: checkoutState.coupon_type || "",
        coupon_value: checkoutState.coupon_value || 0,
        discount_amount: Number(checkoutState.discount_amount || 0),
      });
    }
  }, [location.state, cart.length]);

  useEffect(() => {
    const loadProfileAndAddresses = async () => {
      try {
        const profileRes = await getCustomerProfile();
        const profile = profileRes?.data ?? profileRes;
        let addresses = profile?.addresses || [];

        if (!addresses.length) {
          try {
            addresses = await getAddresses();
          } catch {
            addresses = [];
          }
        }

        setSavedAddresses(addresses);

        const defaultAddress =
          addresses.find((addr) => Number(addr.is_default) === 1) || addresses[0];

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setFormData(mapAddressToForm(defaultAddress, profile?.email || customer?.email || ""));
        } else if (profile || customer) {
          setFormData((prev) => ({
            ...prev,
            email: profile?.email || customer?.email || prev.email,
            phone: profile?.phone || customer?.phone || prev.phone,
            firstName: profile?.first_name || customer?.first_name || prev.firstName,
            lastName: profile?.last_name || customer?.last_name || prev.lastName,
          }));
        }
      } catch (error) {
        console.error("Load profile/addresses error:", error);
      }
    };

    loadProfileAndAddresses();
  }, [customer]);

  // Generate estimated delivery date
  useEffect(() => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setEstimatedDelivery(deliveryDate.toLocaleDateString('en-IN', options));
  }, []);

  const handleSelectAddress = (addressId) => {
    const addr = savedAddresses.find((item) => String(item.id) === String(addressId));
    if (!addr) return;
    setSelectedAddressId(addr.id);
    setFormData(mapAddressToForm(addr, formData.email || customer?.email || ""));
  };

  const resetCoupon = () => {
    setCouponApplied(false);
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!formData.phone) errors.phone = "Phone number is required";
    else if (formData.phone.length < 10) errors.phone = "Enter a valid 10-digit number";
    
    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.lastName) errors.lastName = "Last name is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.state) errors.state = "State is required";
    if (!formData.pincode) errors.pincode = "PIN code is required";
    else if (formData.pincode.length < 6) errors.pincode = "Enter a valid 6-digit PIN";
    
    return errors;
  };

  const applyCoupon = async () => {
    try {
      if (!couponCode.trim()) {
        alert("Please enter coupon code");
        return;
      }

      const result = await validateCoupon({
        code: couponCode.trim().toUpperCase(),
        order_amount: subtotal,
      });

      setAppliedCoupon(result);
      setDiscount(result.discount_amount);
      setCouponApplied(true);
      setCouponMessage(result.message || "Coupon applied successfully!");
    } catch (error) {
      console.error("Coupon apply error:", error);
      resetCoupon();
      alert(error.response?.data?.message || "Invalid coupon code");
    }
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const buildCheckoutPayload = (shippingName, shippingAddress, taxAmount) => ({
    shipping_name: shippingName,
    shipping_phone: formData.phone,
    shipping_address: shippingAddress,
    shipping_city: formData.city,
    shipping_state: formData.state,
    shipping_pincode: formData.pincode,
    shipping_country: formData.country || "India",
    billing_name: shippingName,
    billing_phone: formData.phone,
    billing_address: shippingAddress,
    billing_city: formData.city,
    billing_state: formData.state,
    billing_pincode: formData.pincode,
    billing_country: formData.country || "India",
    coupon_id: appliedCoupon?.coupon_id || null,
    coupon_code: appliedCoupon?.coupon_code || (couponApplied ? couponCode.trim().toUpperCase() : null),
    discount_amount: discount,
    subtotal,
    shipping_charge: shipping,
    tax_amount: taxAmount,
    total_amount: total,
  });

  const buildAddressPayload = () => ({
    address_type: "shipping",
    full_name: `${formData.firstName} ${formData.lastName}`.trim(),
    phone: formData.phone,
    address_line1: formData.address,
    address_line2: formData.apartment || null,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    country: formData.country || "India",
    is_default: saveInfo ? 1 : 0,
  });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const shippingName = `${formData.firstName} ${formData.lastName}`.trim();
    const shippingAddress = [formData.address, formData.apartment].filter(Boolean).join(", ");
    const taxAmount = 0;

    setPlacingOrder(true);

    try {
      if (saveInfo) {
        const addressPayload = buildAddressPayload();
        if (selectedAddressId) {
          await updateAddress(selectedAddressId, addressPayload);
        } else {
          await createAddress(addressPayload);
        }
        const refreshed = await getAddresses();
        setSavedAddresses(refreshed);
      }

      const checkoutPayload = buildCheckoutPayload(shippingName, shippingAddress, taxAmount);

      const paymentOrder = await createPayment({
        amount: total,
        currency: "INR",
        ...checkoutPayload,
      });

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Failed to load payment gateway. Please try again.");
      }

      await new Promise((resolve, reject) => {
        const options = {
          key: paymentOrder.key_id,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency || "INR",
          name: "LM Showroom",
          description: "Order Payment",
          order_id: paymentOrder.razorpay_order_id,
          prefill: {
            name: shippingName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: "#8B5E3C" },
          handler: async (response) => {
            try {
              const result = await verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                ...checkoutPayload,
              });

              await clearCart();

              navigate("/order-success", {
                replace: true,
                state: {
                  order: result.order,
                  items: result.items,
                  orderId: result.order?.id,
                },
              });
              resolve();
            } catch (verifyError) {
              reject(verifyError);
            }
          },
          modal: {
            ondismiss: () => {
              reject(new Error("Payment cancelled"));
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", (response) => {
          reject(new Error(response.error?.description || "Payment failed"));
        });
        razorpay.open();
      });
    } catch (error) {
      console.error("Checkout error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to process payment. Please try again.";
      if (message !== "Payment cancelled") {
        alert(message);
      }
    } finally {
      setPlacingOrder(false);
    }
  };
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50 pb-20 font-body">
      
      {/* Premium Header */}
      <div className="w-full bg-white border-b border-stone-200 py-5 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
          <Link to="/cart" className="flex items-center gap-2 text-stone-500 hover:text-primary transition-colors text-sm font-medium group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Cart
          </Link>
          
          <Link to="/" className="font-heading text-xl font-bold text-stone-800 tracking-widest">
            LM <span className="text-primary italic">Showroom</span>
          </Link>
          
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <ShieldCheck className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="container mx-auto px-4 max-w-7xl mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-stone-100">
              <badge.icon className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-stone-700">{badge.title}</p>
                <p className="text-[10px] text-stone-400">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-8">
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <span className="text-xs md:text-sm font-medium text-stone-700">Cart</span>
            </div>
            <div className="w-8 md:w-12 h-[1px] bg-stone-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <span className="text-xs md:text-sm font-medium text-primary">Checkout</span>
            </div>
            <div className="w-8 md:w-12 h-[1px] bg-stone-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-stone-200 text-stone-500 rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <span className="text-xs md:text-sm text-stone-400">Complete</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT SIDE: Checkout Form */}
          <div className="lg:col-span-7 w-full">
            <h2 className="font-heading text-2xl text-stone-800 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Delivery Details
            </h2>
            
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 space-y-4">
                <h3 className="font-heading text-lg text-stone-800 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                      placeholder="you@example.com" 
                      className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                        formErrors.email 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                          : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                      }`}
                      data-error={!!formErrors.email}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Phone</label>
                    <div className="flex gap-2">
                      <select className="w-20 bg-stone-50 border border-stone-200 rounded-xl px-2 py-3 text-sm focus:outline-none focus:border-primary">
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required 
                        placeholder="Phone number" 
                        className={`flex-1 bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                          formErrors.phone 
                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                            : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                        }`}
                        data-error={!!formErrors.phone}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 space-y-4">
                <h3 className="font-heading text-lg text-stone-800 mb-2 flex items-center gap-2">
                  <Home className="w-4 h-4 text-primary" />
                  Shipping Address
                </h3>

                {savedAddresses.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Saved Addresses
                    </label>
                    <select
                      value={selectedAddressId || ""}
                      onChange={(e) => handleSelectAddress(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="">Enter a new address</option>
                      {savedAddresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.full_name} - {addr.address_line1}, {addr.city}
                          {Number(addr.is_default) === 1 ? " (Default)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required 
                      placeholder="First Name" 
                      className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                        formErrors.firstName 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                          : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                      }`}
                      data-error={!!formErrors.firstName}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required 
                      placeholder="Last Name" 
                      className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                        formErrors.lastName 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                          : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                      }`}
                      data-error={!!formErrors.lastName}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Street Address</label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required 
                    placeholder="House No, Building, Street" 
                    className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                      formErrors.address 
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                        : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                    data-error={!!formErrors.address}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.address}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Apartment, suite, etc. (optional)</label>
                  <input 
                    type="text" 
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, unit, etc." 
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required 
                      placeholder="City" 
                      className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                        formErrors.city 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                          : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                      }`}
                      data-error={!!formErrors.city}
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.city}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">State</label>
                    <input 
                      type="text" 
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required 
                      placeholder="State" 
                      className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                        formErrors.state 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                          : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                      }`}
                      data-error={!!formErrors.state}
                    />
                    {formErrors.state && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.state}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">PIN Code</label>
                    <input 
                      type="text" 
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required 
                      placeholder="PIN Code" 
                      className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                        formErrors.pincode 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                          : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                      }`}
                      data-error={!!formErrors.pincode}
                    />
                    {formErrors.pincode && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.pincode}
                      </p>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input 
                    type="checkbox" 
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary/20" 
                  />
                  <span className="text-sm text-stone-600">Save this information for next time</span>
                </label>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 space-y-4">
                <h3 className="font-heading text-lg text-stone-800 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Payment Method
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 border-2 rounded-xl border-primary bg-primary/5 shadow-md">
                    <div className="p-2 rounded-full bg-primary/10">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm">UPI / Card / NetBanking</span>
                      <p className="text-xs text-stone-500">
                        Pay using GPay, PhonePe, Paytm, Visa, Mastercard, Debit/Credit Card
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-700 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    You will be redirected to our secure payment gateway to complete payment.
                  </p>
                </div>
              </div>

            </form>
          </div>

          {/* RIGHT SIDE: Order Summary */}
          <div className="lg:col-span-5 w-full lg:sticky lg:top-24">
            <div className="bg-white rounded-xl shadow-lg border border-stone-100 p-6">
              <h2 className="font-heading text-xl text-stone-800 mb-4 pb-4 border-b border-stone-100">
                Order Summary
              </h2>
              
              {/* Cart Items List */}
              <div className="space-y-4 mb-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <p className="text-stone-500 text-sm text-center py-4">Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartItemId || item.cart_id} className="flex gap-3 items-center">
                      <div className="relative shrink-0">
                        <img 
                          src={item.image ? getImageUrl(item.image) : ""} 
                          alt={item.name} 
                          className="w-14 h-16 object-cover rounded-lg border border-stone-200" 
                        />
                        <span className="absolute -top-2 -right-2 bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-md">
                          {item.qty || item.quantity || 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-stone-800 truncate">{item.name}</h4>
                        <p className="text-stone-500 text-xs">
                          Size: {item.size || "Free Size"}
                          {item.color ? ` • Color: ${item.color}` : ""}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-stone-800">
                        ₹{(getNumericPrice(item.price) * Number(item.qty || item.quantity || 1)).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Coupon Code */}
              <div className="mb-4 pb-4 border-b border-stone-100">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2 block">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      if (couponApplied) resetCoupon();
                    }}
                    placeholder="Enter code" 
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all uppercase"
                    disabled={couponApplied}
                  />
                  <button 
                    onClick={applyCoupon}
                    disabled={couponApplied || !couponCode}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      couponApplied 
                        ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {couponMessage || "Coupon applied successfully!"}
                  </p>
                )}
                <p className="text-stone-400 text-[10px] mt-2">
                  Enter valid coupon code from admin panel
                </p>
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-sm mb-4 pb-4 border-b border-stone-100">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      Discount
                    </span>
                    <span>-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <Truck className="w-3 h-3" /> Free
                    </span>
                  ) : (
                    <span>₹{shipping}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-heading text-lg text-stone-800">Total</span>
                <span className="font-heading text-2xl text-primary">₹{total.toLocaleString("en-IN")}</span>
              </div>

              {/* Delivery Info */}
              <div className="mb-6 p-3 bg-stone-50 rounded-xl">
                <p className="text-xs text-stone-600 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Estimated Delivery: <span className="font-medium">{estimatedDelivery}</span>
                </p>
              </div>

              {/* Submit Button */}
              <button 
                form="checkout-form"
                type="submit"
                disabled={placingOrder || cart.length === 0}
                className="w-full bg-primary text-white py-4 rounded-xl font-body text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {placingOrder ? "Processing Payment..." : `Pay ₹${total.toLocaleString("en-IN")}`} <ShieldCheck className="w-5 h-5" />
              </button>

              <p className="text-[10px] text-stone-400 text-center mt-4">
                By placing your order, you agree to our Terms & Conditions and Privacy Policy.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;


// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { 
//   ChevronLeft, ShieldCheck, CheckCircle2, Banknote, CreditCard, Smartphone,
//   Truck, Clock, Award, Sparkles, MapPin, Phone, Mail, User, Home, Building,
//   Tag, Percent, Gift, ArrowRight, AlertCircle, Calendar, Package
// } from "lucide-react";
// import { useShop } from "../ShopContext.jsx";
// import { validateCoupon } from "@/services/couponService";
// import { checkoutOrder } from "@/services/orderService";
// import { createAddress, updateAddress, getAddresses } from "@/services/addressService";
// import { getCustomerProfile } from "@/services/customerAuthService";
// import { getImageUrl } from "@/api/axiosClient";

// const mapAddressToForm = (addr, customerEmail = "") => {
//   const nameParts = String(addr.full_name || "").trim().split(" ");
//   return {
//     email: customerEmail,
//     phone: addr.phone || "",
//     firstName: nameParts[0] || "",
//     lastName: nameParts.slice(1).join(" ") || "",
//     address: addr.address_line1 || "",
//     apartment: addr.address_line2 || "",
//     city: addr.city || "",
//     state: addr.state || "",
//     pincode: addr.pincode || "",
//     country: addr.country || "India",
//   };
// };

// const Checkout = () => {
//   const { cart, clearCart, fetchCart, customer } = useShop();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [paymentMethod, setPaymentMethod] = useState("cod");
//   const [saveInfo, setSaveInfo] = useState(false);
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const [savedAddresses, setSavedAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [couponCode, setCouponCode] = useState("");
//   const [couponApplied, setCouponApplied] = useState(false);
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [discount, setDiscount] = useState(0);
//   const [couponMessage, setCouponMessage] = useState("");
//   const [estimatedDelivery, setEstimatedDelivery] = useState("");
//   const [formErrors, setFormErrors] = useState({});
//   const [formData, setFormData] = useState({
//     email: "",
//     phone: "",
//     firstName: "",
//     lastName: "",
//     address: "",
//     apartment: "",
//     city: "",
//     state: "",
//     pincode: "",
//     country: "India"
//   });

//   // Trust badges
//   const trustBadges = [
//     { icon: ShieldCheck, title: "Secure", desc: "256-bit SSL" },
//     { icon: Truck, title: "Free Shipping", desc: "Above ₹999" },
//     { icon: Clock, title: "Easy Returns", desc: "7-day policy" },
//     { icon: Award, title: "Authentic", desc: "100% genuine" }
//   ];

//   // Price Calculation Logic
//   const getNumericPrice = (priceVal) => {
//     if (typeof priceVal === 'number') return priceVal;
//     if (!priceVal) return 0;
//     const cleanString = String(priceVal).replace(/[^\d.]/g, ''); 
//     return Number(cleanString) || 0;
//   };

//   const subtotal = cart.reduce(
//     (sum, item) =>
//       sum + getNumericPrice(item.price) * Number(item.qty || item.quantity || 1),
//     0
//   );
//   const totalQuantity = cart.reduce(
//     (sum, item) => sum + Number(item.qty || item.quantity || 1),
//     0
//   );
//   const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
//   const total = Math.max(0, subtotal + shipping - discount);

//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   useEffect(() => {
//     if (cart.length === 0) return;

//     const checkoutState = location.state;
//     if (checkoutState?.coupon_code) {
//       setCouponCode(checkoutState.coupon_code);
//       setDiscount(Number(checkoutState.discount_amount || 0));
//       setCouponApplied(Boolean(checkoutState.coupon_code));
//       setCouponMessage(checkoutState.coupon_message || "Coupon applied successfully!");
//       setAppliedCoupon({
//         coupon_id: checkoutState.coupon_id || null,
//         coupon_code: checkoutState.coupon_code || "",
//         coupon_type: checkoutState.coupon_type || "",
//         coupon_value: checkoutState.coupon_value || 0,
//         discount_amount: Number(checkoutState.discount_amount || 0),
//       });
//     }
//   }, [location.state, cart.length]);

//   useEffect(() => {
//     const loadProfileAndAddresses = async () => {
//       try {
//         const profileRes = await getCustomerProfile();
//         const profile = profileRes?.data ?? profileRes;
//         let addresses = profile?.addresses || [];

//         if (!addresses.length) {
//           try {
//             addresses = await getAddresses();
//           } catch {
//             addresses = [];
//           }
//         }

//         setSavedAddresses(addresses);

//         const defaultAddress =
//           addresses.find((addr) => Number(addr.is_default) === 1) || addresses[0];

//         if (defaultAddress) {
//           setSelectedAddressId(defaultAddress.id);
//           setFormData(mapAddressToForm(defaultAddress, profile?.email || customer?.email || ""));
//         } else if (profile || customer) {
//           setFormData((prev) => ({
//             ...prev,
//             email: profile?.email || customer?.email || prev.email,
//             phone: profile?.phone || customer?.phone || prev.phone,
//             firstName: profile?.first_name || customer?.first_name || prev.firstName,
//             lastName: profile?.last_name || customer?.last_name || prev.lastName,
//           }));
//         }
//       } catch (error) {
//         console.error("Load profile/addresses error:", error);
//       }
//     };

//     loadProfileAndAddresses();
//   }, [customer]);

//   // Generate estimated delivery date
//   useEffect(() => {
//     const today = new Date();
//     const deliveryDate = new Date(today);
//     deliveryDate.setDate(today.getDate() + 5);
//     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//     setEstimatedDelivery(deliveryDate.toLocaleDateString('en-IN', options));
//   }, []);

//   const handleSelectAddress = (addressId) => {
//     const addr = savedAddresses.find((item) => String(item.id) === String(addressId));
//     if (!addr) return;
//     setSelectedAddressId(addr.id);
//     setFormData(mapAddressToForm(addr, formData.email || customer?.email || ""));
//   };

//   const resetCoupon = () => {
//     setCouponApplied(false);
//     setAppliedCoupon(null);
//     setDiscount(0);
//     setCouponMessage("");
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     // Clear error for this field
//     if (formErrors[name]) {
//       setFormErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.email) errors.email = "Email is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       errors.email = "Please enter a valid email";
//     }
    
//     if (!formData.phone) errors.phone = "Phone number is required";
//     else if (formData.phone.length < 10) errors.phone = "Enter a valid 10-digit number";
    
//     if (!formData.firstName) errors.firstName = "First name is required";
//     if (!formData.lastName) errors.lastName = "Last name is required";
//     if (!formData.address) errors.address = "Address is required";
//     if (!formData.city) errors.city = "City is required";
//     if (!formData.state) errors.state = "State is required";
//     if (!formData.pincode) errors.pincode = "PIN code is required";
//     else if (formData.pincode.length < 6) errors.pincode = "Enter a valid 6-digit PIN";
    
//     return errors;
//   };

//   const applyCoupon = async () => {
//     try {
//       if (!couponCode.trim()) {
//         alert("Please enter coupon code");
//         return;
//       }

//       const result = await validateCoupon({
//         code: couponCode.trim().toUpperCase(),
//         order_amount: subtotal,
//       });

//       setAppliedCoupon(result);
//       setDiscount(result.discount_amount);
//       setCouponApplied(true);
//       setCouponMessage(result.message || "Coupon applied successfully!");
//     } catch (error) {
//       console.error("Coupon apply error:", error);
//       resetCoupon();
//       alert(error.response?.data?.message || "Invalid coupon code");
//     }
//   };

//   const buildAddressPayload = () => ({
//     address_type: "shipping",
//     full_name: `${formData.firstName} ${formData.lastName}`.trim(),
//     phone: formData.phone,
//     address_line1: formData.address,
//     address_line2: formData.apartment || null,
//     city: formData.city,
//     state: formData.state,
//     pincode: formData.pincode,
//     country: formData.country || "India",
//     is_default: saveInfo ? 1 : 0,
//   });

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();
    
//     if (cart.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       const firstError = document.querySelector('[data-error="true"]');
//       if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       return;
//     }

//     const shippingName = `${formData.firstName} ${formData.lastName}`.trim();
//     const shippingAddress = [formData.address, formData.apartment].filter(Boolean).join(", ");
//     const taxAmount = 0;

//     setPlacingOrder(true);

//     try {
//       if (saveInfo) {
//         const addressPayload = buildAddressPayload();
//         if (selectedAddressId) {
//           await updateAddress(selectedAddressId, addressPayload);
//         } else {
//           await createAddress(addressPayload);
//         }
//         const refreshed = await getAddresses();
//         setSavedAddresses(refreshed);
//       }

//       const result = await checkoutOrder({
//         shipping_name: shippingName,
//         shipping_phone: formData.phone,
//         shipping_address: shippingAddress,
//         shipping_city: formData.city,
//         shipping_state: formData.state,
//         shipping_pincode: formData.pincode,
//         shipping_country: formData.country || "India",
//         billing_name: shippingName,
//         billing_phone: formData.phone,
//         billing_address: shippingAddress,
//         billing_city: formData.city,
//         billing_state: formData.state,
//         billing_pincode: formData.pincode,
//         billing_country: formData.country || "India",
//         payment_method: paymentMethod,
//         coupon_id: appliedCoupon?.coupon_id || null,
//         coupon_code: appliedCoupon?.coupon_code || (couponApplied ? couponCode.trim().toUpperCase() : null),
//         discount_amount: discount,
//         subtotal,
//         shipping_charge: shipping,
//         tax_amount: taxAmount,
//         total_amount: total,
//       });

//       await clearCart();

//       navigate("/order-success", {
//         replace: true,
//         state: {
//           order: result.order,
//           items: result.items,
//           orderId: result.order?.id,
//         },
//       });
//     } catch (error) {
//       console.error("Checkout error:", error);
//       alert(error.response?.data?.message || "Failed to place order. Please try again.");
//     } finally {
//       setPlacingOrder(false);
//     }
//   };
//   return (
//     <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50 pb-20 font-body">
      
//       {/* Premium Header */}
//       <div className="w-full bg-white border-b border-stone-200 py-5 sticky top-0 z-30 shadow-sm">
//         <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
//           <Link to="/cart" className="flex items-center gap-2 text-stone-500 hover:text-primary transition-colors text-sm font-medium group">
//             <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
//             Back to Cart
//           </Link>
          
//           <Link to="/" className="font-heading text-xl font-bold text-stone-800 tracking-widest">
//             LM <span className="text-primary italic">Showroom</span>
//           </Link>
          
//           <div className="flex items-center gap-2 text-green-600 font-medium">
//             <ShieldCheck className="w-5 h-5" />
//             <span className="hidden sm:inline text-sm">Secure Checkout</span>
//           </div>
//         </div>
//       </div>

//       {/* Trust Badges */}
//       <div className="container mx-auto px-4 max-w-7xl mt-6">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           {trustBadges.map((badge, idx) => (
//             <div key={idx} className="flex items-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-stone-100">
//               <badge.icon className="w-4 h-4 text-primary flex-shrink-0" />
//               <div>
//                 <p className="text-xs font-medium text-stone-700">{badge.title}</p>
//                 <p className="text-[10px] text-stone-400">{badge.desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="container mx-auto px-4 max-w-7xl mt-8">
        
//         {/* Progress Steps */}
//         <div className="flex items-center justify-center mb-8">
//           <div className="flex items-center gap-2 md:gap-4">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
//               <span className="text-xs md:text-sm font-medium text-stone-700">Cart</span>
//             </div>
//             <div className="w-8 md:w-12 h-[1px] bg-stone-300"></div>
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
//               <span className="text-xs md:text-sm font-medium text-primary">Checkout</span>
//             </div>
//             <div className="w-8 md:w-12 h-[1px] bg-stone-300"></div>
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-stone-200 text-stone-500 rounded-full flex items-center justify-center text-xs font-bold">3</div>
//               <span className="text-xs md:text-sm text-stone-400">Complete</span>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
//           {/* LEFT SIDE: Checkout Form */}
//           <div className="lg:col-span-7 w-full">
//             <h2 className="font-heading text-2xl text-stone-800 mb-6 flex items-center gap-2">
//               <MapPin className="w-5 h-5 text-primary" />
//               Delivery Details
//             </h2>
            
//             <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              
//               {/* Contact Info */}
//               <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 space-y-4">
//                 <h3 className="font-heading text-lg text-stone-800 mb-2 flex items-center gap-2">
//                   <Mail className="w-4 h-4 text-primary" />
//                   Contact Information
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Email</label>
//                     <input 
//                       type="email" 
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required 
//                       placeholder="you@example.com" 
//                       className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
//                         formErrors.email 
//                           ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
//                           : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
//                       }`}
//                       data-error={!!formErrors.email}
//                     />
//                     {formErrors.email && (
//                       <p className="text-red-500 text-xs flex items-center gap-1">
//                         <AlertCircle className="w-3 h-3" /> {formErrors.email}
//                       </p>
//                     )}
//                   </div>
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Phone</label>
//                     <div className="flex gap-2">
//                       <select className="w-20 bg-stone-50 border border-stone-200 rounded-xl px-2 py-3 text-sm focus:outline-none focus:border-primary">
//                         <option value="+91">+91</option>
//                         <option value="+1">+1</option>
//                         <option value="+44">+44</option>
//                       </select>
//                       <input 
//                         type="tel" 
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         required 
//                         placeholder="Phone number" 
//                         className={`flex-1 bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
//                           formErrors.phone 
//                             ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
//                             : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
//                         }`}
//                         data-error={!!formErrors.phone}
//                       />
//                     </div>
//                     {formErrors.phone && (
//                       <p className="text-red-500 text-xs flex items-center gap-1">
//                         <AlertCircle className="w-3 h-3" /> {formErrors.phone}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 space-y-4">
//                 <h3 className="font-heading text-lg text-stone-800 mb-2 flex items-center gap-2">
//                   <Home className="w-4 h-4 text-primary" />
//                   Shipping Address
//                 </h3>

//                 {savedAddresses.length > 0 && (
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
//                       Saved Addresses
//                     </label>
//                     <select
//                       value={selectedAddressId || ""}
//                       onChange={(e) => handleSelectAddress(e.target.value)}
//                       className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
//                     >
//                       <option value="">Enter a new address</option>
//                       {savedAddresses.map((addr) => (
//                         <option key={addr.id} value={addr.id}>
//                           {addr.full_name} - {addr.address_line1}, {addr.city}
//                           {Number(addr.is_default) === 1 ? " (Default)" : ""}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">First Name</label>
//                     <input 
//                       type="text" 
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       required 
//                       placeholder="First Name" 
//                       className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
//                         formErrors.firstName 
//                           ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
//                           : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
//                       }`}
//                       data-error={!!formErrors.firstName}
//                     />
//                     {formErrors.firstName && (
//                       <p className="text-red-500 text-xs flex items-center gap-1">
//                         <AlertCircle className="w-3 h-3" /> {formErrors.firstName}
//                       </p>
//                     )}
//                   </div>
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Last Name</label>
//                     <input 
//                       type="text" 
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       required 
//                       placeholder="Last Name" 
//                       className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
//                         formErrors.lastName 
//                           ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
//                           : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
//                       }`}
//                       data-error={!!formErrors.lastName}
//                     />
//                     {formErrors.lastName && (
//                       <p className="text-red-500 text-xs flex items-center gap-1">
//                         <AlertCircle className="w-3 h-3" /> {formErrors.lastName}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Street Address</label>
//                   <input 
//                     type="text" 
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     required 
//                     placeholder="House No, Building, Street" 
//                     className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
//                       formErrors.address 
//                         ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
//                         : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
//                     }`}
//                     data-error={!!formErrors.address}
//                   />
//                   {formErrors.address && (
//                     <p className="text-red-500 text-xs flex items-center gap-1">
//                       <AlertCircle className="w-3 h-3" /> {formErrors.address}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Apartment, suite, etc. (optional)</label>
//                   <input 
//                     type="text" 
//                     name="apartment"
//                     value={formData.apartment}
//                     onChange={handleInputChange}
//                     placeholder="Apartment, suite, unit, etc." 
//                     className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">City</label>
//                     <input 
//                       type="text" 
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       required 
//                       placeholder="City" 
//                       className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
//                         formErrors.city 
//                           ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
//                           : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
//                       }`}
//                       data-error={!!formErrors.city}
//                     />
//                     {formErrors.city && (
//                       <p className="text-red-500 text-xs flex items-center gap-1">
//                         <AlertCircle className="w-3 h-3" /> {formErrors.city}
//                       </p>
//                     )}
//                   </div>
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">State</label>
//                     <input 
//                       type="text" 
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       required 
//                       placeholder="State" 
//                       className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
//                         formErrors.state 
//                           ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
//                           : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
//                       }`}
//                       data-error={!!formErrors.state}
//                     />
//                     {formErrors.state && (
//                       <p className="text-red-500 text-xs flex items-center gap-1">
//                         <AlertCircle className="w-3 h-3" /> {formErrors.state}
//                       </p>
//                     )}
//                   </div>
//                   <div className="space-y-1.5 col-span-2 md:col-span-1">
//                     <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">PIN Code</label>
//                     <input 
//                       type="text" 
//                       name="pincode"
//                       value={formData.pincode}
//                       onChange={handleInputChange}
//                       required 
//                       placeholder="PIN Code" 
//                       className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
//                         formErrors.pincode 
//                           ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
//                           : 'border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
//                       }`}
//                       data-error={!!formErrors.pincode}
//                     />
//                     {formErrors.pincode && (
//                       <p className="text-red-500 text-xs flex items-center gap-1">
//                         <AlertCircle className="w-3 h-3" /> {formErrors.pincode}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <label className="flex items-center gap-2 cursor-pointer pt-2">
//                   <input 
//                     type="checkbox" 
//                     checked={saveInfo}
//                     onChange={(e) => setSaveInfo(e.target.checked)}
//                     className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary/20" 
//                   />
//                   <span className="text-sm text-stone-600">Save this information for next time</span>
//                 </label>
//               </div>

//               {/* Payment Method */}
//               <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 space-y-4">
//                 <h3 className="font-heading text-lg text-stone-800 mb-2 flex items-center gap-2">
//                   <CreditCard className="w-4 h-4 text-primary" />
//                   Payment Method
//                 </h3>
//                 <div className="space-y-3">
                  
//                   <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
//                     paymentMethod === 'cod' 
//                       ? 'border-primary bg-primary/5 shadow-md' 
//                       : 'border-stone-200 hover:border-primary/50'
//                   }`}>
//                     <input 
//                       type="radio" 
//                       name="payment" 
//                       value="cod" 
//                       checked={paymentMethod === 'cod'} 
//                       onChange={() => setPaymentMethod('cod')} 
//                       className="w-4 h-4 text-primary accent-primary" 
//                     />
//                     <div className={`p-2 rounded-full ${paymentMethod === 'cod' ? 'bg-primary/10' : 'bg-stone-100'}`}>
//                       <Banknote className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-primary' : 'text-stone-500'}`} />
//                     </div>
//                     <div className="flex-1">
//                       <span className="font-medium text-sm">Cash on Delivery (COD)</span>
//                       <p className="text-xs text-stone-500">Pay when you receive your order</p>
//                     </div>
//                     {paymentMethod === 'cod' && (
//                       <CheckCircle2 className="w-5 h-5 text-primary" />
//                     )}
//                   </label>

//                   <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
//                     paymentMethod === 'online' 
//                       ? 'border-primary bg-primary/5 shadow-md' 
//                       : 'border-stone-200 hover:border-primary/50'
//                   }`}>
//                     <input 
//                       type="radio" 
//                       name="payment" 
//                       value="online" 
//                       checked={paymentMethod === 'online'} 
//                       onChange={() => setPaymentMethod('online')} 
//                       className="w-4 h-4 text-primary accent-primary" 
//                     />
//                     <div className={`p-2 rounded-full ${paymentMethod === 'online' ? 'bg-primary/10' : 'bg-stone-100'}`}>
//                       <CreditCard className={`w-5 h-5 ${paymentMethod === 'online' ? 'text-primary' : 'text-stone-500'}`} />
//                     </div>
//                     <div className="flex-1">
//                       <span className="font-medium text-sm">Credit Card / UPI / NetBanking</span>
//                       <p className="text-xs text-stone-500">All major payment methods accepted</p>
//                     </div>
//                     {paymentMethod === 'online' && (
//                       <CheckCircle2 className="w-5 h-5 text-primary" />
//                     )}
//                   </label>

//                 </div>

//                 {paymentMethod === 'online' && (
//                   <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
//                     <p className="text-xs text-blue-700 flex items-center gap-2">
//                       <Smartphone className="w-4 h-4" />
//                       You will be redirected to our secure payment gateway after placing the order.
//                     </p>
//                   </div>
//                 )}
//               </div>

//             </form>
//           </div>

//           {/* RIGHT SIDE: Order Summary */}
//           <div className="lg:col-span-5 w-full lg:sticky lg:top-24">
//             <div className="bg-white rounded-xl shadow-lg border border-stone-100 p-6">
//               <h2 className="font-heading text-xl text-stone-800 mb-4 pb-4 border-b border-stone-100">
//                 Order Summary
//               </h2>
              
//               {/* Cart Items List */}
//               <div className="space-y-4 mb-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
//                 {cart.length === 0 ? (
//                   <p className="text-stone-500 text-sm text-center py-4">Your cart is empty.</p>
//                 ) : (
//                   cart.map((item) => (
//                     <div key={item.cartItemId || item.cart_id} className="flex gap-3 items-center">
//                       <div className="relative shrink-0">
//                         <img 
//                           src={item.image ? getImageUrl(item.image) : ""} 
//                           alt={item.name} 
//                           className="w-14 h-16 object-cover rounded-lg border border-stone-200" 
//                         />
//                         <span className="absolute -top-2 -right-2 bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-md">
//                           {item.qty || item.quantity || 1}
//                         </span>
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-medium text-sm text-stone-800 truncate">{item.name}</h4>
//                         <p className="text-stone-500 text-xs">
//                           Size: {item.size || "Free Size"}
//                           {item.color ? ` • Color: ${item.color}` : ""}
//                         </p>
//                       </div>
//                       <div className="text-sm font-semibold text-stone-800">
//                         ₹{(getNumericPrice(item.price) * Number(item.qty || item.quantity || 1)).toLocaleString("en-IN")}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>

//               {/* Coupon Code */}
//               <div className="mb-4 pb-4 border-b border-stone-100">
//                 <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2 block">
//                   Coupon Code
//                 </label>
//                 <div className="flex gap-2">
//                   <input 
//                     type="text" 
//                     value={couponCode}
//                     onChange={(e) => {
//                       setCouponCode(e.target.value);
//                       if (couponApplied) resetCoupon();
//                     }}
//                     placeholder="Enter code" 
//                     className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all uppercase"
//                     disabled={couponApplied}
//                   />
//                   <button 
//                     onClick={applyCoupon}
//                     disabled={couponApplied || !couponCode}
//                     className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
//                       couponApplied 
//                         ? 'bg-green-100 text-green-700 cursor-not-allowed' 
//                         : 'bg-primary text-white hover:bg-primary/90'
//                     }`}
//                   >
//                     {couponApplied ? 'Applied' : 'Apply'}
//                   </button>
//                 </div>
//                 {couponApplied && (
//                   <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
//                     <CheckCircle2 className="w-3 h-3" />
//                     {couponMessage || "Coupon applied successfully!"}
//                   </p>
//                 )}
//                 <p className="text-stone-400 text-[10px] mt-2">
//                   Enter valid coupon code from admin panel
//                 </p>
//               </div>

//               {/* Price Calculation */}
//               <div className="space-y-2 text-sm mb-4 pb-4 border-b border-stone-100">
//                 <div className="flex justify-between text-stone-600">
//                   <span>Subtotal ({totalQuantity} items)</span>
//                   <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
//                 </div>
//                 {discount > 0 && (
//                   <div className="flex justify-between text-green-600">
//                     <span className="flex items-center gap-1">
//                       <Percent className="w-3 h-3" />
//                       Discount
//                     </span>
//                     <span>-₹{discount.toLocaleString("en-IN")}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between text-stone-600">
//                   <span>Shipping</span>
//                   {shipping === 0 ? (
//                     <span className="text-green-600 font-medium flex items-center gap-1">
//                       <Truck className="w-3 h-3" /> Free
//                     </span>
//                   ) : (
//                     <span>₹{shipping}</span>
//                   )}
//                 </div>
//               </div>

//               <div className="flex justify-between items-center mb-6">
//                 <span className="font-heading text-lg text-stone-800">Total</span>
//                 <span className="font-heading text-2xl text-primary">₹{total.toLocaleString("en-IN")}</span>
//               </div>

//               {/* Delivery Info */}
//               <div className="mb-6 p-3 bg-stone-50 rounded-xl">
//                 <p className="text-xs text-stone-600 flex items-center gap-2">
//                   <Calendar className="w-3.5 h-3.5 text-primary" />
//                   Estimated Delivery: <span className="font-medium">{estimatedDelivery}</span>
//                 </p>
//               </div>

//               {/* Submit Button */}
//               <button 
//                 form="checkout-form"
//                 type="submit"
//                 disabled={placingOrder || cart.length === 0}
//                 className="w-full bg-primary text-white py-4 rounded-xl font-body text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {placingOrder ? "Placing Order..." : "Complete Order"} <ShieldCheck className="w-5 h-5" />
//               </button>

//               <p className="text-[10px] text-stone-400 text-center mt-4">
//                 By placing your order, you agree to our Terms & Conditions and Privacy Policy.
//               </p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;