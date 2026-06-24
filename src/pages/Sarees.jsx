import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom"; 
import { Filter, Heart, X, ChevronDown, Star, Search, Eye, ShoppingCart, Sparkles, TrendingUp, Flame, Play, Award, Truck, Shield, Clock, Zap, Plus, Minus, ChevronRight, ArrowRight } from "lucide-react"; 
import { useShop } from "../ShopContext.jsx";

const sareeProducts = [
  { id: 1, name: "Beige Crushed Tissue Saree With Embroidered Border", price: 7696, oldPrice: 10995, tag: "Ready To Ship", category: "Tissue", color: "Beige", rating: 4.8, reviews: 45, fabric: "Tissue", occasion: "Party", image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/red-organza-saree-with-florals-and-cutdana-border-sg297625-2.jpg?v=1748335622", badge: "Bestseller", stockLeft: 5, colors: ["#F5E6D3", "#FFDAB9", "#E8D5C4"] },
  { id: 2, name: "Peach Tissue Saree With Cut Dana Embroidered Borders", price: 11196, oldPrice: 15995, tag: "Ready To Ship", category: "Tissue", color: "Peach", rating: 4.7, reviews: 32, fabric: "Tissue", occasion: "Wedding", image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/sg187123_1.jpg?v=1744183756", badge: "Trending", stockLeft: 3, colors: ["#FFDAB9", "#FFCBA4", "#FED8B1"] },
  { id: 3, name: "Blue Organza Parsi Gara Embroidered Saree", price: 7995, oldPrice: null, tag: "Selling Fast", category: "Organza", color: "Blue", rating: 4.9, reviews: 67, fabric: "Organza", occasion: "Party", image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/gold_toned_tissue_saree-sg157605_14.jpg?v=1755163097", badge: "Premium", stockLeft: 2, colors: ["#2563EB", "#1E40AF", "#3B82F6"] },
  { id: 4, name: "Green Dola Silk Paithani Saree With Dollar Butti", price: 8995, oldPrice: null, tag: "Ready To Ship", category: "Silk", color: "Green", rating: 4.6, reviews: 28, fabric: "Dola Silk", occasion: "Festival", image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/sg353074-3_f6a6fe7e-f090-4670-b4d8-5c269c7ca657.jpg?v=1763115360", badge: "Handloom", stockLeft: 8, colors: ["#16A34A", "#15803D", "#22C55E"] },
  { id: 5, name: "Red Satin Woven Saree With Zari Work", price: 7995, oldPrice: null, tag: "Selling Fast", category: "Satin", color: "Red", rating: 4.8, reviews: 54, fabric: "Satin", occasion: "Wedding", image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/light_blue_crushed_tissue_saree-sg286746-9_8.jpg?v=1747484543", badge: "Exclusive", stockLeft: 4, colors: ["#DC2626", "#B91C1C", "#EF4444"] },
  { id: 6, name: "Purple Crush Tissue Saree With Floral Print", price: 6296, oldPrice: 8995, tag: "30% OFF", category: "Tissue", color: "Purple", rating: 4.5, reviews: 19, fabric: "Tissue", occasion: "Party", image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/peach-crushed-tissue-saree-with-cutdana-and-sequins-embroidery-sg296092-2.jpg?v=1745401053", badge: "Sale", stockLeft: 6, colors: ["#9333EA", "#7E22CE", "#A855F7"] },
  { id: 7, name: "Coffee Brown Tussar Saree With Mirror Border", price: 7995, oldPrice: null, tag: "Ready To Ship", category: "Tussar", color: "Brown", rating: 4.7, reviews: 23, fabric: "Tussar Silk", occasion: "Traditional", image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/sg345831-1_33d3f420-ce79-4c14-9b47-1a60935e7035.jpg?v=1763113122", badge: "Artisanal", stockLeft: 7, colors: ["#8B4513", "#A0522D", "#6B3410"] },
  { id: 8, name: "Red Banarasi Georgette Saree With Bandhani Weave", price: 8995, oldPrice: null, tag: "Ready To Ship", category: "Georgette", color: "Red", rating: 4.9, reviews: 41, fabric: "Georgette", occasion: "Wedding", image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/green_embroidered_georgette_chikankari_saree_with_-sg237854_14_5aa4fa31-e3cf-4eb8-9a67-886ddc98e040.jpg?v=1743758154", badge: "Heritage", stockLeft: 5, colors: ["#DC2626", "#991B1B", "#7F1D1D"] },
];

const shopByCategories = [
  { name: "Silk", image: "https://in.kalkifashion.com/cdn/shop/files/see-all-saree-menu.jpg?v=1973566450915323820" },
  { name: "Cotton", image: "https://in.kalkifashion.com/cdn/shop/files/ready-to-ship-saree-menu.jpg?v=15945377513907552209" },
  { name: "Organza", image: "https://in.kalkifashion.com/cdn/shop/files/instant-saree-menu.jpg?v=16816833513126958670" },
  { name: "Tissue", image: "https://in.kalkifashion.com/cdn/shop/files/engagement-saree-menu.jpg?v=16263079441756699149" },
  { name: "Georgette", image: "https://in.kalkifashion.com/cdn/shop/files/festive-saree-menu.jpg?v=10282578487875671569" },
  { name: "Banarasi", image: "https://in.kalkifashion.com/cdn/shop/files/wedding-saree-menu.jpg?v=5015825323256827575" },
  { name: "Chiffon", image: "https://in.kalkifashion.com/cdn/shop/files/embroidered-saree-menu.jpg?v=5239106531695380492" },
  { name: "Net", image: "https://in.kalkifashion.com/cdn/shop/files/bridal-saree-menu.jpg?v=3865592706081764068" },
];

const filterSections = {
  "Price Range": { options: ["Under ₹5,000", "₹5,000 - ₹10,000", "₹10,000 - ₹15,000", "Over ₹15,000"] },
  "Category": { options: ["Tissue", "Organza", "Silk", "Satin", "Georgette", "Net", "Tussar", "Sequins"] },
  "Fabric": { options: ["Tissue", "Organza", "Dola Silk", "Satin", "Georgette", "Tussar Silk", "Cotton", "Banarasi"] },
  "Occasion": { options: ["Wedding", "Party", "Festival", "Reception", "Traditional", "Casual"] }
};

const quickFilters = [
  { label: "All", icon: null },
  { label: "Bestseller", icon: TrendingUp },
  { label: "Trending", icon: Flame },
  { label: "Premium", icon: Award },
  { label: "New Arrival", icon: Sparkles },
  { label: "Sale", icon: null }
];

const sortOptions = ["Featured", "Newest", "Price: Low to High", "Price: High to Low", "Rating"];

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

const Sarees = () => {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [selectedColor, setSelectedColor] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);

  const { addToCart, toggleWishlist, wishlist, cart } = useShop();

  const toggleSection = (section) => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

  const handleFilterCheck = (section, value) => {
    setSelectedFilters(prev => {
      const current = prev[section] || [];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [section]: updated };
    });
  };

  // ✅ FIXED: Complete filter logic with Price Range
  const filteredSarees = sareeProducts.filter((saree) => {
    // Quick Filters
    let filterMatch = true;
    if (activeFilter === "Bestseller") filterMatch = saree.badge === "Bestseller";
    if (activeFilter === "Trending") filterMatch = saree.badge === "Trending";
    if (activeFilter === "Premium") filterMatch = saree.badge === "Premium" || saree.badge === "Luxury";
    if (activeFilter === "New Arrival") filterMatch = saree.badge === "New Arrival";
    if (activeFilter === "Sale") filterMatch = saree.tag?.includes("OFF");
    
    // Category Filter
    const categoryMatch = !selectedFilters["Category"]?.length || selectedFilters["Category"].includes(saree.category);
    
    // Fabric Filter
    const fabricMatch = !selectedFilters["Fabric"]?.length || selectedFilters["Fabric"].includes(saree.fabric);
    
    // Occasion Filter
    const occasionMatch = !selectedFilters["Occasion"]?.length || selectedFilters["Occasion"].includes(saree.occasion);
    
    // ✅ FIXED: Price Range Filter
    let priceMatch = true;
    const priceFilters = selectedFilters["Price Range"] || [];
    
    if (priceFilters.length > 0) {
      priceMatch = priceFilters.some(range => {
        if (range === "Under ₹5,000") return saree.price < 5000;
        if (range === "₹5,000 - ₹10,000") return saree.price >= 5000 && saree.price <= 10000;
        if (range === "₹10,000 - ₹15,000") return saree.price >= 10000 && saree.price <= 15000;
        if (range === "Over ₹15,000") return saree.price > 15000;
        return false;
      });
    }
    
    return filterMatch && categoryMatch && fabricMatch && occasionMatch && priceMatch;
  });

  const sortedSarees = [...filteredSarees].sort((a, b) => {
    switch(sortBy) {
      case "Price: Low to High": return a.price - b.price;
      case "Price: High to Low": return b.price - a.price;
      case "Newest": return b.id - a.id;
      case "Rating": return (b.rating || 0) - (a.rating || 0);
      default: return 0;
    }
  });

  useEffect(() => {
    const stored = localStorage.getItem("llmshop_recently_viewed");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const fixed = parsed.map(p => ({ ...p, image: p.image || FALLBACK_IMAGE }));
        setRecentlyViewed(fixed);
        localStorage.setItem("llmshop_recently_viewed", JSON.stringify(fixed));
      } catch (e) {
        setRecentlyViewed([]);
        localStorage.removeItem("llmshop_recently_viewed");
      }
    }
  }, []);

  // ✅ URL parameter filter reading
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");

    if (category) {
      setExpandedSections(prev => ({ ...prev, "Category": true }));
      setSelectedFilters(prev => ({
        ...prev,
        Category: [category]
      }));
    }
  }, [location]);

  const handleAddToCart = (e, saree) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(saree);
    setAddedToCart({ ...addedToCart, [saree.id]: true });
    setTimeout(() => setAddedToCart({ ...addedToCart, [saree.id]: false }), 2000);
  };

  const clearAllFilters = () => { 
    setActiveFilter("All"); 
    setSelectedFilters({}); 
    setExpandedSections({}); 
    setActiveCategory(null); 
  };
  
  const getDiscountedPrice = (price, oldPrice) => !oldPrice ? null : Math.round(((oldPrice - price) / oldPrice) * 100);
  const handleImageError = (e) => { e.target.src = FALLBACK_IMAGE; };
  const formatNumber = (num) => num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num.toString();

  const addToRecentlyViewed = (product) => {
    const safeProduct = { ...product, image: product.image || FALLBACK_IMAGE };
    const updated = [safeProduct, ...recentlyViewed.filter(p => p.id !== product.id)].slice(0, 8);
    setRecentlyViewed(updated);
    localStorage.setItem("llmshop_recently_viewed", JSON.stringify(updated));
  };

  const handleCategoryClick = (catName) => {
    if (activeCategory === catName) {
      setActiveCategory(null);
      setSelectedFilters(prev => { const { Category, ...rest } = prev; return rest; });
    } else {
      setActiveCategory(catName);
      setExpandedSections(prev => ({ ...prev, "Category": true }));
      setSelectedFilters(prev => ({ ...prev, "Category": [catName] }));
    }
  };

  const featuredBanners = [
    { title: "Wedding Collection", subtitle: "For your special day", image: "https://i.pinimg.com/1200x/2e/af/99/2eaf993f6785c50bf69fe1ab8b3a6c7d.jpg", link: "/shop", badge: "👰 Bridal" },
    { title: "Festival Edit", subtitle: "Celebrate in style", image: "https://i.pinimg.com/736x/db/4c/49/db4c49dc41d0ba964e0f80b65d1746f7.jpg", link: "/shop", badge: "🎉 Festive" },
    { title: "Party Picks", subtitle: "Shine all night", image: "https://i.pinimg.com/736x/c2/22/0a/c2220a1c42db49fa387f861b320668b2.jpg", link: "/shop", badge: "✨ Party" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      
      {/* BREADCRUMB + 3 FEATURE BANNERS */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/collections" className="hover:text-primary transition-colors">Collections</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-semibold">Sarees</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {featuredBanners.map((banner, idx) => (
            <Link key={idx} to={banner.link} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 aspect-[16/9] md:aspect-[3/2]">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={handleImageError} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold">{banner.badge}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-heading text-xl md:text-2xl font-bold mb-1">{banner.title}</h3>
                <p className="text-cream/80 text-sm mb-3">{banner.subtitle}</p>
                <span className="inline-flex items-center gap-2 text-white text-xs font-semibold border border-white/40 rounded-full px-4 py-2 hover:bg-white hover:text-stone-800 transition-all duration-300">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
        
        {/* SHOP BY CATEGORIES */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-primary text-xs uppercase tracking-[0.3em] font-semibold">Discover</span>
              <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mt-1">Shop by Categories</h2>
            </div>
          </div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-4">
            {shopByCategories.map((cat) => (
              <button key={cat.name} onClick={() => handleCategoryClick(cat.name)} className="group relative flex-shrink-0 w-[130px] md:w-[150px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={handleImageError} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className={`absolute inset-0 ring-2 transition-all duration-300 rounded-2xl ${activeCategory === cat.name ? 'ring-primary scale-105' : 'ring-transparent'}`}></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className={`text-white font-heading text-base font-bold transition-colors ${activeCategory === cat.name ? 'text-primary' : ''}`}>{cat.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* QUICK FILTERS & SORT BAR */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {quickFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button key={filter.label} onClick={() => setActiveFilter(filter.label)} className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeFilter === filter.label ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/20 scale-105' : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-primary hover:text-primary hover:shadow-md'}`}>
                    {Icon && <Icon className="w-3.5 h-3.5" />}{filter.label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowMobileFilter(true)} className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 rounded-full text-sm font-medium hover:bg-stone-50 shadow-sm"><Filter className="w-4 h-4" /> Filters</button>
              <div className="relative">
                <button onClick={() => setShowSortDropdown(!showSortDropdown)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 rounded-full text-sm text-stone-600 hover:border-primary hover:shadow-md transition-all">
                  <span className="text-stone-400">Sort:</span> <span className="font-semibold text-stone-800">{sortBy}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showSortDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)}></div>
                    <div className="absolute right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-xl z-40 min-w-[200px] overflow-hidden">
                      {sortOptions.map((opt) => (
                        <button key={opt} onClick={() => { setSortBy(opt); setShowSortDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-stone-50 transition-colors ${sortBy === opt ? 'text-primary font-semibold bg-primary/5 border-l-2 border-primary' : 'text-stone-700'}`}>{opt}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* MAIN LAYOUT */}
        <div className="flex gap-6 items-start" style={{ height: 'calc(100vh - 120px)' }}>
          
          {/* STATIC FILTER SIDEBAR */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0 h-full">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 h-full overflow-y-auto scrollbar-hide">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                  <h3 className="font-heading text-lg text-stone-800 flex items-center gap-2"><Filter className="w-4 h-4 text-primary" />Filters</h3>
                  <button onClick={clearAllFilters} className="text-xs text-primary font-semibold hover:underline">Clear All</button>
                </div>

                {Object.values(selectedFilters).flat().length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4 pb-3 border-b border-stone-100">
                    {Object.entries(selectedFilters).map(([section, values]) =>
                      values.map((v) => (
                        <span key={v} className="text-[10px] bg-stone-800 text-white px-2 py-1 rounded-full flex items-center gap-1">
                          {v}
                          <button onClick={() => handleFilterCheck(section, v)}><X className="w-2.5 h-2.5" /></button>
                        </span>
                      ))
                    )}
                  </div>
                )}

                <div className="mb-4 pb-3 border-b border-stone-100">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Quick Filters</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {quickFilters.map((filter) => (
                      <button key={filter.label} onClick={() => setActiveFilter(filter.label)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeFilter === filter.label ? 'bg-primary text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  {Object.entries(filterSections).map(([section, data]) => (
                    <div key={section} className="border-b border-stone-100 last:border-0">
                      <button onClick={() => toggleSection(section)} className="flex items-center justify-between w-full py-3 text-sm font-semibold text-stone-800 hover:text-primary transition-colors group">
                        <span>{section}</span>
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${expandedSections[section] ? 'bg-primary border-primary text-white' : 'border-stone-300 text-stone-400 group-hover:border-primary group-hover:text-primary'}`}>
                          {expandedSections[section] ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </span>
                      </button>
                      {expandedSections[section] && (
                        <div className="pb-3 space-y-2.5 animate-slideDown">
                          {data.options.map((option) => (
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
            {sortedSarees.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-stone-200">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-10 h-10 text-stone-400" /></div>
                <h3 className="text-xl font-heading text-stone-800 mb-2">No sarees found</h3>
                <p className="text-stone-500 mb-6">Try adjusting your filters</p>
                <button onClick={clearAllFilters} className="bg-primary text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition shadow-lg shadow-primary/20">Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                  {sortedSarees.map((saree) => {
                    const isWishlisted = wishlist.some(item => item.id === saree.id);
                    const isInCart = cart.some(item => item.id === saree.id);
                    const discount = getDiscountedPrice(saree.price, saree.oldPrice);
                    const isLowStock = saree.stockLeft <= 3;
                    return (
                      <div key={saree.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-stone-100 relative" onMouseEnter={() => setHoveredProduct(saree.id)} onMouseLeave={() => setHoveredProduct(null)}>
                        <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                          <img src={saree.image} alt={saree.name} className={`w-full h-full object-cover transition-transform duration-700 ${hoveredProduct === saree.id ? 'scale-110' : 'scale-100'}`} onError={handleImageError} onClick={() => { addToRecentlyViewed(saree); setQuickViewProduct(saree); }} />
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {saree.badge && <span className="bg-gradient-to-r from-primary to-primary/90 text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold shadow-xl">{saree.badge}</span>}
                            {saree.tag && <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xl ${saree.tag.includes("Selling Fast") ? "bg-red-500 text-white" : saree.tag.includes("OFF") ? "bg-green-500 text-white" : "bg-white/95 text-stone-800"}`}>{saree.tag}</span>}
                            {discount && <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xl">{discount}% OFF</span>}
                          </div>
                          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-500 ${hoveredProduct === saree.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                            <button onClick={(e) => { e.stopPropagation(); toggleWishlist(saree); }} className="p-2.5 bg-white rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"><Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-700'}`} /></button>
                            <button onClick={(e) => { e.stopPropagation(); addToRecentlyViewed(saree); setQuickViewProduct(saree); }} className="p-2.5 bg-white rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"><Eye className="w-4 h-4 text-stone-700" /></button>
                          </div>
                          {isLowStock && <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5"><Zap className="w-3 h-3 fill-white" />Only {saree.stockLeft} left!</div>}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-1 mb-2"><div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(saree.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-stone-200'}`} />))}</div><span className="text-xs text-stone-400 font-medium">({formatNumber(saree.reviews)})</span></div>
                          <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1 font-semibold">{saree.fabric}</p>
                          <h3 className="font-semibold text-stone-800 text-sm line-clamp-2 mb-2 hover:text-primary transition-colors cursor-pointer leading-snug" onClick={() => { addToRecentlyViewed(saree); setQuickViewProduct(saree); }}>{saree.name}</h3>
                          <div className="flex items-center gap-1.5 mb-3">{saree.colors.map((color, idx) => (<button key={idx} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${(selectedColor[saree.id] || saree.colors[0]) === color ? 'border-primary scale-125 shadow-lg' : 'border-stone-200 hover:scale-110'}`} style={{ backgroundColor: color }} />))}</div>
                          <div className="flex items-center gap-2 mb-1"><span className="text-lg font-bold text-stone-800">₹{saree.price.toLocaleString()}</span>{saree.oldPrice && <span className="text-xs text-stone-400 line-through font-medium">₹{saree.oldPrice.toLocaleString()}</span>}</div>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium"><Truck className="w-3 h-3" /> Free Delivery</span>
                            <span className="flex items-center gap-1 text-[10px] text-stone-500 font-medium"><Shield className="w-3 h-3" /> Secure Checkout</span>
                          </div>
                          <button onClick={(e) => handleAddToCart(e, saree)} className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${addedToCart[saree.id] ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : isInCart ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-stone-800 text-white hover:bg-primary shadow-lg shadow-stone-800/10 hover:shadow-primary/20'}`}>{addedToCart[saree.id] ? '✓ Added!' : isInCart ? 'In Cart' : 'Add to Cart'}</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {recentlyViewed.length > 0 && (
                  <div className="mt-10 pt-6 border-t-2 border-stone-100 mb-6">
                    <div className="flex items-center justify-between mb-5">
                      <div><span className="text-primary text-xs uppercase tracking-[0.3em] font-semibold">History</span><h3 className="font-heading text-2xl text-stone-800 mt-1">Recently Viewed</h3></div>
                      <button onClick={() => { setRecentlyViewed([]); localStorage.removeItem("llmshop_recently_viewed"); }} className="text-xs text-stone-400 hover:text-red-500 transition-colors font-medium">Clear History</button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                      {recentlyViewed.slice(0, 6).map((p) => (
                        <button key={p.id} onClick={() => setQuickViewProduct(p)} className="group flex-shrink-0 w-36 md:w-40 text-left">
                          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 mb-3 shadow-md group-hover:shadow-xl transition-all duration-300">
                            <img src={p.image || FALLBACK_IMAGE} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src = FALLBACK_IMAGE; }} />
                          </div>
                          <p className="text-xs text-stone-800 font-semibold line-clamp-1 group-hover:text-primary transition-colors">{p.name}</p>
                          <p className="text-sm font-bold text-stone-800 mt-1">₹{p.price?.toLocaleString() || '0'}</p>
                          <div className="flex items-center gap-1 mt-1"><div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < Math.floor(p.rating || 0) ? 'fill-yellow-500 text-yellow-500' : 'text-stone-200'}`} />))}</div><span className="text-[10px] text-stone-400">({p.reviews || 0})</span></div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
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
              <div className="h-[300px] md:h-[500px] bg-stone-100"><img src={quickViewProduct.image || FALLBACK_IMAGE} alt={quickViewProduct.name} className="w-full h-full object-cover" onError={handleImageError} /></div>
              <div className="p-6 md:p-8 overflow-y-auto">
                <span className="text-xs text-primary font-bold uppercase tracking-wider bg-primary/5 px-3 py-1 rounded-full">{quickViewProduct.fabric}</span>
                <h2 className="font-heading text-2xl text-stone-800 mt-3 mb-3 leading-tight">{quickViewProduct.name}</h2>
                <div className="flex items-center gap-2 mb-4"><div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < Math.floor(quickViewProduct.rating || 0) ? 'fill-yellow-500 text-yellow-500' : 'text-stone-200'}`} />))}</div><span className="text-sm text-stone-500 font-medium">({quickViewProduct.reviews || 0} reviews)</span></div>
                <div className="flex items-center gap-3 mb-6 bg-stone-50 p-4 rounded-2xl"><span className="text-3xl font-bold text-stone-800">₹{quickViewProduct.price?.toLocaleString() || '0'}</span>{quickViewProduct.oldPrice && <><span className="text-stone-400 line-through text-lg">₹{quickViewProduct.oldPrice.toLocaleString()}</span><span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">Save {getDiscountedPrice(quickViewProduct.price, quickViewProduct.oldPrice)}%</span></>}</div>
                <div className="mb-6"><p className="text-sm font-semibold text-stone-700 mb-3">Available Colors</p><div className="flex gap-3">{quickViewProduct.colors?.map((color, idx) => (<button key={idx} className="w-10 h-10 rounded-full border-2 border-stone-200 hover:border-primary transition-all hover:scale-110 shadow-md" style={{ backgroundColor: color }} />))}</div></div>
                <div className="flex gap-3"><button onClick={(e) => { handleAddToCart(e, quickViewProduct); setQuickViewProduct(null); }} className="flex-1 bg-primary text-white py-4 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2"><ShoppingCart className="w-5 h-5" /> Add to Cart</button><button onClick={() => { toggleWishlist(quickViewProduct); }} className="p-4 border-2 border-stone-200 rounded-full hover:border-primary hover:text-primary transition-all hover:scale-110"><Heart className={`w-5 h-5 ${wishlist.some(i => i.id === quickViewProduct.id) ? 'fill-red-500 text-red-500' : ''}`} /></button></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMobileFilter && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowMobileFilter(false)}></div>
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 overflow-y-auto flex flex-col shadow-2xl">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between"><h2 className="text-lg font-heading font-bold">Filters</h2><button onClick={() => setShowMobileFilter(false)} className="p-2 bg-stone-100 rounded-full"><X className="w-4 h-4" /></button></div>
            <div className="p-5 space-y-4 flex-1">
              {Object.entries(filterSections).map(([section, data]) => (
                <div key={section} className="border-b border-stone-100 pb-4">
                  <button onClick={() => toggleSection(section)} className="flex items-center justify-between w-full py-2 text-sm font-semibold text-stone-800">{section}{expandedSections[section] ? <Minus className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4" />}</button>
                  {expandedSections[section] && <div className="space-y-2 pt-2">{data.options.map((option) => (<label key={option} className="flex items-center gap-3"><input type="checkbox" checked={(selectedFilters[section] || []).includes(option)} onChange={() => handleFilterCheck(section, option)} className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary/20" /><span className="text-sm">{option}</span></label>))}</div>}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-stone-200 flex gap-3"><button onClick={clearAllFilters} className="flex-1 border-2 border-stone-300 text-stone-800 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full">Clear All</button><button onClick={() => setShowMobileFilter(false)} className="flex-1 bg-primary text-white py-3.5 text-xs font-bold uppercase tracking-widest rounded-full">Apply ({sortedSarees.length})</button></div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        .animate-slideDown{animation:slideDown 0.3s ease-out forwards}
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .line-clamp-1{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
      `}} />
    </div>
  );
};

export default Sarees;