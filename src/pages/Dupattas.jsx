import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Filter, Heart, ShoppingCart, Star, Eye, ChevronDown, 
  Truck, Shield, Zap, Search,
  X, Plus, Minus, Sparkles, ChevronRight
} from "lucide-react";
import { useShop } from "../ShopContext.jsx";

const dupattaProducts = [
  { id: 401, brand: "Anouk", name: "Indigo Block Print Cotton Dupatta", price: 881, oldPrice: 3999, category: "Cotton", color: "Blue", discount: 78, rating: 4.2, reviews: 291, fabric: "Cotton", occasion: "Casual", stockLeft: 8, image: "https://i.pinimg.com/1200x/a4/fc/23/a4fc23b3d7641e7144c5899736ae7469.jpg" },
  { id: 402, brand: "Tikhi Imli", name: "Floral Embroidered Organza Dupatta", price: 915, oldPrice: 4996, category: "Organza", color: "Pink", discount: 82, rating: 4.3, reviews: 203, fabric: "Organza", occasion: "Party", stockLeft: 5, image: "https://i.pinimg.com/736x/0d/52/45/0d5245c2e58d100e64c66a9374fe1e6f.jpg" },
  { id: 403, brand: "HERE&NOW", name: "Silk Blend Zari Dupatta", price: 1097, oldPrice: 3393, category: "Silk", color: "Blue", discount: 68, rating: 4.1, reviews: 145, fabric: "Silk Blend", occasion: "Festival", stockLeft: 3, image: "https://i.pinimg.com/1200x/58/a5/1f/58a51fb90a137ec65e7637d5717456f7.jpg" },
  { id: 404, brand: "Anouk Rustic", name: "Mirror Work Net Dupatta", price: 829, oldPrice: 4999, category: "Embroidered", color: "White", discount: 83, rating: 3.8, reviews: 89, fabric: "Net", occasion: "Wedding", stockLeft: 6, image: "https://i.pinimg.com/1200x/64/af/dd/64afddedc7c21a11cc074b26ba82d840.jpg" },
  { id: 405, brand: "KALINI", name: "Premium Cotton Silk Dupatta", price: 1750, oldPrice: 2500, category: "Cotton Silk", color: "Green", discount: 30, rating: 4.6, reviews: 422, fabric: "Cotton Silk", occasion: "Casual", stockLeft: 12, image: "https://i.pinimg.com/1200x/b1/02/66/b102660847d9f5d9e5afffe7954b9ca9.jpg" },
  { id: 406, brand: "Mitera", name: "Chanderi Silk Dupatta", price: 2800, oldPrice: 3800, category: "Silk", color: "Yellow", discount: 26, rating: 4.7, reviews: 515, fabric: "Chanderi Silk", occasion: "Festival", stockLeft: 4, image: "https://i.pinimg.com/1200x/49/d9/e1/49d9e110af2b86db4a2a545cd1a4bc97.jpg" },
  { id: 407, brand: "Sangria", name: "Black Sequin Border Dupatta", price: 1299, oldPrice: 2999, category: "Organza", color: "Black", discount: 56, rating: 3.7, reviews: 3600, fabric: "Organza", occasion: "Party", stockLeft: 7, image: "https://i.pinimg.com/736x/3b/4c/5d/3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p.jpg" },
  { id: 408, brand: "DIVASTRI", name: "Red Phulkari Heavy Dupatta", price: 1450, oldPrice: 3000, category: "Embroidered", color: "Red", discount: 51, rating: 4.4, reviews: 120, fabric: "Phulkari", occasion: "Traditional", stockLeft: 2, image: "https://i.pinimg.com/736x/4c/5d/6e/4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q.jpg" },
];

const filterSections = {
  "Price Range": ["Under ₹1,000", "₹1,000 - ₹2,000", "₹2,000 - ₹3,000", "Over ₹3,000"],
  "Category": ["Cotton", "Organza", "Silk", "Embroidered", "Cotton Silk"],
  "Fabric": ["Cotton", "Organza", "Silk Blend", "Net", "Cotton Silk", "Chanderi Silk", "Phulkari"],
  "Occasion": ["Casual", "Party", "Festival", "Wedding", "Traditional"]
};

const sortOptions = ["Featured", "Newest", "Price: Low to High", "Price: High to Low", "Top Rated"];

const Dupattas = () => {
  const [sortBy, setSortBy] = useState("Featured");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedColor, setSelectedColor] = useState({});
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { addToCart, toggleWishlist, wishlist, cart } = useShop();

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

  // ✅ FIXED: Complete filter logic with Price Range
  let filteredDupattas = dupattaProducts.filter((d) => {
    const searchMatch = searchQuery === "" || d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    const categoryMatch = !selectedFilters["Category"]?.length || selectedFilters["Category"].includes(d.category);
    
    const fabricMatch = !selectedFilters["Fabric"]?.length || selectedFilters["Fabric"].includes(d.fabric);
    
    const occasionMatch = !selectedFilters["Occasion"]?.length || selectedFilters["Occasion"].includes(d.occasion);
    
    // ✅ PRICE FILTER FIX - Added this
    const priceMatch = !selectedFilters["Price Range"]?.length || selectedFilters["Price Range"].some((range) => {
      if (range === "Under ₹1,000") return d.price < 1000;
      if (range === "₹1,000 - ₹2,000") return d.price >= 1000 && d.price <= 2000;
      if (range === "₹2,000 - ₹3,000") return d.price >= 2000 && d.price <= 3000;
      if (range === "Over ₹3,000") return d.price > 3000;
      return true;
    });
    
    return searchMatch && categoryMatch && fabricMatch && occasionMatch && priceMatch;
  });

  if (sortBy === "Price: Low to High") filteredDupattas.sort((a, b) => a.price - b.price);
  if (sortBy === "Price: High to Low") filteredDupattas.sort((a, b) => b.price - a.price);
  if (sortBy === "Top Rated") filteredDupattas.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sortBy === "Newest") filteredDupattas.sort((a, b) => b.id - a.id);

  const handleAddToCart = (e, dupatta) => {
    e.preventDefault(); e.stopPropagation();
    addToCart({ ...dupatta, qty: 1, size: "Free Size" });
    setAddedToCart({ ...addedToCart, [dupatta.id]: true });
    setTimeout(() => setAddedToCart({ ...addedToCart, [dupatta.id]: false }), 2000);
  };

  const addToRecentlyViewed = (product) => {
    const updated = [product, ...recentlyViewed.filter(p => p.id !== product.id)].slice(0, 6);
    setRecentlyViewed(updated);
    localStorage.setItem("llmshop_recently_viewed", JSON.stringify(updated));
  };

  const formatNumber = (num) => num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num.toString();
  const clearAllFilters = () => { setSelectedFilters({}); setExpandedSections({}); setSearchQuery(""); };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-5">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-semibold">Dupattas</span>
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
            {filteredDupattas.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-stone-200">
                <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-4" />
                <h3 className="text-xl font-heading text-stone-800 mb-2">No dupattas found</h3>
                <button onClick={clearAllFilters} className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold">Clear All Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {filteredDupattas.map((dupatta) => {
                  const isWishlisted = wishlist.some((item) => item.id === dupatta.id);
                  const isInCart = cart.some((item) => item.id === dupatta.id);
                  const isLowStock = dupatta.stockLeft <= 3;
                  return (
                    <div key={dupatta.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-stone-100" onMouseEnter={() => setHoveredProduct(dupatta.id)} onMouseLeave={() => setHoveredProduct(null)}>
                      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                        <img src={dupatta.image} alt={dupatta.name} className={`w-full h-full object-cover transition-transform duration-700 cursor-pointer ${hoveredProduct === dupatta.id ? 'scale-110' : 'scale-100'}`} onClick={() => { addToRecentlyViewed(dupatta); setQuickViewProduct(dupatta); }} loading="lazy" />
                        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${hoveredProduct === dupatta.id ? 'opacity-100' : 'opacity-0'}`}>
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <button onClick={(e) => { e.stopPropagation(); toggleWishlist(dupatta); }} className="p-2.5 bg-white rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all hover:scale-110"><Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-700'}`} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setQuickViewProduct(dupatta); }} className="p-2.5 bg-white rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all hover:scale-110"><Eye className="w-4 h-4 text-stone-700" /></button>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <button onClick={(e) => handleAddToCart(e, dupatta)} className="w-full py-3 bg-white text-stone-800 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all shadow-xl">
                              {addedToCart[dupatta.id] ? '✓ Added!' : 'Quick Add'}
                            </button>
                          </div>
                        </div>
                        {isLowStock && <div className="absolute bottom-3 left-3 bg-stone-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 z-10"><Zap className="w-3 h-3 fill-white" />Only {dupatta.stockLeft} left!</div>}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-2"><div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(dupatta.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-stone-200 fill-stone-200'}`} />))}</div><span className="text-xs text-stone-400 font-medium">({formatNumber(dupatta.reviews)})</span></div>
                        <h3 className="font-semibold text-stone-800 text-sm line-clamp-2 mb-2 hover:text-primary transition-colors cursor-pointer leading-snug" onClick={() => { addToRecentlyViewed(dupatta); setQuickViewProduct(dupatta); }}>{dupatta.name}</h3>
                        <p className="text-xs text-stone-400 mb-2">{dupatta.fabric} · {dupatta.occasion}</p>
                        <div className="flex items-center gap-2 mb-1"><span className="text-lg font-bold text-stone-800">₹{dupatta.price.toLocaleString()}</span><span className="text-xs text-stone-400 line-through font-medium">₹{dupatta.oldPrice.toLocaleString()}</span><span className="text-xs text-green-600 font-medium">({dupatta.discount}% OFF)</span></div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="flex items-center gap-1 text-[10px] text-stone-500 font-medium"><Truck className="w-3 h-3" /> Free Delivery</span>
                          <span className="flex items-center gap-1 text-[10px] text-stone-500 font-medium"><Shield className="w-3 h-3" /> Authentic</span>
                        </div>
                        <button onClick={(e) => handleAddToCart(e, dupatta)} className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${addedToCart[dupatta.id] ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : isInCart ? 'bg-stone-700 text-white' : 'bg-stone-800 text-white hover:bg-primary shadow-lg shadow-stone-800/10 hover:shadow-primary/20'}`}>{addedToCart[dupatta.id] ? '✓ Added!' : isInCart ? 'In Cart' : 'Add to Cart'}</button>
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
                <div className="flex items-center gap-3 mb-6 bg-stone-50 p-4 rounded-2xl"><span className="text-3xl font-bold text-stone-800">₹{quickViewProduct.price.toLocaleString()}</span>{quickViewProduct.oldPrice && <><span className="text-stone-400 line-through text-lg">₹{quickViewProduct.oldPrice.toLocaleString()}</span><span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">Save {Math.round(((quickViewProduct.oldPrice - quickViewProduct.price) / quickViewProduct.oldPrice) * 100)}%</span></>}</div>
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
            <div className="p-4 border-t border-stone-200 flex gap-3"><button onClick={clearAllFilters} className="flex-1 border-2 border-stone-300 text-stone-800 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full">Clear All</button><button onClick={() => setShowMobileFilter(false)} className="flex-1 bg-primary text-white py-3.5 text-xs font-bold uppercase tracking-widest rounded-full">Apply ({filteredDupattas.length})</button></div>
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

export default Dupattas;