import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // ✅ Added useLocation
import { 
  Filter, Heart, ShoppingCart, Star, Eye, ChevronDown, 
  Truck, Shield, Zap, Search,
  X, Plus, Minus, Sparkles, Ruler, Scissors, ChevronRight
} from "lucide-react";
import { useShop } from "../ShopContext.jsx";

const fabricProducts = [
  { id: 201, name: "Banarasi Silk Brocade", price: 3499, oldPrice: 4999, category: "Silk", image: "https://i.pinimg.com/736x/4f/0c/79/4f0c799c67e8be10b14ad150b54f53b4.jpg", rating: 4.9, reviews: 234, fabric: "Pure Silk", width: "44\"", length: "5.5m", stockLeft: 8, colors: ["#8B0000", "#C41E3A", "#FFD700"], exclusive: true, texture: "Smooth", weight: "Medium", tag: "Premium", badge: "Luxury" },
  { id: 202, name: "Ikat Handwoven Cotton", price: 1299, oldPrice: 1799, category: "Cotton", image: "https://i.pinimg.com/1200x/5c/ba/ae/5cbaaec476c9984024ed212a5138b74d.jpg", rating: 4.7, reviews: 567, fabric: "Handloom Cotton", width: "46\"", length: "5.5m", stockLeft: 15, colors: ["#1E3A8A", "#DC2626", "#EA580C"], exclusive: false, texture: "Textured", weight: "Light", tag: "Trending", badge: "Bestseller" },
  { id: 203, name: "Kalamkari Print", price: 999, oldPrice: 1499, category: "Kalamkari", image: "https://i.pinimg.com/736x/38/de/80/38de8036daff2e913e5769671989e6ad.jpg", rating: 4.8, reviews: 189, fabric: "Cotton", width: "44\"", length: "5.5m", stockLeft: 6, colors: ["#2F4F4F", "#8B4513"], exclusive: true, texture: "Soft", weight: "Light", tag: "Bestseller", badge: "Artisanal" },
  { id: 204, name: "Indigo Block Print", price: 850, oldPrice: 1200, category: "Block Print", image: "https://i.pinimg.com/1200x/c1/70/8c/c1708cb21db4bcc9f47b7d696a3686a6.jpg", rating: 4.6, reviews: 156, fabric: "Cotton", width: "44\"", length: "5.5m", stockLeft: 12, colors: ["#1E3A8A", "#FFFFFF"], exclusive: false, texture: "Crisp", weight: "Light", badge: "Value Pick" },
  { id: 205, name: "Chanderi Handloom", price: 1550, oldPrice: 2000, category: "Cotton", image: "https://i.pinimg.com/1200x/92/f6/f0/92f6f021e1a8351e7f3d6be1d8bab38d.jpg", rating: 4.9, reviews: 78, fabric: "Chanderi Cotton", width: "46\"", length: "5.5m", stockLeft: 4, colors: ["#F5F5DC", "#FFF8DC"], exclusive: true, texture: "Silky", weight: "Light", tag: "New", badge: "New Arrival" },
  { id: 206, name: "Raw Silk Printed", price: 2100, oldPrice: 2800, category: "Silk", image: "https://i.pinimg.com/736x/14/02/1e/14021e3b777b8e3215fc52b3fb5e80cd.jpg", rating: 4.7, reviews: 92, fabric: "Raw Silk", width: "44\"", length: "5.5m", stockLeft: 7, colors: ["#FF69B4", "#FFC0CB"], exclusive: false, texture: "Nubby", weight: "Medium", badge: "Premium" },
  { id: 207, name: "Phulkari Fabric", price: 1800, oldPrice: 2500, category: "Block Print", image: "https://i.pinimg.com/1200x/3e/94/bf/3e94bfa75c58740cdae2975e9ff98e81.jpg", rating: 4.8, reviews: 134, fabric: "Cotton", width: "46\"", length: "5.5m", stockLeft: 3, colors: ["#DC2626", "#EA580C"], exclusive: true, texture: "Embroidered", weight: "Medium", tag: "Trending", badge: "Heritage" },
  { id: 208, name: "Chikankari Embroidered", price: 2200, oldPrice: 3200, category: "Cotton", image: "https://i.pinimg.com/1200x/5c/ba/ae/5cbaaec476c9984024ed212a5138b74d.jpg", rating: 5.0, reviews: 45, fabric: "Cotton", width: "44\"", length: "5.5m", stockLeft: 5, colors: ["#FFFFFF", "#FDF5E6"], exclusive: true, texture: "Delicate", weight: "Light", tag: "Handcrafted", badge: "Exclusive" }
];

const filterSections = {
  "Category": ["All", "Silk", "Cotton", "Block Print", "Kalamkari", "Ikat"],
  "Type": ["Luxury", "Premium", "Bestseller", "New Arrival", "Exclusive", "Value Pick"],
  "Texture": ["Smooth", "Textured", "Soft", "Crisp", "Silky", "Nubby", "Embroidered", "Delicate"],
  "Weight": ["Light", "Medium", "Heavy"],
  "Price Range": ["All", "Under ₹1,000", "₹1,000 - ₹2,000", "Over ₹2,000"]
};

const sortOptions = ["Featured", "Newest", "Price: Low to High", "Price: High to Low", "Top Rated"];

const Fabrics = () => {
  const location = useLocation(); // ✅ Added useLocation
  const [sortBy, setSortBy] = useState("Featured");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState({});
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});

  const { addToCart, toggleWishlist, wishlist, cart } = useShop();

  // ✅ READ URL PARAMETER FOR CATEGORY FILTER
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    
    if (categoryParam) {
      console.log("Category from URL:", categoryParam);
      // Auto-select the category filter
      setExpandedSections(prev => ({ ...prev, "Category": true }));
      setSelectedFilters(prev => ({
        ...prev,
        "Category": [categoryParam]
      }));
    }
  }, [location.search]);

  useEffect(() => {
    const stored = localStorage.getItem("llmshop_recently_viewed");
    if (stored) setRecentlyViewed(JSON.parse(stored));
  }, []);

  const toggleSection = (section) => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

  const handleFilterCheck = (section, value) => {
    setSelectedFilters(prev => {
      const current = prev[section] || [];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [section]: updated };
    });
  };

  let filteredFabrics = fabricProducts.filter((f) => {
    const searchMatch = searchQuery === "" || f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = !selectedFilters["Category"]?.length || selectedFilters["Category"].includes("All") || selectedFilters["Category"].includes(f.category);
    const typeMatch = !selectedFilters["Type"]?.length || selectedFilters["Type"].includes(f.badge) || selectedFilters["Type"].includes(f.tag);
    const textureMatch = !selectedFilters["Texture"]?.length || selectedFilters["Texture"].includes(f.texture);
    const weightMatch = !selectedFilters["Weight"]?.length || selectedFilters["Weight"].includes(f.weight);
    let priceMatch = true;
    const priceFilter = selectedFilters["Price Range"]?.[0];
    if (priceFilter === "Under ₹1,000") priceMatch = f.price < 1000;
    if (priceFilter === "₹1,000 - ₹2,000") priceMatch = f.price >= 1000 && f.price <= 2000;
    if (priceFilter === "Over ₹2,000") priceMatch = f.price > 2000;
    return searchMatch && catMatch && typeMatch && textureMatch && weightMatch && priceMatch;
  });

  if (sortBy === "Price: Low to High") filteredFabrics.sort((a, b) => a.price - b.price);
  if (sortBy === "Price: High to Low") filteredFabrics.sort((a, b) => b.price - a.price);
  if (sortBy === "Top Rated") filteredFabrics.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sortBy === "Newest") filteredFabrics.sort((a, b) => b.id - a.id);

  const handleAddToCart = (e, fabric) => {
    e.preventDefault(); e.stopPropagation();
    addToCart({ ...fabric, qty: 1, size: "5.5 meters" });
    setAddedToCart({ ...addedToCart, [fabric.id]: true });
    setTimeout(() => setAddedToCart({ ...addedToCart, [fabric.id]: false }), 2000);
  };

  const addToRecentlyViewed = (product) => {
    const updated = [product, ...recentlyViewed.filter(p => p.id !== product.id)].slice(0, 6);
    setRecentlyViewed(updated);
    localStorage.setItem("llmshop_recently_viewed", JSON.stringify(updated));
  };

  const getDiscountedPrice = (price, oldPrice) => !oldPrice ? null : Math.round(((oldPrice - price) / oldPrice) * 100);
  const formatNumber = (num) => num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num.toString();
  const clearAllFilters = () => { setSelectedFilters({}); setExpandedSections({}); setSearchQuery(""); };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-5">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-semibold">Fabrics</span>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-stone-700">Filters:</span>
              {Object.entries(selectedFilters).map(([section, values]) =>
                values.map((v) => (
                  <span key={v} className="text-xs bg-stone-800 text-white px-2.5 py-1 rounded-full flex items-center gap-1">{v} <button onClick={() => handleFilterCheck(section, v)}><X className="w-3 h-3" /></button></span>
                ))
              )}
              {Object.values(selectedFilters).flat().length === 0 && <span className="text-xs text-stone-400">None applied</span>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowMobileFilter(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-sm"><Filter className="w-4 h-4" /> Filters</button>
              <div className="relative">
                <button onClick={() => setShowSortDropdown(!showSortDropdown)} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-sm text-stone-600 hover:border-primary transition-all">
                  <span className="text-stone-400">Sort:</span> <span className="font-semibold text-stone-800">{sortBy}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showSortDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)} />
                    <div className="absolute right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-xl z-40 min-w-[200px] overflow-hidden">
                      {sortOptions.map((opt) => (
                        <button key={opt} onClick={() => { setSortBy(opt); setShowSortDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-stone-50 ${sortBy === opt ? "text-primary font-semibold bg-primary/5" : "text-stone-700"}`}>{opt}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-start" style={{ height: 'calc(100vh - 160px)' }}>
          
          {/* STATIC FILTER SIDEBAR */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0 h-full">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 h-full overflow-y-auto scrollbar-hide">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                  <h3 className="font-heading text-lg text-stone-800 flex items-center gap-2"><Filter className="w-4 h-4 text-primary" />Filters</h3>
                  <button onClick={clearAllFilters} className="text-xs text-primary font-semibold hover:underline">Clear All</button>
                </div>
                <div className="space-y-1">
                  {Object.entries(filterSections).map(([section, options]) => (
                    <div key={section} className="border-b border-stone-100 last:border-0">
                      <button onClick={() => toggleSection(section)} className="flex items-center justify-between w-full py-3 text-sm font-semibold text-stone-800 hover:text-primary transition-colors group">
                        <span>{section}</span>
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${expandedSections[section] ? 'bg-primary border-primary text-white' : 'border-stone-300 text-stone-400 group-hover:border-primary group-hover:text-primary'}`}>
                          {expandedSections[section] ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </span>
                      </button>
                      {expandedSections[section] && (
                        <div className="pb-3 space-y-2.5 animate-slideDown">
                          {options.map((option) => (
                            <label key={option} className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative">
                                <input type="checkbox" checked={(selectedFilters[section] || []).includes(option)} onChange={() => handleFilterCheck(section, option)} className="sr-only" />
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${(selectedFilters[section] || []).includes(option) ? 'bg-primary border-primary' : 'border-stone-300 group-hover:border-primary'}`}>
                                  {(selectedFilters[section] || []).includes(option) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                              </div>
                              <span className={`text-sm transition-colors ${(selectedFilters[section] || []).includes(option) ? 'text-primary font-semibold' : 'text-stone-600 group-hover:text-stone-800'}`}>{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <main className="flex-1 min-w-0 h-full overflow-y-auto scrollbar-hide">
            {filteredFabrics.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-stone-200">
                <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-4" />
                <h3 className="text-xl font-heading text-stone-800 mb-2">No fabrics found</h3>
                <button onClick={clearAllFilters} className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold">Clear All Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {filteredFabrics.map((fabric) => {
                  const isWishlisted = wishlist.some((item) => item.id === fabric.id);
                  const isInCart = cart.some((item) => item.id === fabric.id);
                  const discount = getDiscountedPrice(fabric.price, fabric.oldPrice);
                  const isLowStock = fabric.stockLeft <= 3;
                  return (
                    <div key={fabric.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-stone-100" onMouseEnter={() => setHoveredProduct(fabric.id)} onMouseLeave={() => setHoveredProduct(null)}>
                      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                        <img src={fabric.image} alt={fabric.name} className={`w-full h-full object-cover transition-transform duration-700 cursor-pointer ${hoveredProduct === fabric.id ? 'scale-110' : 'scale-100'}`} onClick={() => { addToRecentlyViewed(fabric); setQuickViewProduct(fabric); }} loading="lazy" />
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {fabric.badge && <span className="bg-primary text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold shadow-xl">{fabric.badge}</span>}
                          {discount && <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xl">{discount}% OFF</span>}
                        </div>
                        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${hoveredProduct === fabric.id ? 'opacity-100' : 'opacity-0'}`}>
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <button onClick={(e) => { e.stopPropagation(); toggleWishlist(fabric); }} className="p-2.5 bg-white rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all hover:scale-110"><Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-700'}`} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setQuickViewProduct(fabric); }} className="p-2.5 bg-white rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all hover:scale-110"><Eye className="w-4 h-4 text-stone-700" /></button>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <button onClick={(e) => handleAddToCart(e, fabric)} className="w-full py-3 bg-white text-stone-800 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all shadow-xl">
                              {addedToCart[fabric.id] ? '✓ Added!' : 'Quick Add'}
                            </button>
                          </div>
                        </div>
                        {isLowStock && <div className="absolute bottom-3 left-3 bg-stone-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 z-10"><Zap className="w-3 h-3 fill-white" />Only {fabric.stockLeft} left!</div>}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-2"><div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(fabric.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-stone-200 fill-stone-200'}`} />))}</div><span className="text-xs text-stone-400 font-medium">({formatNumber(fabric.reviews)})</span></div>
                        <h3 className="font-semibold text-stone-800 text-sm line-clamp-2 mb-2 hover:text-primary transition-colors cursor-pointer leading-snug" onClick={() => { addToRecentlyViewed(fabric); setQuickViewProduct(fabric); }}>{fabric.name}</h3>
                        <p className="text-xs text-stone-400 mb-2">{fabric.width} · {fabric.length} · {fabric.texture}</p>
                        <div className="flex items-center gap-1.5 mb-3">{fabric.colors.map((color, idx) => (<div key={idx} className={`w-4 h-4 rounded-full border-2 transition-all ${(selectedColor[fabric.id] || fabric.colors[0]) === color ? 'border-primary scale-110' : 'border-stone-200'}`} style={{ backgroundColor: color }} />))}</div>
                        <div className="flex items-center gap-2 mb-1"><span className="text-lg font-bold text-stone-800">₹{fabric.price.toLocaleString()}</span>{fabric.oldPrice && <span className="text-xs text-stone-400 line-through font-medium">₹{fabric.oldPrice.toLocaleString()}</span>}</div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="flex items-center gap-1 text-[10px] text-stone-500 font-medium"><Truck className="w-3 h-3" /> Free Delivery</span>
                          <span className="flex items-center gap-1 text-[10px] text-stone-500 font-medium"><Shield className="w-3 h-3" /> Authentic</span>
                        </div>
                        <button onClick={(e) => handleAddToCart(e, fabric)} className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${addedToCart[fabric.id] ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : isInCart ? 'bg-stone-700 text-white' : 'bg-stone-800 text-white hover:bg-primary shadow-lg shadow-stone-800/10 hover:shadow-primary/20'}`}>{addedToCart[fabric.id] ? '✓ Added!' : isInCart ? 'In Cart' : 'Add to Cart'}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {recentlyViewed.length > 0 && (
              <div className="mt-10 pt-6 border-t-2 border-stone-100 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <div><span className="text-primary text-xs uppercase tracking-[0.3em] font-semibold">History</span><h3 className="font-heading text-2xl text-stone-800 mt-1">Recently Viewed</h3></div>
                  <button onClick={() => { setRecentlyViewed([]); localStorage.removeItem("llmshop_recently_viewed"); }} className="text-xs text-stone-400 hover:text-red-500">Clear</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {recentlyViewed.slice(0, 6).map((p) => (
                    <button key={p.id} onClick={() => setQuickViewProduct(p)} className="group flex-shrink-0 w-36 text-left">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 mb-3 shadow-md"><img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div>
                      <p className="text-xs text-stone-800 font-semibold line-clamp-1">{p.name}</p>
                      <p className="text-sm font-bold text-stone-800 mt-1">₹{p.price.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {quickViewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setQuickViewProduct(null)}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setQuickViewProduct(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-xl transition-all hover:scale-110"><X className="w-5 h-5" /></button>
            <div className="grid md:grid-cols-2 h-full">
              <div className="h-[300px] md:h-[500px] bg-stone-100"><img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" /></div>
              <div className="p-6 md:p-8 overflow-y-auto">
                <span className="text-xs text-primary font-bold uppercase tracking-wider bg-primary/5 px-3 py-1 rounded-full">{quickViewProduct.fabric}</span>
                <h2 className="font-heading text-2xl text-stone-800 mt-3 mb-3">{quickViewProduct.name}</h2>
                <div className="flex items-center gap-2 mb-4"><div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < Math.floor(quickViewProduct.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-stone-200'}`} />))}</div><span className="text-sm text-stone-500">({quickViewProduct.reviews} reviews)</span></div>
                <div className="flex items-center gap-3 mb-6 bg-stone-50 p-4 rounded-2xl"><span className="text-3xl font-bold text-stone-800">₹{quickViewProduct.price.toLocaleString()}</span>{quickViewProduct.oldPrice && <><span className="text-stone-400 line-through text-lg">₹{quickViewProduct.oldPrice.toLocaleString()}</span><span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">Save {getDiscountedPrice(quickViewProduct.price, quickViewProduct.oldPrice)}%</span></>}</div>
                <div className="flex gap-3"><button onClick={(e) => { handleAddToCart(e, quickViewProduct); setQuickViewProduct(null); }} className="flex-1 bg-primary text-white py-4 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-xl flex items-center justify-center gap-2"><ShoppingCart className="w-5 h-5" /> Add to Cart</button><button onClick={() => { toggleWishlist(quickViewProduct); }} className="p-4 border-2 border-stone-200 rounded-full hover:border-primary transition-all hover:scale-110"><Heart className={`w-5 h-5 ${wishlist.some(i => i.id === quickViewProduct.id) ? 'fill-red-500 text-red-500' : ''}`} /></button></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMobileFilter && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowMobileFilter(false)} />
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 overflow-y-auto flex flex-col shadow-2xl">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between"><h2 className="text-lg font-heading font-bold">Filters</h2><button onClick={() => setShowMobileFilter(false)} className="p-2 bg-stone-100 rounded-full"><X className="w-4 h-4" /></button></div>
            <div className="p-5 space-y-4 flex-1">
              {Object.entries(filterSections).map(([section, options]) => (
                <div key={section} className="border-b border-stone-100 pb-4">
                  <button onClick={() => toggleSection(section)} className="flex items-center justify-between w-full py-2 text-sm font-semibold text-stone-800">{section}{expandedSections[section] ? <Minus className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4" />}</button>
                  {expandedSections[section] && <div className="space-y-2 pt-2">{options.map((option) => (<label key={option} className="flex items-center gap-3"><input type="checkbox" checked={(selectedFilters[section] || []).includes(option)} onChange={() => handleFilterCheck(section, option)} className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary/20" /><span className="text-sm">{option}</span></label>))}</div>}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-stone-200 flex gap-3"><button onClick={clearAllFilters} className="flex-1 border-2 border-stone-300 text-stone-800 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full">Clear All</button><button onClick={() => setShowMobileFilter(false)} className="flex-1 bg-primary text-white py-3.5 text-xs font-bold uppercase tracking-widest rounded-full">Apply ({filteredFabrics.length})</button></div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        .animate-slideDown{animation:slideDown 0.3s ease-out forwards}
      `}} />
    </div>
  );
};

export default Fabrics;