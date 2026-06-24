import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, Heart, Eye, TrendingUp, Clock, Award, Truck, Shield, ArrowRight, ChevronLeft, ChevronRight, Sparkles, Zap, Flame, Gift, Tag, Users, Play, Pause, Volume2, VolumeX, CheckCircle, Package, RefreshCw } from "lucide-react";
import { useShop } from "../ShopContext";

const featuredItems = [
  { 
    id: 901, name: "Exclusive Bridal Kanjeevaram", price: 45000, oldPrice: 55000, rating: 5, reviews: 128,
    image: "https://i.pinimg.com/736x/5d/0c/3e/5d0c3eecd96738b38dc3a31d01b04eab.jpg",
    video: "https://player.vimeo.com/external/434342234.hd.mp4?s=27e7f0d3c3b3c3b3c3b3c3b3c3b3c3b3&profile_id=172",
    tag: "Bestseller", badge: "Limited Edition", fabric: "Pure Silk", occasion: "Bridal", inStock: true, stockLeft: 3, colors: ["#8B0000", "#C41E3A", "#FFD700"], sizes: ["Free Size"], exclusive: true
  },
  { 
    id: 902, name: "Designer Banarasi Lehenga", price: 32500, oldPrice: 40000, rating: 5, reviews: 94,
    image: "https://i.pinimg.com/736x/33/e2/04/33e20454ff3d260337ac462bba1958b3.jpg",
    tag: "Trending", badge: "Designer", fabric: "Banarasi Silk", occasion: "Wedding", inStock: true, stockLeft: 5, colors: ["#FF1493", "#FF69B4", "#C71585"], sizes: ["S", "M", "L", "XL"], exclusive: true
  },
  { 
    id: 903, name: "Pure Pashmina Shawl", price: 15000, oldPrice: 18000, rating: 4.8, reviews: 76,
    image: "https://i.pinimg.com/736x/8d/5e/c2/8d5ec2c40ff380826aed325529494877.jpg",
    tag: "Premium", badge: "Handwoven", fabric: "Pashmina", occasion: "Winter", inStock: true, stockLeft: 8, colors: ["#8B4513", "#D2691E", "#A0522D", "#800000"], sizes: ["One Size"], exclusive: false
  },
  { 
    id: 904, name: "Hand-painted Kalamkari Saree", price: 22000, oldPrice: null, rating: 4.9, reviews: 52,
    image: "https://i.pinimg.com/736x/16/fe/48/16fe48df427a60a0c2fd3fb05f620792.jpg",
    video: "https://player.vimeo.com/external/434342235.hd.mp4?s=27e7f0d3c3b3c3b3c3b3c3b3c3b3c3b3&profile_id=172",
    tag: "Artisanal", badge: "Hand-painted", fabric: "Cotton Silk", occasion: "Festival", inStock: true, stockLeft: 2, colors: ["#2F4F4F", "#8B0000", "#556B2F", "#4A0404"], sizes: ["Free Size"], exclusive: true
  },
  { 
    id: 905, name: "Zardosi Embroidered Jacket", price: 28500, oldPrice: 35000, rating: 5, reviews: 38,
    image: "https://i.pinimg.com/736x/7b/24/68/7b246877bfa372697795c76ab1a3f8af.jpg",
    tag: "Exclusive", badge: "Handcrafted", fabric: "Velvet", occasion: "Party", inStock: true, stockLeft: 4, colors: ["#1a1a1a", "#8B0000", "#000080"], sizes: ["M", "L", "XL"], exclusive: true
  },
  { 
    id: 906, name: "Chikankari Anarkali Set", price: 18500, oldPrice: null, rating: 4.9, reviews: 67,
    image: "https://i.pinimg.com/736x/4b/e7/f5/4be7f55da121b2186ad2934cf6e668f3.jpg",
    tag: "Popular", badge: "New Arrival", fabric: "Georgette", occasion: "Festival", inStock: false, stockLeft: 0, colors: ["#FFF5EE", "#FFE4E1", "#F5F5DC"], sizes: ["S", "M", "L", "XL", "XXL"], exclusive: false
  },
  { 
    id: 907, name: "Mirror Work Lehenga", price: 42000, oldPrice: 52000, rating: 4.8, reviews: 45,
    image: "https://i.pinimg.com/1200x/ee/20/cd/ee20cd9eb37098bb63eada2630eed9b8.jpg",
    tag: "Festive", badge: "Gujarati Craft", fabric: "Silk", occasion: "Wedding", inStock: true, stockLeft: 6, colors: ["#FF4500", "#FFD700", "#FF1493", "#00CED1"], sizes: ["Free Size"], exclusive: false
  },
  { 
    id: 908, name: "Kashmiri Embroidered Coat", price: 19500, oldPrice: 24000, rating: 4.9, reviews: 31,
    image: "https://i.pinimg.com/736x/1e/a6/aa/1ea6aaee25127114b9607e736ba177ef.jpg",
    tag: "Winter", badge: "Kashmiri Ari", fabric: "Wool", occasion: "Winter", inStock: true, stockLeft: 7, colors: ["#2F4F4F", "#8B0000", "#1a1a1a", "#F5F5DC"], sizes: ["M", "L", "XL", "XXL"], exclusive: false
  }
];

const FeaturedBanner = () => {
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState({});
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});

  const filters = ["All", "Exclusive", "Bestseller", "Trending", "New Arrival"];

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedToCart({ ...addedToCart, [item.id]: true });
    setTimeout(() => setAddedToCart({ ...addedToCart, [item.id]: false }), 2000);
  };

  const getDiscountedPrice = (price, oldPrice) => {
    if (!oldPrice) return null;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  const filteredProducts = featuredItems.filter(item => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Exclusive") return item.exclusive;
    if (activeFilter === "Bestseller") return item.tag === "Bestseller";
    if (activeFilter === "Trending") return item.tag === "Trending";
    if (activeFilter === "New Arrival") return item.badge === "New Arrival";
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case "Price: Low to High": return a.price - b.price;
      case "Price: High to Low": return b.price - a.price;
      case "Rating": return b.rating - a.rating;
      case "Newest": return b.id - a.id;
      default: return 0;
    }
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      
      {/* LUXURY CURATED COLLECTIONS - Full Image Cards */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs uppercase tracking-[0.3em] px-4 py-2 rounded-full font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Curated Collections <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-stone-800 mt-3 mb-2">Discover Luxury</h2>
          <p className="text-stone-500 text-sm">Handpicked pieces for every occasion</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {/* Large Left Image */}
          <Link to="/sarees?category=Wedding" className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-1 md:row-span-2">
            <img 
              src="https://i.pinimg.com/1200x/82/c4/f0/82c4f0f26402d7af616a4cee263cde1e.jpg" 
              alt="Bridal Collection" 
              className="w-full h-[300px] md:h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs uppercase tracking-wider px-3 py-1 rounded-full">New Season</span>
              <h3 className="text-white font-heading text-2xl md:text-3xl mt-3 mb-1">Bridal Collection 2026</h3>
              <p className="text-cream/80 text-sm mb-4">Where dreams meet craftsmanship</p>
              <span className="inline-flex items-center gap-2 text-white text-sm font-semibold border border-white/40 rounded-full px-5 py-2.5 hover:bg-white hover:text-stone-800 transition-all duration-300">
                Explore Now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold shadow-xl">✨ Exclusive</span>
            </div>
          </Link>

          {/* ✅ FIX 1: Top Right Image - Festival Edit */}
          <Link to="/sarees?category=Festival" className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-1">
            <img 
              src="https://i.pinimg.com/1200x/54/e4/33/54e4336396452e56f7a87b20be965ec0.jpg" 
              alt="Festival Edit" 
              className="w-full h-[250px] md:h-[280px] object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs uppercase tracking-wider px-3 py-1 rounded-full">Trending</span>
              <h3 className="text-white font-heading text-xl md:text-2xl mt-2 mb-1">Festival Edit 2026</h3>
              <p className="text-cream/70 text-xs mb-3">Celebrate in vibrant colors</p>
              <span className="inline-flex items-center gap-2 text-white text-xs font-semibold border border-white/40 rounded-full px-4 py-2 hover:bg-white hover:text-stone-800 transition-all duration-300">
                Shop Now <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-red-500 text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold shadow-xl">🔥 Hot</span>
            </div>
          </Link>

          {/* ✅ FIX 2: Bottom Right Image - Luxury Accessories */}
          <Link to="/dupattas?category=Party" className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-1">
            <img 
              src="https://i.pinimg.com/1200x/8e/06/8a/8e068a9780d7be4bb4e6405f0f92c9ce.jpg" 
              alt="Luxury Accessories" 
              className="w-full h-[250px] md:h-[280px] object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs uppercase tracking-wider px-3 py-1 rounded-full">Premium</span>
              <h3 className="text-white font-heading text-xl md:text-2xl mt-2 mb-1">Luxury Accessories</h3>
              <p className="text-cream/70 text-xs mb-3">Complete your look</p>
              <span className="inline-flex items-center gap-2 text-white text-xs font-semibold border border-white/40 rounded-full px-4 py-2 hover:bg-white hover:text-stone-800 transition-all duration-300">
                Discover <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-amber-500 text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold shadow-xl">💎 Premium</span>
            </div>
          </Link>
        </div>
      </div>

      {/* ✅ FIX 3: SHOP BY OCCASION - With category parameters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-primary text-xs uppercase tracking-[0.3em] font-semibold">For Every Moment</span>
            <h2 className="font-heading text-2xl text-stone-800 mt-1">Shop by Occasion</h2>
          </div>
          <Link to="/shop" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { name: "Wedding", image: "https://i.pinimg.com/736x/cf/b4/2f/cfb42f5faf1219bf321c40f7d97a62f0.jpg", items: 156 },
            { name: "Festival", image: "https://i.pinimg.com/736x/5d/0c/3e/5d0c3eecd96738b38dc3a31d01b04eab.jpg", items: 234 },
            { name: "Party", image: "https://i.pinimg.com/736x/ec/5b/69/ec5b691dcfd7cff36f8afe213f1a14f2.jpg", items: 189 },
            { name: "Reception", image: "https://i.pinimg.com/736x/25/3f/6a/253f6ac03f122a0b17330c545f4524fc.jpg", items: 112 },
          ].map((occasion, idx) => (
            <Link key={idx} to={`/sarees?category=${occasion.name}`} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 aspect-[3/4]">
              <img src={occasion.image} alt={occasion.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-heading text-lg font-bold">{occasion.name}</h3>
                <p className="text-cream/70 text-xs">{occasion.items}+ Products</p>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* PREMIUM FILTER & SORT BAR */}
      <div className="container mx-auto px-4 pt-4 pb-4">
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-5 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-stone-700 mr-2">Filter:</span>
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/20 scale-105'
                      : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-primary hover:text-primary hover:shadow-md'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 rounded-full text-sm text-stone-600 hover:border-primary hover:shadow-md transition-all"
              >
                <span className="text-stone-400">Sort:</span> 
                <span className="font-semibold text-stone-800">{sortBy}</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showSortDropdown ? 'rotate-90' : ''}`} />
              </button>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)}></div>
                  <div className="absolute right-0 top-full mt-2 bg-white border border-stone-200 rounded-xl shadow-xl z-40 min-w-[200px] overflow-hidden">
                    {["Featured", "Price: Low to High", "Price: High to Low", "Rating", "Newest"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-stone-50 transition-colors ${
                          sortBy === opt ? 'text-primary font-semibold bg-primary/5 border-l-2 border-primary' : 'text-stone-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="font-heading text-2xl text-stone-800 mb-5">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {sortedProducts.map((item) => {
            const isWishlisted = wishlist.some((wItem) => wItem.id === item.id);
            const discount = getDiscountedPrice(item.price, item.oldPrice);
            const isLowStock = item.inStock && item.stockLeft <= 3;

            return (
              <div 
                key={item.id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-stone-100 relative"
                onMouseEnter={() => setHoveredProduct(item.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative h-[380px] overflow-hidden bg-stone-100">
                  <Link to={`/product/${item.id}`}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        hoveredProduct === item.id ? 'scale-110' : 'scale-100'
                      }`}
                    />
                  </Link>
                  
                  {item.video && hoveredProduct === item.id && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button className="bg-white/90 p-4 rounded-full text-primary hover:bg-white transition">
                        <Play className="w-6 h-6 fill-primary" />
                      </button>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.badge && (
                      <span className="bg-gradient-to-r from-primary to-primary/90 text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold shadow-xl">
                        {item.badge}
                      </span>
                    )}
                    {item.tag && (
                      <span className="bg-white text-stone-800 text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1">
                        {item.tag === "Trending" && <Flame className="w-3 h-3 text-orange-500" />}
                        {item.tag === "Bestseller" && <TrendingUp className="w-3 h-3 text-green-600" />}
                        {item.tag}
                      </span>
                    )}
                    {discount && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
                    hoveredProduct === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                  }`}>
                    <button onClick={() => toggleWishlist(item)} className="p-2.5 bg-white rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all hover:scale-110">
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-700'}`} />
                    </button>
                    <button onClick={() => setQuickViewProduct(item)} className="p-2.5 bg-white rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all hover:scale-110">
                      <Eye className="w-4 h-4 text-stone-700" />
                    </button>
                  </div>

                  {isLowStock && (
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-white" /> Only {item.stockLeft} left!
                    </div>
                  )}

                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-stone-800 text-sm font-bold px-6 py-2 rounded-full">Sold Out</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(item.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-stone-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-stone-400 font-medium">({item.reviews})</span>
                  </div>

                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-semibold text-stone-800 text-sm mb-1 line-clamp-2 hover:text-primary transition-colors leading-snug">
                      {item.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-stone-400 mb-2">{item.fabric} · {item.occasion}</p>

                  <div className="flex items-center gap-1.5 mb-3">
                    {item.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor({ ...selectedColor, [item.id]: color })}
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          (selectedColor[item.id] || item.colors[0]) === color ? 'border-primary scale-125 shadow-lg' : 'border-stone-200 hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-stone-800">₹{item.price.toLocaleString("en-IN")}</span>
                    {item.oldPrice && (
                      <span className="text-xs text-stone-400 line-through font-medium">₹{item.oldPrice.toLocaleString("en-IN")}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
                      <Truck className="w-3 h-3" /> Free Delivery
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-stone-500 font-medium">
                      <Shield className="w-3 h-3" /> Secure Checkout
                    </span>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-300 ${
                      addedToCart[item.id]
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                        : item.inStock
                          ? 'bg-stone-800 text-white hover:bg-primary shadow-lg shadow-stone-800/10 hover:shadow-primary/20'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    {addedToCart[item.id] ? '✓ Added!' : item.inStock ? <><ShoppingBag className="w-4 h-4" /> Add to Cart</> : 'Out of Stock'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {quickViewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setQuickViewProduct(null)}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setQuickViewProduct(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-xl transition-all hover:scale-110">
              <X className="w-5 h-5" />
            </button>
            <div className="grid md:grid-cols-2 h-full">
              <div className="h-[300px] md:h-[500px] bg-stone-100">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:p-8 overflow-y-auto">
                <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">{quickViewProduct.fabric}</p>
                <h2 className="font-heading text-2xl text-stone-800 mb-2">{quickViewProduct.name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < Math.floor(quickViewProduct.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-stone-300'}`} />))}</div>
                  <span className="text-sm text-stone-500">({quickViewProduct.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl font-bold text-stone-800">₹{quickViewProduct.price.toLocaleString("en-IN")}</span>
                  {quickViewProduct.oldPrice && (
                    <><span className="text-stone-400 line-through">₹{quickViewProduct.oldPrice.toLocaleString("en-IN")}</span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Save {getDiscountedPrice(quickViewProduct.price, quickViewProduct.oldPrice)}%</span></>
                  )}
                </div>
                <button onClick={() => { handleAddToCart(quickViewProduct); setQuickViewProduct(null); }} className="w-full bg-primary text-white py-3.5 rounded-full font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const X = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default FeaturedBanner;