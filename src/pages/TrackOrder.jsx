import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  PackageSearch, CheckCircle, Truck, MapPin, Search, Sparkles,
  Clock, Shield, Award, Calendar, ChevronRight, XCircle,
  ArrowRight, ShoppingBag, HelpCircle, Phone, Mail, Globe,
  Share2, Download
} from "lucide-react";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  // Load recent tracked orders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentTrackedOrders");
    if (saved) {
      setRecentOrders(JSON.parse(saved).slice(0, 3));
    }
  }, []);

  const saveToRecent = (orderData) => {
    const recent = JSON.parse(localStorage.getItem("recentTrackedOrders") || "[]");
    const updated = [orderData, ...recent.filter(o => o.orderId !== orderData.orderId)].slice(0, 5);
    localStorage.setItem("recentTrackedOrders", JSON.stringify(updated));
    setRecentOrders(updated.slice(0, 3));
  };

  const handleTrack = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null); 

    setTimeout(() => {
      setLoading(false);
      const orderResult = {
        orderId: orderId.toUpperCase() || `LM${Math.floor(100000 + Math.random() * 900000)}`,
        status: "In Transit",
        expectedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        }),
        courier: "Delhivery Express",
        trackingNumber: `DLV${Math.floor(10000000 + Math.random() * 90000000)}`,
        timeline: [
          { title: "Order Confirmed", date: getRelativeDate(-3), time: "10:00 AM", done: true, desc: "We have received your order.", icon: CheckCircle },
          { title: "Packed & Ready", date: getRelativeDate(-2), time: "04:30 PM", done: true, desc: "Your item has been packed safely.", icon: PackageSearch },
          { title: "Shipped", date: getRelativeDate(-1), time: "09:15 AM", done: true, desc: "Handed over to our delivery partner.", icon: Truck },
          { title: "In Transit", date: getRelativeDate(0), time: "11:00 AM", done: true, desc: "Package has arrived at the nearest hub.", icon: Globe },
          { title: "Out for Delivery", date: "Pending", time: "", done: false, desc: "Delivery executive will contact you soon.", icon: MapPin },
          { title: "Delivered", date: "Pending", time: "", done: false, desc: "Package delivered to the customer.", icon: CheckCircle },
        ]
      };
      setResult(orderResult);
      saveToRecent({ orderId: orderResult.orderId, status: orderResult.status, date: orderResult.expectedDate });
    }, 1500);
  };

  const getRelativeDate = (daysOffset) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return "bg-green-500";
      case "In Transit": return "bg-blue-500";
      case "Out for Delivery": return "bg-orange-500";
      case "Shipped": return "bg-purple-500";
      default: return "bg-stone-500";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Delivered": return CheckCircle;
      case "In Transit": return Truck;
      case "Out for Delivery": return MapPin;
      case "Shipped": return PackageSearch;
      default: return Clock;
    }
  };

  const quickTrackOrder = (orderId) => {
    setOrderId(orderId);
    setEmail("customer@example.com");
    setTimeout(() => handleTrack(new Event('submit')), 100);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50 font-body">
      
      {/* ======================================================= */}
      {/* 🌟 PREMIUM HERO HEADER */}
      {/* ======================================================= */}
      <div className="relative w-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 py-16 md:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Animated Gradients */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-3 h-3 text-primary" />
            Real-Time Tracking
            <Sparkles className="w-3 h-3 text-primary" />
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-4 tracking-tight">
            Track Your <span className="text-primary italic">Order</span>
          </h1>
          <p className="font-body text-gray-200 text-sm md:text-base max-w-2xl mx-auto">
            Enter your Order ID and Email Address to track your shipment in real-time
          </p>
        </div>
      </div>

      {/* ======================================================= */}
      {/* TRUST BADGES */}
      {/* ======================================================= */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-stone-100">
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Shield, title: "Secure Tracking", desc: "256-bit encrypted" },
                { icon: Clock, title: "24/7 Updates", desc: "Real-time status" },
                { icon: Award, title: "100% Reliable", desc: "Accurate information" }
              ].map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="p-2 bg-primary/10 rounded-full mb-2">
                    <badge.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">{badge.title}</h4>
                  <p className="text-[10px] text-stone-400">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-12">
        
        {/* Recent Orders Quick Track */}
        {recentOrders.length > 0 && !result && (
          <div className="mb-8">
            <h3 className="font-heading text-lg text-stone-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recently Tracked
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentOrders.map((order, idx) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <button
                    key={idx}
                    onClick={() => quickTrackOrder(order.orderId)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 hover:shadow-md hover:border-primary/50 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-bold text-stone-800">#{order.orderId}</span>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{order.status}</span>
                    </div>
                    <p className="text-[10px] text-stone-400">Expected: {order.date}</p>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-primary group-hover:translate-x-1 transition-all mt-2" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 🌟 SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* 📝 LEFT COLUMN: FORM */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-8 lg:sticky lg:top-24">
              <h2 className="font-heading text-2xl text-stone-800 mb-6 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Find Your Order
              </h2>
              
              <form onSubmit={handleTrack} className="space-y-5">
                
                {/* Order ID Input */}
                <div className="space-y-1.5">
                  <label className="font-body text-sm font-medium text-stone-700 flex items-center gap-2">
                    <PackageSearch className="w-4 h-4 text-stone-400" />
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. LM123456"
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="font-body text-sm font-medium text-stone-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-stone-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email used at checkout"
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-primary text-white flex items-center justify-center gap-2 px-8 py-4 mt-6 rounded-xl font-body font-medium transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] ${loading ? 'opacity-70 cursor-wait' : 'hover:bg-primary/90'}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      Track Status <Search className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Help Links */}
              <div className="mt-6 pt-6 border-t border-stone-100">
                <p className="text-xs text-stone-500 mb-3">Need help with your order?</p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/contact" className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Contact Support
                  </Link>
                  <Link to="/faq" className="text-xs text-primary hover:underline flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> FAQ
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 🚚 RIGHT COLUMN: RESULT / TIMELINE */}
          <div className="lg:col-span-7 w-full h-full">
            
            {/* Empty State */}
            {!result && !loading && (
              <div className="h-full min-h-[450px] flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-stone-100 p-10 text-center">
                <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-12 h-12 text-stone-300" />
                </div>
                <h3 className="font-heading text-2xl text-stone-800 mb-2">Track Your Package</h3>
                <p className="text-stone-500 text-sm max-w-sm">
                  Enter your Order ID and Email Address to see real-time delivery updates and timeline.
                </p>
                
                {/* Example Order IDs */}
                <div className="mt-6 p-4 bg-stone-50 rounded-xl">
                  <p className="text-xs text-stone-500 mb-2">Try these demo orders:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['LM123456', 'LM789012', 'LM345678'].map((id) => (
                      <button
                        key={id}
                        onClick={() => quickTrackOrder(id)}
                        className="text-xs bg-white px-3 py-1.5 rounded-full border border-stone-200 hover:border-primary hover:text-primary transition"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="h-full min-h-[450px] flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-stone-100 p-10">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-stone-100 border-t-primary rounded-full animate-spin"></div>
                  <PackageSearch className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
                </div>
                <p className="font-body text-sm text-stone-500 mt-6 animate-pulse">Fetching your order details...</p>
                <p className="text-xs text-stone-400 mt-2">This will only take a moment</p>
              </div>
            )}

            {/* Result Display */}
            {result && !loading && (
              <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Result Header */}
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-6 border-b border-stone-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">Order Number</p>
                      <h3 className="font-heading text-2xl text-stone-800 font-mono">{result.orderId}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <div className={`flex items-center gap-1.5 ${getStatusColor(result.status).replace('bg-', 'text-')}`}>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(result.status)} animate-pulse`}></div>
                          <span className="text-xs font-medium">{result.status}</span>
                        </div>
                        <span className="text-xs text-stone-400">•</span>
                        <span className="text-xs text-stone-500">Tracking: {result.trackingNumber}</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-stone-100">
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-0.5">Expected Delivery</p>
                      <p className="font-semibold text-primary text-sm flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {result.expectedDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Courier Info */}
                <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <Truck className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-500">Shipping Partner</p>
                        <p className="text-sm font-medium text-stone-800">{result.courier}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white rounded-lg transition" title="Share Tracking">
                        <Share2 className="w-4 h-4 text-stone-400" />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg transition" title="Download Details">
                        <Download className="w-4 h-4 text-stone-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="px-6 py-6">
                  <h4 className="font-heading text-sm text-stone-800 mb-6 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Delivery Timeline
                  </h4>

                  <div className="space-y-6 pl-2">
                    {result.timeline.map((step, index) => {
                      const IconComponent = step.icon;
                      return (
                        <div key={index} className="flex gap-5 relative">
                          
                          {/* Vertical Line */}
                          {index !== result.timeline.length - 1 && (
                            <div className={`absolute left-[13px] top-8 bottom-[-24px] w-[2px] ${
                              step.done ? 'bg-primary' : 'bg-stone-200'
                            }`}></div>
                          )}
                          
                          {/* Status Icon */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${
                            step.done 
                              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                              : 'bg-stone-100 border-2 border-stone-200'
                          }`}>
                            {step.done ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <IconComponent className="w-3.5 h-3.5 text-stone-400" />
                            )}
                          </div>
                          
                          {/* Step Details */}
                          <div className="flex-1 pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className={`font-body text-sm ${
                                  step.done ? 'font-bold text-stone-800' : 'font-medium text-stone-500'
                                }`}>
                                  {step.title}
                                </p>
                                <p className={`text-xs mt-0.5 ${
                                  step.done ? 'text-stone-500' : 'text-stone-400'
                                }`}>
                                  {step.desc}
                                </p>
                              </div>
                              {step.date !== "Pending" && (
                                <div className="text-right">
                                  <p className="text-xs font-medium text-stone-600">{step.date}</p>
                                  {step.time && (
                                    <p className="text-[10px] text-stone-400">{step.time}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex flex-wrap gap-3">
                  <Link 
                    to="/shop" 
                    className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Continue Shopping
                  </Link>
                  <button className="px-6 py-3 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:border-primary hover:text-primary transition flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" /> Need Help?
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for relative dates
const getRelativeDate = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

export default TrackOrder;