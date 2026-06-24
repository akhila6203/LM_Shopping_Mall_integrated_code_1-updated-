import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Package, 
  ChevronRight, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar, 
  MapPin, 
  CreditCard,
  Receipt,
  Download,
  Star,
  ShoppingBag,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  Minus,
  Plus,
  X,
  Heart,
  ArrowRight
} from "lucide-react";
import { useShop } from "../ShopContext.jsx";

// Sample order data structure
const sampleOrders = [
  {
    id: "ORD-1001",
    date: "2025-03-15T10:30:00",
    status: "delivered",
    total: 7696,
    items: [
      { id: 1, name: "Beige Crushed Tissue Saree With Embroidered Border", price: 7696, quantity: 1, image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/red-organza-saree-with-florals-and-cutdana-border-sg297625-2.jpg?v=1748335622", rating: null },
    ],
    paymentMethod: "Razorpay",
    paymentId: "pay_xyz123",
    address: { fullName: "Riya Sharma", address: "123, Fashion Street, Andheri West", city: "Mumbai", pincode: "400053", phone: "+91 98765 43210" },
    tracking: { number: "TRK123456789", carrier: "DTDC", estimatedDelivery: "2025-03-18" }
  },
  {
    id: "ORD-1002",
    date: "2025-03-10T14:45:00",
    status: "shipped",
    total: 11196,
    items: [
      { id: 2, name: "Peach Tissue Saree With Cut Dana Embroidered Borders", price: 11196, quantity: 1, image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/sg187123_1.jpg?v=1744183756", rating: null },
    ],
    paymentMethod: "Credit Card",
    paymentId: "pay_abc456",
    address: { fullName: "Riya Sharma", address: "123, Fashion Street, Andheri West", city: "Mumbai", pincode: "400053", phone: "+91 98765 43210" },
    tracking: { number: "TRK987654321", carrier: "Blue Dart", estimatedDelivery: "2025-03-17" }
  },
  {
    id: "ORD-1003",
    date: "2025-03-01T09:15:00",
    status: "delivered",
    total: 17490,
    items: [
      { id: 3, name: "Blue Organza Parsi Gara Embroidered Saree", price: 7995, quantity: 1, image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/gold_toned_tissue_saree-sg157605_14.jpg?v=1755163097", rating: 5 },
      { id: 5, name: "Red Satin Woven Saree With Zari Work", price: 7995, quantity: 1, image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/light_blue_crushed_tissue_saree-sg286746-9_8.jpg?v=1747484543", rating: null }
    ],
    paymentMethod: "UPI",
    paymentId: "pay_ghi789",
    address: { fullName: "Riya Sharma", address: "123, Fashion Street, Andheri West", city: "Mumbai", pincode: "400053", phone: "+91 98765 43210" },
    tracking: { number: "TRK456789123", carrier: "Delhivery", estimatedDelivery: "2025-03-05" }
  },
  {
    id: "ORD-1004",
    date: "2025-02-20T16:20:00",
    status: "cancelled",
    total: 8995,
    items: [
      { id: 4, name: "Green Dola Silk Paithani Saree With Dollar Butti", price: 8995, quantity: 1, image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/sg353074-3_f6a6fe7e-f090-4670-b4d8-5c269c7ca657.jpg?v=1763115360", rating: null }
    ],
    paymentMethod: "Net Banking",
    paymentId: "pay_jkl012",
    address: { fullName: "Riya Sharma", address: "123, Fashion Street, Andheri West", city: "Mumbai", pincode: "400053", phone: "+91 98765 43210" },
    tracking: null
  },
  {
    id: "ORD-1005",
    date: "2025-03-18T11:00:00",
    status: "processing",
    total: 7995,
    items: [
      { id: 7, name: "Coffee Brown Tussar Saree With Mirror Border", price: 7995, quantity: 1, image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/sg345831-1_33d3f420-ce79-4c14-9b47-1a60935e7035.jpg?v=1763113122", rating: null }
    ],
    paymentMethod: "COD",
    paymentId: null,
    address: { fullName: "Riya Sharma", address: "123, Fashion Street, Andheri West", city: "Mumbai", pincode: "400053", phone: "+91 98765 43210" },
    tracking: null
  }
];

const statusConfig = {
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  shipped: { label: "Shipped", icon: Truck, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  processing: { label: "Processing", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
};

const statusTabs = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist, cart } = useShop();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState("all");
  const [ratingSubmitted, setRatingSubmitted] = useState({});

  useEffect(() => {
    // Simulate API call - in real app, fetch from backend
    setTimeout(() => {
      // Check if user is logged in
      const userAuth = localStorage.getItem("userAuth");
      if (!userAuth) {
        navigate("/account");
        return;
      }
      setOrders(sampleOrders);
      setLoading(false);
    }, 800);
  }, [navigate]);

  const filteredOrders = orders.filter(order => {
    if (activeTab !== "All" && order.status !== activeTab.toLowerCase()) return false;
    if (searchTerm && !order.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedYear !== "all") {
      const orderYear = new Date(order.date).getFullYear().toString();
      if (orderYear !== selectedYear) return false;
    }
    return true;
  });

  const getYears = () => {
    const years = [...new Set(orders.map(o => new Date(o.date).getFullYear()))];
    return years.sort((a, b) => b - a);
  };

  const handleReorder = (order) => {
    order.items.forEach(item => {
      const product = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: item.quantity
      };
      addToCart(product);
    });
    navigate("/cart");
  };

  const handleRatingSubmit = (orderId, itemId, rating) => {
    setRatingSubmitted(prev => ({ ...prev, [`${orderId}-${itemId}`]: rating }));
    // In real app, send rating to backend
  };

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status];
    if (!config) return null;
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.color} border ${config.border}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      {/* BREADCRUMB */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/account" className="hover:text-primary transition-colors">My Account</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-semibold">Order History</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 pb-16">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl text-stone-800">Order History</h1>
          </div>
          <p className="text-stone-500 ml-13">Track, manage, and reorder your purchases</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-4 text-center hover:shadow-lg transition-all">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-stone-800">{orders.filter(o => o.status === "delivered").length}</p>
            <p className="text-xs text-stone-500 font-medium">Delivered</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-4 text-center hover:shadow-lg transition-all">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-stone-800">{orders.filter(o => o.status === "shipped").length}</p>
            <p className="text-xs text-stone-500 font-medium">In Transit</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-4 text-center hover:shadow-lg transition-all">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-stone-800">{orders.filter(o => o.status === "processing").length}</p>
            <p className="text-xs text-stone-500 font-medium">Processing</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-4 text-center hover:shadow-lg transition-all">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-stone-800">{orders.length}</p>
            <p className="text-xs text-stone-500 font-medium">Total Orders</p>
          </div>
        </div>

        {/* FILTERS BAR */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {statusTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/20'
                      : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  {tab}
                  {tab !== "All" && (
                    <span className="ml-1.5 text-xs opacity-80">
                      ({orders.filter(o => o.status === tab.toLowerCase()).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-48 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-stone-50/50"
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium hover:border-primary transition-all"
                >
                  <Filter className="w-4 h-4 text-stone-500" />
                  {selectedYear === "all" ? "All Years" : selectedYear}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showFilterDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowFilterDropdown(false)}></div>
                    <div className="absolute right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-xl z-40 min-w-[140px] overflow-hidden">
                      <button
                        onClick={() => { setSelectedYear("all"); setShowFilterDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-stone-50 ${selectedYear === "all" ? 'text-primary font-semibold bg-primary/5' : 'text-stone-700'}`}
                      >
                        All Years
                      </button>
                      {getYears().map(year => (
                        <button
                          key={year}
                          onClick={() => { setSelectedYear(year.toString()); setShowFilterDropdown(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-stone-50 ${selectedYear === year.toString() ? 'text-primary font-semibold bg-primary/5' : 'text-stone-700'}`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ORDERS LIST */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-stone-200">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-stone-400" />
            </div>
            <h3 className="text-xl font-heading text-stone-800 mb-2">No orders found</h3>
            <p className="text-stone-500 mb-6">You haven't placed any orders yet</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition shadow-lg shadow-primary/20">
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status]?.icon || Package;
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Order Header */}
                  <div className="p-5 bg-gradient-to-r from-stone-50 to-white border-b border-stone-100">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-heading text-lg font-bold text-stone-800">Order #{order.id}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-stone-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(order.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTime(order.date)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-stone-500">Total Amount</p>
                        <p className="text-2xl font-bold text-stone-800">{formatPrice(order.total)}</p>
                        <p className="text-xs text-stone-400">{order.items.length} item(s)</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5">
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 pb-4 border-b border-stone-100 last:border-0 last:pb-0">
                          <div className="w-20 h-24 flex-shrink-0 bg-stone-100 rounded-xl overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                              onClick={() => navigate(`/product/${item.id}`)}
                              onError={handleImageError}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap justify-between gap-2">
                              <div>
                                <h4 
                                  className="font-semibold text-stone-800 text-sm hover:text-primary cursor-pointer transition-colors line-clamp-2"
                                  onClick={() => navigate(`/product/${item.id}`)}
                                >
                                  {item.name}
                                </h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <p className="text-primary font-bold text-sm">{formatPrice(item.price)}</p>
                                  <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-stone-800">{formatPrice(item.price * item.quantity)}</p>
                              </div>
                            </div>
                            
                            {/* Rating Section (only for delivered orders) */}
                            {order.status === "delivered" && (
                              <div className="mt-3 flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => handleRatingSubmit(order.id, item.id, star)}
                                      className="transition-transform hover:scale-110"
                                    >
                                      <Star
                                        className={`w-4 h-4 ${
                                          (ratingSubmitted[`${order.id}-${item.id}`] || item.rating || 0) >= star
                                            ? 'fill-yellow-500 text-yellow-500'
                                            : 'text-stone-300'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                                <span className="text-[10px] text-stone-400">Rate this product</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer Actions */}
                  <div className="p-5 bg-stone-50/80 border-t border-stone-100 flex flex-wrap justify-between items-center gap-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border border-stone-300 bg-white hover:border-primary hover:text-primary transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {order.status !== "cancelled" && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Reorder All
                        </button>
                      )}
                    </div>
                    
                    {order.tracking && order.status !== "cancelled" && (
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Tracking: <span className="font-mono font-semibold">{order.tracking.number}</span></span>
                        <span>via {order.tracking.carrier}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {showOrderModal && selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[100]" onClick={() => setShowOrderModal(false)}></div>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-stone-50 to-white">
                <div>
                  <h2 className="font-heading text-xl font-bold text-stone-800">Order Details</h2>
                  <p className="text-xs text-stone-500">Order #{selectedOrder.id}</p>
                </div>
                <button onClick={() => setShowOrderModal(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6 space-y-6" style={{ maxHeight: "calc(90vh - 80px)" }}>
                {/* Order Status Timeline */}
                <div className="bg-stone-50 rounded-xl p-5">
                  <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Order Status
                  </h3>
                  <div className="flex items-center justify-between">
                    {["processing", "shipped", "delivered"].map((stage, idx) => {
                      const isCompleted = selectedOrder.status === "delivered" || 
                        (stage === "processing" && selectedOrder.status !== "cancelled") ||
                        (stage === "shipped" && (selectedOrder.status === "shipped" || selectedOrder.status === "delivered")) ||
                        (stage === "delivered" && selectedOrder.status === "delivered");
                      const isActive = selectedOrder.status === stage;
                      const StageIcon = stage === "processing" ? Clock : stage === "shipped" ? Truck : CheckCircle;
                      return (
                        <div key={stage} className="flex-1 text-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                            isCompleted ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-stone-200 text-stone-400'
                          } ${isActive ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                            <StageIcon className="w-5 h-5" />
                          </div>
                          <p className={`text-xs font-semibold capitalize ${isCompleted ? 'text-primary' : 'text-stone-400'}`}>{stage}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-stone-800 mb-3">Items in this order</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-stone-50 rounded-xl">
                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg" onError={handleImageError} />
                        <div className="flex-1">
                          <p className="font-medium text-stone-800 text-sm">{item.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-primary font-bold text-sm">{formatPrice(item.price)}</p>
                            <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-stone-800 text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="bg-stone-50 rounded-xl p-4">
                    <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Shipping Address
                    </h3>
                    <div className="text-sm text-stone-600 space-y-1">
                      <p className="font-medium">{selectedOrder.address.fullName}</p>
                      <p>{selectedOrder.address.address}</p>
                      <p>{selectedOrder.address.city} - {selectedOrder.address.pincode}</p>
                      <p>{selectedOrder.address.phone}</p>
                    </div>
                  </div>
                  
                  <div className="bg-stone-50 rounded-xl p-4">
                    <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      Payment Information
                    </h3>
                    <div className="text-sm text-stone-600 space-y-1">
                      <p><span className="text-stone-400">Method:</span> {selectedOrder.paymentMethod}</p>
                      {selectedOrder.paymentId && <p><span className="text-stone-400">Transaction ID:</span> <span className="font-mono text-xs">{selectedOrder.paymentId}</span></p>}
                      <p><span className="text-stone-400">Total Paid:</span> <span className="font-bold text-stone-800">{formatPrice(selectedOrder.total)}</span></p>
                    </div>
                  </div>
                </div>

                {/* Tracking Info */}
                {selectedOrder.tracking && (
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Tracking Information
                    </h3>
                    <div className="text-sm space-y-1">
                      <p><span className="text-blue-700">Tracking Number:</span> <span className="font-mono font-semibold">{selectedOrder.tracking.number}</span></p>
                      <p><span className="text-blue-700">Carrier:</span> {selectedOrder.tracking.carrier}</p>
                      <p><span className="text-blue-700">Expected Delivery:</span> {formatDate(selectedOrder.tracking.estimatedDelivery)}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleReorder(selectedOrder)} className="flex-1 bg-primary text-white py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                    Reorder All Items
                  </button>
                  <button onClick={() => setShowOrderModal(false)} className="flex-1 border-2 border-stone-300 text-stone-700 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderHistory;