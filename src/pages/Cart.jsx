import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Trash2, ShoppingCart, Heart, ArrowRight, ChevronLeft, 
  Truck, Shield, Award, Clock, Sparkles, Tag, Percent, Gift,
  Minus, Plus, X
} from "lucide-react";
import { useShop } from "../ShopContext.jsx"; 

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, updateSize, wishlist, toggleWishlist } = useShop();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const getNumericPrice = (priceVal) => {
    if (typeof priceVal === 'number') return priceVal;
    if (!priceVal) return 0;
    const cleanString = String(priceVal).replace(/[^\d.]/g, ''); 
    return Number(cleanString) || 0;
  };

  const subtotal = cart.reduce((sum, item) => sum + (getNumericPrice(item.price) * item.qty), 0);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "LM10") {
      setDiscount(Math.round(subtotal * 0.1));
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === "WELCOME20" && subtotal >= 1999) {
      setDiscount(Math.round(subtotal * 0.2));
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code or minimum order value not met!");
    }
  };

  const recommendedItems = [
    { id: 901, name: "Silk Blend Dupatta", price: 1299, image: "https://i.pinimg.com/736x/4a/63/42/4a6342a84073bc2a1010b34e79f71dc3.jpg" },
    { id: 902, name: "Embroidered Potli Bag", price: 899, image: "https://i.pinimg.com/736x/25/09/4e/25094edff0359cada153734742efc860.jpg" },
    { id: 903, name: "Statement Earrings", price: 1499, image: "https://i.pinimg.com/736x/8e/05/35/8e0535a0e8e424c5d1be77fea1235fda.jpg" }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      
      {/* PREMIUM CART HEADER */}
      <div className="relative w-full h-[280px] md:h-[320px] flex flex-col items-center justify-center text-center overflow-hidden shadow-lg">
        <img 
          src="https://i.pinimg.com/736x/2f/ac/6a/2fac6abfc446960c548cf35e4dd83247.jpg" 
          alt="Shopping Bag" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col items-center px-4">
          <span className="inline-flex items-center gap-2 bg-primary/90 text-white text-xs uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-3 h-3" />
            Your Selection
            <Sparkles className="w-3 h-3" />
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-white mb-3 tracking-tight drop-shadow-lg">
            Shopping <span className="text-primary italic">Bag</span>
          </h1>
          <div className="w-20 h-[2px] bg-primary mb-4 rounded-full"></div>
          <p className="font-body text-gray-200 text-sm md:text-base tracking-wide drop-shadow-md">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} ready for checkout
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* Free Shipping Progress Bar */}
        {cart.length > 0 && subtotal < 999 && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-600 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  Add <span className="font-bold">₹{(999 - subtotal).toLocaleString("en-IN")}</span> more to get FREE shipping!
                </span>
                <span className="text-xs text-stone-400">{Math.round((subtotal / 999) * 100)}%</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left: Cart Items */}
          <div className="w-full lg:w-2/3">
            
            <div className="flex items-center justify-between mb-4">
              <Link to="/shop" className="flex items-center gap-2 text-stone-500 hover:text-primary transition-colors text-sm group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Continue Shopping
              </Link>
              {cart.length > 0 && (
                <button className="text-sm text-stone-500 hover:text-red-500 transition-colors">
                  Clear Cart
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-12 text-center">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-10 h-10 text-stone-400" />
                </div>
                <h2 className="font-heading text-2xl text-stone-800 mb-3">Your bag is empty</h2>
                <p className="text-stone-500 mb-8 max-w-md mx-auto">
                  Looks like you haven't added anything to your bag yet. Explore our collections and find something you'll love!
                </p>
                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Start Shopping <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  const cleanPrice = getNumericPrice(item.price);
                  const isWishlisted = wishlist.some(w => w.id === item.id);

                  return (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-stone-100 p-4 md:p-5 hover:shadow-md transition-all">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-28 h-32 flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button 
                            onClick={() => toggleWishlist(item)}
                            className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-sm transition-all hover:scale-110 ${
                              isWishlisted ? 'text-red-500' : 'text-stone-400 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
                          </button>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <Link to={`/product/${item.id}`}>
                                <h3 className="font-heading text-lg text-stone-800 hover:text-primary transition-colors">
                                  {item.name}
                                </h3>
                              </Link>
                              <p className="text-sm text-stone-500 mt-0.5">{item.fabric || item.category || 'Premium Quality'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-stone-800">₹{cleanPrice.toLocaleString("en-IN")}</p>
                              {item.oldPrice && (
                                <p className="text-xs text-stone-400 line-through">₹{item.oldPrice.toLocaleString("en-IN")}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-stone-500 uppercase tracking-wider">Size:</span>
                              <select 
                                value={item.size || "Free Size"} 
                                onChange={(e) => updateSize(item.id, e.target.value)}
                                className="bg-stone-50 border border-stone-200 rounded-lg text-xs px-3 py-1.5 outline-none focus:border-primary"
                              >
                                <option value="Free Size">Free Size</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-stone-500 uppercase tracking-wider">Qty:</span>
                              <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                                <button 
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.qty - 1))}
                                  className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-primary hover:bg-stone-50 rounded-l-lg transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.qty + 1)}
                                  className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-primary hover:bg-stone-50 rounded-r-lg transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-500 transition-colors ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-12">
                <h3 className="font-heading text-xl text-stone-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  You May Also Like
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {recommendedItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 hover:shadow-md transition-all group">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full aspect-square object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
                      />
                      <h4 className="text-xs font-medium text-stone-800 truncate">{item.name}</h4>
                      <p className="text-xs text-primary font-semibold mt-1">₹{item.price.toLocaleString()}</p>
                      <button className="w-full mt-2 text-[10px] uppercase tracking-wider text-primary border border-primary rounded-full py-1.5 hover:bg-primary hover:text-white transition-all">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6 lg:sticky lg:top-24">
              <h2 className="font-heading text-xl text-stone-800 mb-4 pb-4 border-b border-stone-100">
                Order Summary
              </h2>

              <div className="mb-4 pb-4 border-b border-stone-100">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2 block">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code" 
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all uppercase"
                    disabled={couponApplied || cart.length === 0}
                  />
                  <button 
                    onClick={applyCoupon}
                    disabled={couponApplied || !couponCode || cart.length === 0}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      couponApplied 
                        ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                        : 'bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {couponApplied ? 'Applied ✓' : 'Apply'}
                  </button>
                </div>
                <p className="text-stone-400 text-[10px] mt-2">
                  Try: LM10 (10% off) or WELCOME20 (20% off on orders above ₹1,999)
                </p>
              </div>

              <div className="space-y-3 text-sm mb-4 pb-4 border-b border-stone-100">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({cart.length} items)</span>
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
                  {cart.length === 0 ? (
                    <span className="text-stone-400">—</span>
                  ) : shipping === 0 ? (
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
                <span className="font-heading text-2xl text-primary">
                  ₹{cart.length > 0 ? total.toLocaleString("en-IN") : '0'}
                </span>
              </div>

              <button 
                onClick={() => { 
                  if(cart.length > 0) navigate("/checkout"); 
                  else alert("Please add some products to your cart first!"); 
                }}
                disabled={cart.length === 0}
                className="w-full py-4 rounded-xl font-body text-sm font-bold uppercase tracking-widest transition-all bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-stone-100">
                {[
                  { icon: Shield, label: "Secure" },
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: Award, label: "Authentic" }
                ].map((badge, idx) => (
                  <div key={idx} className="text-center">
                    <badge.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <span className="text-[10px] text-stone-500">{badge.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 mt-4">
                <img src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="Visa" className="h-5 opacity-50" />
                <img src="https://cdn-icons-png.flaticon.com/128/196/196561.png" alt="Mastercard" className="h-5 opacity-50" />
                <img src="https://cdn-icons-png.flaticon.com/128/196/196539.png" alt="UPI" className="h-5 opacity-50" />
                <span className="text-[10px] text-stone-400">and more</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;