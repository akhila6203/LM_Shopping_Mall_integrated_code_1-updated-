import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2, ShoppingCart, Heart, ArrowRight, ChevronLeft, Truck,
  Shield, Award, Sparkles, Percent, Minus, Plus,
} from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { getImageUrl } from "@/api/axiosClient";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getNumericPrice = (priceVal) => {
    if (typeof priceVal === "number") return priceVal;
    if (!priceVal) return 0;
    const cleanString = String(priceVal).replace(/[^\d.]/g, "");
    return Number(cleanString) || 0;
  };

  const normalizeCartItem = (item) => ({
    ...item,
    cartItemId: item.cartItemId || item.cart_id || item.id,
    id: item.product_id || item.id,
    qty: Number(item.qty || item.quantity || 1),
    size: item.size || item.selected_size || "Free Size",
    color: item.color || item.selected_color || "",
    price: Number(item.price || item.item_price || item.offer_price || 0),
    oldPrice: item.oldPrice || item.old_price || item.price,
    image: item.image || item.thumbnail,
    sizes: item.sizes?.length ? item.sizes : [item.size || item.selected_size || "Free Size"],
  });

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/cart");
      const rows = res.data?.data || [];
      setCart(rows.map(normalizeCartItem));
    } catch (error) {
      console.error("Fetch cart error:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await axiosClient.get("/wishlist");
      setWishlist(res.data?.data || []);
    } catch {
      setWishlist([]);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, []);

  const totalQuantity = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.qty || 1), 0),
    [cart]
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + getNumericPrice(item.price) * Number(item.qty || 1),
        0
      ),
    [cart]
  );

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal + shipping - discount);

  const resetCoupon = () => {
    setCouponApplied(false);
    setDiscount(0);
    setCouponMessage("");
  };

  const updateQuantity = async (cartId, qty) => {
    try {
      await axiosClient.put(`/cart/${cartId}`, { quantity: qty });
      await fetchCart();
      resetCoupon();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Update quantity error:", error);
      alert(error.response?.data?.message || "Quantity update avvaledu");
    }
  };

  const updateSize = async (cartId, size) => {
    try {
      await axiosClient.put(`/cart/${cartId}`, { selected_size: size });
      await fetchCart();
      resetCoupon();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Update size error:", error);
      alert(error.response?.data?.message || "Size update avvaledu");
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await axiosClient.delete(`/cart/${cartId}`);
      await fetchCart();
      resetCoupon();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Remove cart error:", error);
      alert(error.response?.data?.message || "Remove avvaledu");
    }
  };

  const clearCart = async () => {
    try {
      await axiosClient.delete("/cart");
      setCart([]);
      resetCoupon();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Clear cart error:", error);
      alert(error.response?.data?.message || "Cart clear avvaledu");
    }
  };

  const toggleWishlist = async (item) => {
    try {
      await axiosClient.post("/wishlist/toggle", {
        product_id: item.id || item.product_id,
      });
      await fetchWishlist();
    } catch {
      alert("Wishlist ki login required");
    }
  };

  const applyCoupon = async () => {
    try {
      if (!couponCode.trim()) {
        alert("Please enter coupon code");
        return;
      }

      const res = await axiosClient.post("/coupons/validate", {
        code: couponCode.trim().toUpperCase(),
        order_amount: subtotal,
        cart_total: subtotal,
      });

      const coupon = res.data?.data || res.data?.coupon || res.data;

      const type = coupon.type || coupon.discount_type;
      const value = Number(coupon.value || coupon.discount_value || 0);
      const maxDiscount = Number(coupon.maximum_discount || coupon.max_discount || 0);

      let discountAmount = 0;

      if (type === "flat" || type === "fixed") {
        discountAmount = value;
      } else {
        discountAmount = Math.round(subtotal * (value / 100));
      }

      if (maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, maxDiscount);
      }

      setDiscount(discountAmount);
      setCouponApplied(true);
      setCouponMessage(coupon.message || "Coupon applied successfully!");
    } catch (error) {
      console.error("Coupon apply error:", error);
      resetCoupon();
      alert(error.response?.data?.message || "Invalid coupon code");
    }
  };

  const goCheckout = () => {
    if (cart.length === 0) {
      alert("Please add some products to your cart first!");
      return;
    }

    navigate("/checkout", {
      state: {
        coupon_code: couponApplied ? couponCode.trim().toUpperCase() : "",
        discount_amount: discount,
        subtotal,
        shipping,
        total,
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
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
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"} ready for checkout
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cart.length > 0 && subtotal < 999 && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-600 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  Add <span className="font-bold">₹{(999 - subtotal).toLocaleString("en-IN")}</span> more to get FREE shipping!
                </span>
                <span className="text-xs text-stone-400">
                  {Math.round((subtotal / 999) * 100)}%
                </span>
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
          <div className="w-full lg:w-2/3">
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/shop"
                className="flex items-center gap-2 text-stone-500 hover:text-primary transition-colors text-sm group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Continue Shopping
              </Link>

              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-stone-500 hover:text-red-500 transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-12 text-center">
                Loading cart...
              </div>
            ) : cart.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-12 text-center">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-10 h-10 text-stone-400" />
                </div>

                <h2 className="font-heading text-2xl text-stone-800 mb-3">
                  Your bag is empty
                </h2>

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
                  const qty = Number(item.qty || 1);
                  const itemTotal = cleanPrice * qty;
                  const isWishlisted = wishlist.some(
                    (w) => Number(w.product_id || w.id) === Number(item.id)
                  );
                  const key = item.cartItemId;
                  const sizeOptions = item.sizes?.length
                    ? item.sizes
                    : [item.size || "Free Size"];

                  return (
                    <div
                      key={key}
                      className="bg-white rounded-xl shadow-sm border border-stone-100 p-4 md:p-5 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-28 h-32 flex-shrink-0">
                          <Link to={`/product/${item.slug}`}>
                            <img
                              src={item.image ? getImageUrl(item.image) : ""}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </Link>

                          <button
                            onClick={() => toggleWishlist(item)}
                            className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-sm transition-all hover:scale-110 ${
                              isWishlisted ? "text-red-500" : "text-stone-400 hover:text-red-500"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500" : ""}`} />
                          </button>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <Link to={`/product/${item.slug}`}>
                                <h3 className="font-heading text-lg text-stone-800 hover:text-primary transition-colors">
                                  {item.name}
                                </h3>
                              </Link>

                              <p className="text-sm text-stone-500 mt-0.5">
                                {item.fabric || item.category || "Premium Quality"}
                              </p>

                              {item.color && (
                                <p className="text-xs text-stone-500 mt-1">
                                  Color: {item.color}
                                </p>
                              )}

                              {item.material && (
                                <p className="text-xs text-stone-500 mt-1">
                                  Material: {item.material}
                                </p>
                              )}
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-bold text-stone-800">
                                ₹{itemTotal.toLocaleString("en-IN")}
                              </p>

                              {item.oldPrice && (
                                <p className="text-xs text-stone-400 line-through">
                                  ₹{(getNumericPrice(item.oldPrice) * qty).toLocaleString("en-IN")}
                                </p>
                              )}

                              <p className="text-[11px] text-stone-400 mt-1">
                                ₹{cleanPrice.toLocaleString("en-IN")} × {qty}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-stone-500 uppercase tracking-wider">
                                Size:
                              </span>

                              <select
                                value={item.size || "Free Size"}
                                onChange={(e) => updateSize(key, e.target.value)}
                                className="bg-stone-50 border border-stone-200 rounded-lg text-xs px-3 py-1.5 outline-none focus:border-primary"
                              >
                                {sizeOptions.map((size) => (
                                  <option key={size} value={size}>
                                    {size}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-stone-500 uppercase tracking-wider">
                                Qty:
                              </span>

                              <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(key, Math.max(1, qty - 1))}
                                  disabled={qty <= 1}
                                  className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-primary hover:bg-stone-50 rounded-l-lg transition-colors disabled:opacity-40"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>

                                <span className="w-8 text-center text-sm font-medium">
                                  {qty}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => updateQuantity(key, qty + 1)}
                                  className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-primary hover:bg-stone-50 rounded-r-lg transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() => removeFromCart(key)}
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
          </div>

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
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      resetCoupon();
                    }}
                    placeholder="Enter code"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all uppercase"
                    disabled={couponApplied || cart.length === 0}
                  />

                  <button
                    onClick={applyCoupon}
                    disabled={couponApplied || !couponCode || cart.length === 0}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      couponApplied
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    {couponApplied ? "Applied ✓" : "Apply"}
                  </button>
                </div>

                {couponApplied ? (
                  <p className="text-green-600 text-xs mt-2">
                    {couponMessage || "Coupon applied successfully!"}
                  </p>
                ) : (
                  <p className="text-stone-400 text-[10px] mt-2">
                    Enter valid coupon code from admin panel
                  </p>
                )}
              </div>

              <div className="space-y-3 text-sm mb-4 pb-4 border-b border-stone-100">
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
                  ₹{cart.length > 0 ? total.toLocaleString("en-IN") : "0"}
                </span>
              </div>

              <button
                onClick={goCheckout}
                disabled={cart.length === 0}
                className="w-full py-4 rounded-xl font-body text-sm font-bold uppercase tracking-widest transition-all bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-stone-100">
                {[
                  { icon: Shield, label: "Secure" },
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: Award, label: "Authentic" },
                ].map((badge, idx) => (
                  <div key={idx} className="text-center">
                    <badge.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <span className="text-[10px] text-stone-500">
                      {badge.label}
                    </span>
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


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Trash2,
//   ShoppingCart,
//   Heart,
//   ArrowRight,
//   ChevronLeft,
//   Truck,
//   Shield,
//   Award,
//   Sparkles,
//   Percent,
//   Minus,
//   Plus,
// } from "lucide-react";
// import { useShop } from "../ShopContext.jsx";
// import axiosClient from "@/api/axiosClient";

// const Cart = () => {
//   const {
//     cart,
//     removeFromCart,
//     updateQuantity,
//     updateSize,
//     clearCart,
//     wishlist,
//     toggleWishlist,
//   } = useShop();

//   const navigate = useNavigate();
//   const [couponCode, setCouponCode] = useState("");
//   const [couponApplied, setCouponApplied] = useState(false);
//   const [discount, setDiscount] = useState(0);
//   const [couponMessage, setCouponMessage] = useState("");

//   const getNumericPrice = (priceVal) => {
//     if (typeof priceVal === "number") return priceVal;
//     if (!priceVal) return 0;
//     const cleanString = String(priceVal).replace(/[^\d.]/g, "");
//     return Number(cleanString) || 0;
//   };

//   const totalQuantity = cart.reduce(
//     (sum, item) => sum + Number(item.qty || 1),
//     0
//   );

//   const subtotal = cart.reduce(
//     (sum, item) =>
//       sum + getNumericPrice(item.price) * Number(item.qty || 1),
//     0
//   );

//   const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
//   const total = Math.max(0, subtotal + shipping - discount);

//   // const getCartKey = (item) => item.cartItemId || item.id;
//   const getCartKey = (item) => item.cartItemId || item.cart_id;

//   const handleDecreaseQty = (item) => {
//     const qty = Number(item.qty || 1);
//     updateQuantity(getCartKey(item), Math.max(1, qty - 1));
//   };

//   const handleIncreaseQty = (item) => {
//     const qty = Number(item.qty || 1);
//     updateQuantity(getCartKey(item), qty + 1);
//   };

//   const applyCoupon = async () => {
//     try {
//       if (!couponCode.trim()) {
//         alert("Please enter coupon code");
//         return;
//       }

//       const res = await axiosClient.post("/coupons/validate", {
//         code: couponCode.trim(),
//         order_amount: subtotal,
//       });

//       const coupon = res.data?.data;

//       if (!coupon) {
//         alert("Invalid coupon code");
//         return;
//       }

//       let discountAmount = 0;

//       if (coupon.discount_type === "fixed") {
//         discountAmount = Number(coupon.discount_value || 0);
//       } else {
//         discountAmount = Math.round(
//           subtotal * (Number(coupon.discount_value || 0) / 100)
//         );
//       }

//       if (coupon.maximum_discount) {
//         discountAmount = Math.min(
//           discountAmount,
//           Number(coupon.maximum_discount)
//         );
//       }

//       setDiscount(discountAmount);
//       setCouponApplied(true);
//       setCouponMessage(coupon.message || "Coupon applied successfully!");
//     } catch (error) {
//       console.error("Coupon apply error:", error);
//       alert(error.response?.data?.message || "Invalid coupon code");
//     }
//   };

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
//       <div className="relative w-full h-[280px] md:h-[320px] flex flex-col items-center justify-center text-center overflow-hidden shadow-lg">
//         <img
//           src="https://i.pinimg.com/736x/2f/ac/6a/2fac6abfc446960c548cf35e4dd83247.jpg"
//           alt="Shopping Bag"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

//         <div className="relative z-10 flex flex-col items-center px-4">
//           <span className="inline-flex items-center gap-2 bg-primary/90 text-white text-xs uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-4">
//             <Sparkles className="w-3 h-3" />
//             Your Selection
//             <Sparkles className="w-3 h-3" />
//           </span>

//           <h1 className="font-heading text-4xl md:text-6xl text-white mb-3 tracking-tight drop-shadow-lg">
//             Shopping <span className="text-primary italic">Bag</span>
//           </h1>

//           <div className="w-20 h-[2px] bg-primary mb-4 rounded-full"></div>

//           <p className="font-body text-gray-200 text-sm md:text-base tracking-wide drop-shadow-md">
//             {totalQuantity} {totalQuantity === 1 ? "item" : "items"} ready for
//             checkout
//           </p>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         {cart.length > 0 && subtotal < 999 && (
//           <div className="max-w-3xl mx-auto mb-8">
//             <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm text-stone-600 flex items-center gap-2">
//                   <Truck className="w-4 h-4 text-primary" />
//                   Add{" "}
//                   <span className="font-bold">
//                     ₹{(999 - subtotal).toLocaleString("en-IN")}
//                   </span>{" "}
//                   more to get FREE shipping!
//                 </span>
//                 <span className="text-xs text-stone-400">
//                   {Math.round((subtotal / 999) * 100)}%
//                 </span>
//               </div>

//               <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
//                   style={{
//                     width: `${Math.min((subtotal / 999) * 100, 100)}%`,
//                   }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
//           <div className="w-full lg:w-2/3">
//             <div className="flex items-center justify-between mb-4">
//               <Link
//                 to="/shop"
//                 className="flex items-center gap-2 text-stone-500 hover:text-primary transition-colors text-sm group"
//               >
//                 <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//                 Continue Shopping
//               </Link>

//               {cart.length > 0 && (
//                 <button
//                   onClick={clearCart}
//                   className="text-sm text-stone-500 hover:text-red-500 transition-colors"
//                 >
//                   Clear Cart
//                 </button>
//               )}
//             </div>

//             {cart.length === 0 ? (
//               <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-12 text-center">
//                 <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <ShoppingCart className="w-10 h-10 text-stone-400" />
//                 </div>

//                 <h2 className="font-heading text-2xl text-stone-800 mb-3">
//                   Your bag is empty
//                 </h2>

//                 <p className="text-stone-500 mb-8 max-w-md mx-auto">
//                   Looks like you haven't added anything to your bag yet. Explore
//                   our collections and find something you'll love!
//                 </p>

//                 <Link
//                   to="/shop"
//                   className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
//                 >
//                   Start Shopping <ArrowRight className="w-4 h-4" />
//                 </Link>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {cart.map((item) => {
//                   const cleanPrice = getNumericPrice(item.price);
//                   const qty = Number(item.qty || 1);
//                   const itemTotal = cleanPrice * qty;
//                   const isWishlisted = wishlist.some((w) => w.id === item.id);
//                   const key = getCartKey(item);
//                   const sizeOptions =
//                     item.sizes?.length > 0
//                       ? item.sizes
//                       : [item.size || "Free Size"];

//                   return (
//                     <div
//                       key={key}
//                       className="bg-white rounded-xl shadow-sm border border-stone-100 p-4 md:p-5 hover:shadow-md transition-all"
//                     >
//                       <div className="flex flex-col sm:flex-row gap-4">
//                         <div className="relative w-full sm:w-28 h-32 flex-shrink-0">
//                           <Link to={`/product/${item.slug}`}>
//                             <img
//                               src={item.image}
//                               alt={item.name}
//                               className="w-full h-full object-cover rounded-lg"
//                             />
//                           </Link>

//                           <button
//                             onClick={() => toggleWishlist(item)}
//                             className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-sm transition-all hover:scale-110 ${
//                               isWishlisted
//                                 ? "text-red-500"
//                                 : "text-stone-400 hover:text-red-500"
//                             }`}
//                           >
//                             <Heart
//                               className={`w-4 h-4 ${
//                                 isWishlisted ? "fill-red-500" : ""
//                               }`}
//                             />
//                           </button>
//                         </div>

//                         <div className="flex-1">
//                           <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
//                             <div>
//                               <Link to={`/product/${item.slug}`}>
//                                 <h3 className="font-heading text-lg text-stone-800 hover:text-primary transition-colors">
//                                   {item.name}
//                                 </h3>
//                               </Link>

//                               <p className="text-sm text-stone-500 mt-0.5">
//                                 {item.fabric || item.category || "Premium Quality"}
//                               </p>

//                               {item.color && (
//                                 <p className="text-xs text-stone-500 mt-1">
//                                   Color: {item.color}
//                                 </p>
//                               )}

//                               {item.material && (
//                                 <p className="text-xs text-stone-500 mt-1">
//                                   Material: {item.material}
//                                 </p>
//                               )}
//                             </div>

//                             <div className="text-right">
//                               <p className="text-lg font-bold text-stone-800">
//                                 ₹{itemTotal.toLocaleString("en-IN")}
//                               </p>

//                               {item.oldPrice && (
//                                 <p className="text-xs text-stone-400 line-through">
//                                   ₹
//                                   {(
//                                     getNumericPrice(item.oldPrice) * qty
//                                   ).toLocaleString("en-IN")}
//                                 </p>
//                               )}

//                               <p className="text-[11px] text-stone-400 mt-1">
//                                 ₹{cleanPrice.toLocaleString("en-IN")} × {qty}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex flex-wrap items-center gap-4 mt-4">
//                             <div className="flex items-center gap-2">
//                               <span className="text-xs text-stone-500 uppercase tracking-wider">
//                                 Size:
//                               </span>
//                             <select
//   value={item.size || "Free Size"}
//   onChange={(e) => updateSize(key, e.target.value)}
//   // onChange={(e) => updateSize(item.cartItemId || item.id, e.target.value)}
//   className="bg-stone-50 border border-stone-200 rounded-lg text-xs px-3 py-1.5 outline-none focus:border-primary"
// >
//   {(item.sizes?.length ? item.sizes : [item.size || "Free Size"]).map((size) => (
//     <option key={size} value={size}>
//       {size}
//     </option>
//   ))}
// </select>

//                             </div>

//                             <div className="flex items-center gap-2">
//                               <span className="text-xs text-stone-500 uppercase tracking-wider">
//                                 Qty:
//                               </span>

//                               <div className="flex items-center border border-stone-200 rounded-lg bg-white">
// <button
//   type="button"
//   onClick={() => handleDecreaseQty(item)}
//   disabled={qty <= 1}
//   className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-primary hover:bg-stone-50 rounded-l-lg transition-colors disabled:opacity-40"
// >
//   <Minus className="w-3 h-3" />
// </button>

// <span className="w-8 text-center text-sm font-medium">{qty}</span>

// <button
//   type="button"
//   onClick={() => handleIncreaseQty(item)}
//   className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-primary hover:bg-stone-50 rounded-r-lg transition-colors"
// >
//   <Plus className="w-3 h-3" />
// </button>
//                                 {/* <button
//                                   onClick={() => handleDecreaseQty(item)}
//                                   className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-primary hover:bg-stone-50 rounded-l-lg transition-colors"
//                                 >
//                                   <Minus className="w-3 h-3" />
//                                 </button>

//                                 <span className="w-8 text-center text-sm font-medium">
//                                   {qty}
//                                 </span>

//                                 <button
//                                   onClick={() => handleIncreaseQty(item)}
//                                   className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-primary hover:bg-stone-50 rounded-r-lg transition-colors"
//                                 >
//                                   <Plus className="w-3 h-3" />
//                                 </button> */}
//                               </div>
//                             </div>

//                             <button
//                               onClick={() => removeFromCart(key)}
//                               className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-500 transition-colors ml-auto"
//                             >
//                               <Trash2 className="w-3.5 h-3.5" />
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           <div className="w-full lg:w-1/3">
//             <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6 lg:sticky lg:top-24">
//               <h2 className="font-heading text-xl text-stone-800 mb-4 pb-4 border-b border-stone-100">
//                 Order Summary
//               </h2>

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
//                       setCouponApplied(false);
//                       setDiscount(0);
//                       setCouponMessage("");
//                     }}
//                     placeholder="Enter code"
//                     className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all uppercase"
//                     disabled={couponApplied || cart.length === 0}
//                   />

//                   <button
//                     onClick={applyCoupon}
//                     disabled={couponApplied || !couponCode || cart.length === 0}
//                     className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
//                       couponApplied
//                         ? "bg-green-100 text-green-700 cursor-not-allowed"
//                         : "bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
//                     }`}
//                   >
//                     {couponApplied ? "Applied ✓" : "Apply"}
//                   </button>
//                 </div>

//                 {couponApplied ? (
//                   <p className="text-green-600 text-xs mt-2">
//                     {couponMessage || "Coupon applied successfully!"}
//                   </p>
//                 ) : (
//                   <p className="text-stone-400 text-[10px] mt-2">
//                     Enter valid coupon code from admin panel
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-3 text-sm mb-4 pb-4 border-b border-stone-100">
//                 <div className="flex justify-between text-stone-600">
//                   <span>Subtotal ({totalQuantity} items)</span>
//                   <span className="font-medium">
//                     ₹{subtotal.toLocaleString("en-IN")}
//                   </span>
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

//                   {cart.length === 0 ? (
//                     <span className="text-stone-400">—</span>
//                   ) : shipping === 0 ? (
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
//                 <span className="font-heading text-2xl text-primary">
//                   ₹{cart.length > 0 ? total.toLocaleString("en-IN") : "0"}
//                 </span>
//               </div>

//               <button
//                 onClick={() => {
//                   if (cart.length > 0) navigate("/checkout");
//                   else alert("Please add some products to your cart first!");
//                 }}
//                 disabled={cart.length === 0}
//                 className="w-full py-4 rounded-xl font-body text-sm font-bold uppercase tracking-widest transition-all bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 Proceed to Checkout <ArrowRight className="w-4 h-4" />
//               </button>

//               <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-stone-100">
//                 {[
//                   { icon: Shield, label: "Secure" },
//                   { icon: Truck, label: "Fast Delivery" },
//                   { icon: Award, label: "Authentic" },
//                 ].map((badge, idx) => (
//                   <div key={idx} className="text-center">
//                     <badge.icon className="w-4 h-4 text-primary mx-auto mb-1" />
//                     <span className="text-[10px] text-stone-500">
//                       {badge.label}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex items-center justify-center gap-3 mt-4">
//                 <img
//                   src="https://cdn-icons-png.flaticon.com/128/196/196578.png"
//                   alt="Visa"
//                   className="h-5 opacity-50"
//                 />
//                 <img
//                   src="https://cdn-icons-png.flaticon.com/128/196/196561.png"
//                   alt="Mastercard"
//                   className="h-5 opacity-50"
//                 />
//                 <img
//                   src="https://cdn-icons-png.flaticon.com/128/196/196539.png"
//                   alt="UPI"
//                   className="h-5 opacity-50"
//                 />
//                 <span className="text-[10px] text-stone-400">and more</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;


