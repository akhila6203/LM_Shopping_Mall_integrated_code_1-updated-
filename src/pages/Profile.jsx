import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  User, Mail, Phone, MapPin, Calendar, Edit3, Camera, Heart, 
  Package, Clock, Settings, LogOut, ChevronRight,
  Shield, CreditCard, ShoppingBag, Star,
  ArrowRight, Sparkles, Truck, RefreshCw, AlertCircle, CheckCircle,
  Eye, Download, Filter, MoreHorizontal, X, Plus, Minus, Search,
  Home, Briefcase, Trash2, Check, Circle, Upload, LogIn
} from "lucide-react";
import { useShop } from "../ShopContext.jsx";
import { getMyOrders } from "@/services/orderService";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/services/addressService";
import { getCustomerProfile } from "@/services/customerAuthService";
import { getImageUrl } from "@/api/axiosClient";

const mapApiAddressToUi = (addr) => ({
  id: addr.id,
  type: addr.address_type === "billing" ? "Office" : "Home",
  name: addr.full_name,
  address: [addr.address_line1, addr.address_line2].filter(Boolean).join(", "),
  city: addr.city,
  state: addr.state,
  pincode: addr.pincode,
  phone: addr.phone,
  isDefault: Number(addr.is_default) === 1,
});

const mapUiAddressToApi = (addr, isDefault = false) => ({
  address_type: addr.type === "Office" ? "billing" : "shipping",
  full_name: addr.name,
  phone: addr.phone,
  address_line1: addr.address,
  address_line2: null,
  city: addr.city,
  state: addr.state,
  pincode: addr.pincode,
  country: "India",
  is_default: isDefault ? 1 : 0,
});

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist, cart, addToCart, removeFromWishlist, toggleWishlist, user, logout, updateUser, refreshProfile } = useShop();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [tempAddress, setTempAddress] = useState({
    type: "Home",
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: ""
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  // const [settings, setSettings] = useState([
  //   { label: "Email Notifications", desc: "Receive order updates and promotions", enabled: true },
  //   { label: "SMS Updates", desc: "Get order updates via text message", enabled: false },
  //   { label: "Two-Factor Authentication", desc: "Add an extra layer of security", enabled: false },
  // ]);

  // URL parameter reading
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    
    if (tab === "orders") {
      setActiveTab("orders");
    } else if (tab === "wishlist") {
      setActiveTab("wishlist");
    } else if (tab === "addresses") {
      setActiveTab("addresses");
    } else if (tab === "settings") {
      setActiveTab("settings");
    }
  }, [location]);

  // Sync user data
  useEffect(() => {
    setUserData(user);
    if (user) {
      setEditForm({
        name: user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || ""
      });
      if (user.profilePhoto || user.avatar) {
        setProfilePhotoPreview(user.profilePhoto || getImageUrl(user.avatar));
      }
    }
  }, [user]);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const profileRes = await getCustomerProfile();
        const profile = profileRes?.data ?? profileRes;
        if (profile?.addresses) {
          setSavedAddresses(profile.addresses.map(mapApiAddressToUi));
        }
      } catch (error) {
        console.error("Load profile addresses error:", error);
      }
    };

    const loadOrders = async () => {
      try {
        setOrdersLoading(true);
        const data = await getMyOrders({ limit: 50 });
        const list = Array.isArray(data) ? data : [];
        setOrders(
          list.map((order) => ({
            id: order.order_number || order.id,
            orderId: order.id,
            date: order.created_at
              ? new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "",
            status: order.order_status || "pending",
            items: `${order.items_count || 0} item(s)`,
            quantity: order.items_count || 1,
            amount: Number(order.total_amount || 0),
            image: order.image || order.product_image || order.first_item_image || order.thumbnail || "",
            slug: order.slug || order.product_slug || "",
            productId: order.product_id || order.first_product_id || null,
            
          }))
        );
      } catch (error) {
        console.error("Load orders error:", error);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user) {
      loadProfileData();
      loadOrders();
    }
  }, [user]);

  const handleCameraClick = () => fileInputRef.current?.click();

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
      setIsUploading(true);
      try {
        const updated = await updateUser({ avatarFile: file });
        if (updated?.avatar) {
          setProfilePhotoPreview(getImageUrl(updated.avatar));
        } else if (updated?.profilePhoto) {
          setProfilePhotoPreview(updated.profilePhoto);
        }
        await refreshProfile();
        setSuccessMsg("Profile photo updated!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } catch (error) {
        setErrorMsg(error.response?.data?.message || "Failed to upload photo");
        setTimeout(() => setErrorMsg(""), 3000);
      } finally {
        setIsUploading(false);
      }
    } else if (file) {
      setErrorMsg("Image must be under 5MB");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhotoPreview(null);
    const updatedUser = { ...userData, profilePhoto: null };
    updateUser(updatedUser);
    setUserData(updatedUser);
    setSuccessMsg("Photo removed");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editForm.name.length < 3) {
      setErrorMsg("Name must be at least 3 characters");
      return;
    }
    try {
      const nameParts = editForm.name.trim().split(" ");
      await updateUser({
        first_name: nameParts[0] || "",
        last_name: nameParts.slice(1).join(" ") || "",
        phone: editForm.phone,
        name: editForm.name,
      });
      await refreshProfile();
      setIsEditing(false);
      setSuccessMsg("Profile updated!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to update profile");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("rememberedEmail");
    navigate("/");
  };

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState([]);

  const refetchAddresses = async () => {
    try {
      const addresses = await getAddresses();
      setSavedAddresses((addresses || []).map(mapApiAddressToUi));
    } catch (error) {
      console.error("Refetch addresses error:", error);
    }
  };

  const handleAddAddress = async () => {
    if (!tempAddress.name || !tempAddress.address || !tempAddress.city || !tempAddress.pincode) {
      setErrorMsg("Please fill all required fields");
      return;
    }
    try {
      await createAddress(
        mapUiAddressToApi(tempAddress, savedAddresses.length === 0)
      );
      await refetchAddresses();
      setShowAddressModal(false);
      setTempAddress({ type: "Home", name: "", address: "", city: "", state: "", pincode: "", phone: "" });
      setSuccessMsg("Address added!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to add address");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleUpdateAddress = async () => {
    if (!tempAddress.name || !tempAddress.address || !tempAddress.city || !tempAddress.pincode) {
      setErrorMsg("Please fill all required fields");
      return;
    }
    try {
      await updateAddress(
        editingAddress.id,
        mapUiAddressToApi(tempAddress, editingAddress.isDefault)
      );
      await refetchAddresses();
      setShowAddressModal(false);
      setEditingAddress(null);
      setTempAddress({ type: "Home", name: "", address: "", city: "", state: "", pincode: "", phone: "" });
      setSuccessMsg("Address updated!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to update address");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      await refetchAddresses();
      setSuccessMsg("Address deleted!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to delete address");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const setDefaultAddressHandler = async (id) => {
    try {
      await setDefaultAddress(id);
      await refetchAddresses();
      setSuccessMsg("Default address updated!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to set default address");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleReorder = (order) => {
    const product = {
      id: order.id,
      name: order.items,
      price: order.amount / order.quantity,
      image: order.image,
      qty: order.quantity
    };
    addToCart(product);
    setSuccessMsg("Added to cart!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleTrackOrder = (orderId) => navigate(`/track-order?order=${orderId}`);
  const handleDownloadInvoice = (orderId) => {
    setSuccessMsg(`Invoice for ${orderId} downloading...`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    order.items.toLowerCase().includes(orderSearch.toLowerCase())
  );

  // const totalSpent = orders
  //   .filter((order) =>
  //     ["paid", "confirmed", "packed", "shipped", "delivered"].includes(
  //       String(order.status || "").toLowerCase()
  //     )
  //   )
  //   .reduce((sum, order) => sum + Number(order.amount || 0), 0);
  // const ordersCompleted = orders.filter((order) =>
  //   ["confirmed", "packed", "shipped", "delivered"].includes(
  //     String(order.status || "").toLowerCase()
  //   )
  // ).length;
  // const reviewsGiven = 0;

  const menuItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package, count: orders.length },
    { id: "wishlist", label: "Wishlist", icon: Heart, count: wishlist.length },
    { id: "addresses", label: "Addresses", icon: MapPin, count: savedAddresses.length },
    // { id: "settings", label: "Settings", icon: Settings },
  ];

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-stone-200 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-stone-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      
      {/* Simple Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center gap-1 text-xs text-stone-400">
          <Link to="/" className="hover:text-stone-600 transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-600">My Account</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        
        {/* Two Column Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* LEFT SIDEBAR - Profile Card + Menu */}
          <div className="md:w-72 flex-shrink-0">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-stone-100 p-5 mb-4">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center shadow-md overflow-hidden">
                    {profilePhotoPreview ? (
                      <img src={profilePhotoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-heading font-bold text-white">
                        {userData.name?.charAt(0)?.toUpperCase() || "P"}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={handleCameraClick}
                    className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md hover:bg-stone-50 transition-all border border-stone-200"
                  >
                    {isUploading ? (
                      <div className="w-2.5 h-2.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera className="w-3 h-3 text-stone-500" />
                    )}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleProfilePhotoChange} accept="image/*" className="hidden" />
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-stone-800 truncate">{userData.name}</h2>
                  <p className="text-xs text-stone-500 truncate">{userData.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Gold Member</span>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-[10px] text-stone-400 hover:text-primary transition"
                    >
                      <Edit3 className="w-2.5 h-2.5 inline" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Mini Cards */}
           

            {/* Vertical Menu */}
            <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
                    activeTab === item.id 
                      ? 'bg-primary/5 border-l-2 border-l-primary' 
                      : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-primary' : 'text-stone-500'}`} />
                    <span className={`text-sm ${activeTab === item.id ? 'text-primary font-medium' : 'text-stone-700'}`}>
                      {item.label}
                    </span>
                  </div>
                  {item.count !== undefined && (
                    <span className="text-xs text-stone-400">{item.count}</span>
                  )}
                </button>
              ))}
              
              {/* Sign Out Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 border-t border-stone-100 text-red-500 hover:bg-red-50 transition text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 bg-white rounded-xl border border-stone-100 p-5">
            
            {/* Edit Profile Form */}
            {isEditing && (
              <div className="mb-5 pb-4 border-b border-stone-100">
                <h3 className="text-sm font-semibold text-stone-800 mb-3">Edit Profile</h3>
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">City</label>
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
                      Save Changes
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="border border-stone-300 text-stone-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-stone-50 transition">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Success/Error Messages */}
            {successMsg && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-2.5 mb-4">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <p className="text-green-600 text-xs">{successMsg}</p>
              </div>
            )}
            {errorMsg && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-2.5 mb-4">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <p className="text-red-600 text-xs">{errorMsg}</p>
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h3 className="text-sm font-semibold text-stone-800 mb-3">Account Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500">Full Name</span>
                    <span className="text-stone-800 font-medium">{userData.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500">Email</span>
                    <span className="text-stone-600">{userData.email}</span>
                  </div>
                  {userData.phone && (
                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Phone</span>
                      <span className="text-stone-600">{userData.phone}</span>
                    </div>
                  )}
                  {userData.city && (
                    <div className="flex justify-between py-2">
                      <span className="text-stone-500">Location</span>
                      <span className="text-stone-600">{userData.city}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h3 className="text-sm font-semibold text-stone-800">All Orders</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-primary w-48"
                    />
                  </div>
                </div>
                
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-stone-500 text-sm">No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="border border-stone-100 rounded-lg p-3">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (order.slug) navigate(`/product/${order.slug}`);
                              else if (order.productId) navigate(`/product/${order.productId}`);
                            }}
                            className="shrink-0"
                          >
                            {order.image ? (
                              <img
                                src={getImageUrl(order.image)}
                                alt={order.items}
                                className="w-16 h-20 rounded-lg object-cover border border-stone-100"
                              />
                            ) : (
                              <div className="w-16 h-20 rounded-lg border border-stone-100 bg-stone-50 flex items-center justify-center text-[10px] text-stone-400">
                                No Image
                              </div>
                            )}
                          {/* <img
                              src={order.image ? getImageUrl(order.image) : ""}
                              alt={order.items}
                              className="w-16 h-20 rounded-lg object-cover border border-stone-100"
                            /> */}
                            </button>
                          {/* <img src={order.image} alt={order.items} className="w-16 h-20 rounded-lg object-cover" /> */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-2 flex-wrap">
                              <div>
                                <p className="text-sm font-medium text-stone-800">{order.items}</p>
                                <p className="text-xs text-stone-400 mt-0.5">{order.id} • {order.date}</p>
                                <p className="text-xs font-bold text-primary mt-1">Qty: {order.quantity} • ₹{order.amount.toLocaleString()}</p>
                              </div>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                order.status === "Delivered" ? "bg-green-100 text-green-600" : 
                                order.status === "Processing" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex gap-3 mt-2">
                              <button onClick={() => handleTrackOrder(order.id)} className="text-xs text-primary hover:underline">Track Order</button>
                              {/* <button onClick={() => handleDownloadInvoice(order.id)} className="text-xs text-stone-500 hover:text-primary flex items-center gap-1">
                                <Download className="w-3 h-3" /> Invoice
                              </button> */}
                              {order.status === "Delivered" && (
                                <button onClick={() => handleReorder(order)} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full hover:bg-primary/20 transition">
                                  Buy Again
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
  <div>
    <h3 className="text-sm font-semibold text-stone-800 mb-4">
      Saved Items ({wishlist.length})
    </h3>

    {wishlist.length === 0 ? (
      <div className="text-center py-8">
        <Heart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
        <p className="text-stone-500 text-sm mb-2">Your wishlist is empty</p>
        <Link to="/sarees" className="text-sm text-primary hover:underline">
          Browse Collection
        </Link>
      </div>
    ) : (
      <div className="space-y-3">
        {wishlist.map((item) => {
          const productPath = item.slug
            ? `/product/${item.slug}`
            : `/product/${item.product_slug || item.product_id || item.id}`;

          return (
            <div
              key={item.id}
              onClick={() => navigate(productPath)}
              className="flex gap-3 p-3 border border-stone-100 rounded-lg cursor-pointer hover:border-primary/40 hover:bg-stone-50 transition"
            >
              <img
                src={item.image ? getImageUrl(item.image) : ""}
                alt={item.name}
                className="w-16 h-20 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h4 className="text-sm font-medium text-stone-800">{item.name}</h4>
                <p className="text-sm font-bold text-primary mt-1">
                  ₹{item.price?.toLocaleString()}
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                      setSuccessMsg("Added to cart!");
                      setTimeout(() => setSuccessMsg(""), 2000);
                    }}
                    className="text-xs bg-primary text-white px-3 py-1 rounded-full hover:bg-primary/90 transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item.id);
                    }}
                    className="text-xs text-stone-400 hover:text-red-500 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
)}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-stone-800">Saved Addresses</h3>
                  <button 
                    onClick={() => { setEditingAddress(null); setTempAddress({ type: "Home", name: userData?.name || "", address: "", city: "", state: "", pincode: "", phone: userData?.phone || "" }); setShowAddressModal(true); }}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    + Add New
                  </button>
                </div>
                <div className="space-y-3">
                  {savedAddresses.map((addr) => (
                    <div key={addr.id} className={`p-3 border rounded-lg ${addr.isDefault ? 'border-primary/30 bg-primary/5' : 'border-stone-100'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {addr.type === "Home" ? <Home className="w-3.5 h-3.5 text-primary" /> : <Briefcase className="w-3.5 h-3.5 text-primary" />}
                          <span className="text-xs font-medium text-stone-600">{addr.type}</span>
                          {addr.isDefault && <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Default</span>}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingAddress(addr); setTempAddress(addr); setShowAddressModal(true); }} className="p-1 hover:bg-stone-100 rounded">
                            <Edit3 className="w-3 h-3 text-stone-400" />
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="p-1 hover:bg-stone-100 rounded">
                            <Trash2 className="w-3 h-3 text-stone-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-stone-800">{addr.name}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{addr.address}</p>
                      <p className="text-xs text-stone-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{addr.phone}</p>
                      {!addr.isDefault && (
                        <button onClick={() => setDefaultAddressHandler(addr.id)} className="text-xs text-primary mt-2 hover:underline">
                          Set as Default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {/* {activeTab === "settings" && (
              <div>
                <h3 className="text-sm font-semibold text-stone-800 mb-4">Account Settings</h3>
                <div className="space-y-3">
                  {settings.map((setting, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-stone-800">{setting.label}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{setting.desc}</p>
                      </div>
                      <button 
                        onClick={() => {
                          const updated = [...settings];
                          updated[idx].enabled = !updated[idx].enabled;
                          setSettings(updated);
                          setSuccessMsg(`${setting.label} ${!setting.enabled ? 'enabled' : 'disabled'}`);
                          setTimeout(() => setSuccessMsg(""), 2000);
                        }}
                        className={`w-9 h-5 rounded-full transition-colors relative ${
                          setting.enabled ? 'bg-primary' : 'bg-stone-300'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${
                          setting.enabled ? 'left-5' : 'left-0.5'
                        }`}></span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[100]" onClick={() => { setShowAddressModal(false); setEditingAddress(null); }}></div>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white">
                <h3 className="text-base font-semibold text-stone-800">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h3>
                <button onClick={() => { setShowAddressModal(false); setEditingAddress(null); }} className="p-1 hover:bg-stone-100 rounded-full transition">
                  <X className="w-4 h-4 text-stone-400" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Address Type</label>
                  <div className="flex gap-2">
                    {["Home", "Office", "Other"].map(type => (
                      <button 
                        key={type}
                        onClick={() => setTempAddress({ ...tempAddress, type })}
                        className={`px-3 py-1.5 text-sm border rounded-lg transition ${
                          tempAddress.type === type 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'border-stone-200 text-stone-600 hover:border-primary'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={tempAddress.name}
                    onChange={(e) => setTempAddress({ ...tempAddress, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                    placeholder="Full name" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    value={tempAddress.phone}
                    onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                    placeholder="Phone number" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Address</label>
                  <textarea 
                    value={tempAddress.address}
                    onChange={(e) => setTempAddress({ ...tempAddress, address: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                    rows="2" 
                    placeholder="Address"
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">City</label>
                    <input 
                      type="text" 
                      value={tempAddress.city}
                      onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                      placeholder="City" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Pincode</label>
                    <input 
                      type="text" 
                      value={tempAddress.pincode}
                      onChange={(e) => setTempAddress({ ...tempAddress, pincode: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                      placeholder="Pincode" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">State</label>
                  <input 
                    type="text" 
                    value={tempAddress.state}
                    onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                    placeholder="State" 
                  />
                </div>
              </div>
              <div className="p-4 border-t border-stone-100 flex gap-2 sticky bottom-0 bg-white">
                <button onClick={() => { setShowAddressModal(false); setEditingAddress(null); }} className="flex-1 border border-stone-200 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition">
                  Cancel
                </button>
                <button onClick={editingAddress ? handleUpdateAddress : handleAddAddress} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
                  {editingAddress ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}} />
    </div>
  );
};

export default Profile;