import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Heart, ShoppingCart, Menu, X, Phone, Mail, ChevronDown, Shield, LogOut, CreditCard } from "lucide-react"; 
import { useShop } from "../ShopContext.jsx"; 

import { getCategoryHierarchy } from "@/services/categoryService";
import { getProducts } from "@/services/productService";
import { getStoreInformation } from "@/services/settingService";
import { getImageUrl } from "@/api/axiosClient";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [navLinks, setNavLinks] = useState([]);
  const [storeInfo, setStoreInfo] = useState({
  logo: "",
  email: "",
  phone: "",
});
  
  const [placeholder, setPlaceholder] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const navigate = useNavigate();
  // ✅ STEP 2: Get user and logout from context
  const { cart, wishlist, removeFromCart, updateQuantity, user, logout } = useShop();
  
  // ✅ STEP 3: Remove isLoggedIn state - use user directly

  const allProducts = ["Saree", "Silk Saree", "Banarasi Saree", "Kanjeevaram Saree", "Organza Saree", "Lehenga", "Kurta", "Dupatta", "Blouse", "Jewellery", "Party Wear"];
  const searchPhrases = ["What's trending for Mehendi?", "Search for Banarasi Sarees...", "Latest Bridal Lehengas...", "Designer Kurtas for Men..."];


useEffect(() => {
  const loadNavbarData = async () => {
    let categories = [];
    let store = {};

    try {
      categories = await getCategoryHierarchy();
    } catch (error) {
      console.error("Categories fetch error:", error);
    }

    try {
      store = await getStoreInformation();
    } catch (error) {
      console.error("Store info fetch error:", error);
    }

    setStoreInfo({
      logo: store.storeLogo ? getImageUrl(store.storeLogo) : "/logo.png",
      email: store.contactEmail || "",
      phone: store.whatsappNumber || "",
    });

    const getPriorityIndex = (name = "") => {
      const value = name.toLowerCase().trim();

      if (value.includes("women")) return 1;
      if (value.includes("men")) return 2;
      if (value.includes("jewel")) return 3;

      return 999;
    };

    const sortedCategories = [...(categories || [])].sort((a, b) => {
      const priorityA = getPriorityIndex(a.name);
      const priorityB = getPriorityIndex(b.name);

      if (priorityA !== priorityB) return priorityA - priorityB;

      return a.name.localeCompare(b.name);
    });

    const categoryLinks = await Promise.all(
      sortedCategories.map(async (cat) => {
        let featuredImage = {
          url: cat.image ? getImageUrl(cat.image) : "",
          title: cat.name,
          subtitle: "Explore Collection",
          link: `/shop?category_id=${cat.id}`,
        };

        try {
          const products = await getProducts({
            status: "active",
            category_id: cat.id,
            limit: 1,
          });

          const product = products?.[0];

          if (product) {
            const img = product.thumbnail || product.images?.[0]?.image || cat.image || "";

            featuredImage = {
              url: img ? getImageUrl(img) : "",
              title: product.name || cat.name,
              subtitle: cat.name,
              link: product.slug ? `/product/${product.slug}` : `/shop?category_id=${cat.id}`,
            };
          }
        } catch (error) {
          console.error("Navbar product image fetch error:", error);
        }

        return {
          label: cat.name,
          path: `/shop?category_id=${cat.id}`,
          hasDropdown: cat.sub_categories?.length > 0,
          dropdownContent: {
            columns: (cat.sub_categories || []).map((sub) => ({
              title: sub.name,
              subPath: `/products/subcategory/${sub.id}`,
              links:
                sub.child_categories?.length > 0
                  ? sub.child_categories.map((child) => ({
                      name: child.name,
                      path: `/products/childcategory/${child.id}`,
                    }))
                  : [
                      {
                        name: `All ${sub.name}`,
                        path: `/products/subcategory/${sub.id}`,
                      },
                    ],
            })),
            featuredImage,
          },
        };
      })
    );

    setNavLinks([
      ...categoryLinks,
      { label: "About Us", path: "/about", hasDropdown: false },
      { label: "Contact Us", path: "/contact", hasDropdown: false },
    ]);
  };

  loadNavbarData();
}, []);


  // ✅ Function to handle dropdown link click - navigates with URL parameter
  const handleDropdownClick = (item) => {
    navigate(item.path);
    setActiveDropdown(null);
  };

  useEffect(() => {
    const currentPhrase = searchPhrases[typingIndex];
    let timer;

    if (searchOpen) {
      if (isDeleting) {
        timer = setTimeout(() => {
          setPlaceholder(currentPhrase.substring(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        }, 50);
      } else {
        timer = setTimeout(() => {
          setPlaceholder(currentPhrase.substring(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        }, 100);
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        timer = setTimeout(() => setIsDeleting(true), 1500); 
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTypingIndex((prev) => (prev + 1) % searchPhrases.length);
      }
    }
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, typingIndex, searchOpen]);

  // ✅ STEP 1: REMOVE old useEffect that reads localStorage - not needed anymore

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setSuggestions([]);
    } else {
      const filtered = allProducts.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
    }
  }, [searchTerm]);

  const handleSearchSubmit = (term) => {
    if (!term.trim()) return;
    const lowerTerm = term.toLowerCase();
    setSearchOpen(false);
    setSearchTerm(""); 

    if (lowerTerm.includes("saree")) navigate("/products/subcategory/sarees");
    else if (lowerTerm.includes("shirt")) navigate("/products/subcategory/shirts");
    else if (lowerTerm.includes("kurta")) navigate("/products/subcategory/kurtas");
    else if (lowerTerm.includes("bangle")) navigate("/products/childcategory/bangles");
    else if (lowerTerm.includes("jewel")) navigate("/products/subcategory/jewellery");
    else navigate("/shop");
  };

  const handleUserIconClick = () => {
    if (user) {
      setShowUserMenu(false);
      navigate("/profile");
    } else {
      navigate("/account");
    }
  };

  // ✅ STEP 5: Updated logout function using context logout
  const handleLogout = () => {
    logout(); // ✅ context logout
    setShowUserMenu(false);
    navigate("/");
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const freeShippingThreshold = 999;
  const amountToFreeShipping = freeShippingThreshold - subtotal;
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const trendingSearches = ["Kanjeevaram Silk", "Designer Kurtas", "Bridal Lehenga", "Organza Saree"];

  return (
    <>
      <header className={`w-full z-40 transition-all duration-300 ${scrolled ? "fixed top-0 shadow-xl" : "relative"}`}>
        
        {!scrolled && (
          <div className="bg-primary text-white">
            <div className="container flex justify-between items-center py-2 px-4">
              <div className="flex items-center gap-6">
                {storeInfo.email && (
                    <a href={`mailto:${storeInfo.email}`} className="flex items-center gap-1.5 text-xs hover:text-orange-100 transition-colors">
                      <Mail className="w-3 h-3" /> {storeInfo.email}
                    </a>
                  )}

                {storeInfo.phone && (
                  <a href={`tel:${String(storeInfo.phone).replace(/\D/g, "")}`} className="hidden sm:flex items-center gap-1.5 text-xs hover:text-orange-100 transition-colors">
                    <Phone className="w-3 h-3" /> {storeInfo.phone}
                  </a>
                )}
              </div>
              <div className="hidden md:flex items-center gap-6 text-xs">
                <Link to="/track-order" className="flex items-center gap-1.5 hover:text-orange-100 transition-colors">Track Order</Link>
                <Link to="/store-locator" className="flex items-center gap-1.5 hover:text-orange-100 transition-colors">Store Locator</Link>
              </div>
            </div>
          </div>
        )}

        <nav className="bg-white shadow-sm relative z-50">
          <div className="container flex items-center justify-between h-20">
            
            <Link to="/" className="flex items-center">
            <img
              src={storeInfo.logo || "/logo.png"}
              alt="LM Shop"
              className="h-14 object-contain"
            />
            {/* <img src={storeInfo.logo} alt="LM Shop" className="h-14 object-contain" /> */}
              
            </Link>

            <ul className="hidden lg:flex items-center h-full">
              {navLinks.map((link) => (
                <li key={link.label} className="h-full flex items-center" onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.label)} onMouseLeave={() => setActiveDropdown(null)}>
                  <Link to={link.path} className="flex items-center gap-1 px-4 text-sm font-semibold text-gray-600 hover:text-primary transition-colors duration-200 uppercase tracking-wide">
                    {link.label} {link.hasDropdown && <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180 text-primary' : ''}`} />}
                  </Link>

                  {link.hasDropdown && activeDropdown === link.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-5xl bg-white shadow-2xl border border-gray-100 rounded-b-xl overflow-hidden z-50 mt-0 origin-top animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-6">
                        <div className="flex gap-6">
                          <div className="flex-1 grid grid-cols-4 gap-4">
                            {link.dropdownContent?.columns.map((column, idx) => (
                              <div key={idx}>
                                <button
                                  onClick={() =>
                                    handleDropdownClick({
                                      path: column.subPath || column.links[0]?.path,
                                    })
                                  }
                                  className="text-xs font-bold text-primary uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 hover:text-orange-600 transition-colors w-full text-left"
                                >
                                  {column.title}
                                </button>
                                <ul className="space-y-2">
                                  {column.links.map((item) => (
                                    <li key={item.name}>
                                      <button 
                                        onClick={() => handleDropdownClick(item)}
                                        className="text-sm text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center gap-2 w-full text-left cursor-pointer"
                                      >
                                        {item.name}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          {link.dropdownContent?.featuredImage && (
                            <div className="w-56 flex-shrink-0">
                              <Link to={link.dropdownContent.featuredImage.link} className="block group" onClick={() => setActiveDropdown(null)}>
                                <div className="relative rounded-lg overflow-hidden">
                                  <img src={link.dropdownContent.featuredImage.url} alt={link.dropdownContent.featuredImage.title} className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                                    <p className="text-white/80 text-xs mb-1">{link.dropdownContent.featuredImage.subtitle}</p>
                                    <p className="text-white font-bold text-base">{link.dropdownContent.featuredImage.title}</p>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-50 px-6 py-2.5 border-t border-gray-100 flex items-center justify-between">
                        <Link to={link.path} className="text-xs font-semibold text-primary hover:text-orange-600 transition-colors flex items-center gap-1" onClick={() => setActiveDropdown(null)}>
                          View All {link.label} →
                        </Link>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Premium Quality Assured
                        </span>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-all duration-200">
                <Search className="w-5 h-5" />
              </button>
              
              {/* ✅ STEP 3: Use 'user' instead of 'isLoggedIn' */}
              <div 
                className="relative hidden sm:flex" 
                onMouseEnter={() => user && setShowUserMenu(true)} 
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button 
                  onClick={handleUserIconClick} 
                  className="p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-all duration-200 relative cursor-pointer"
                >
                  <User className="w-5 h-5" />
                  {user && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>}
                </button>

                {/* ✅ STEP 3: Use 'user' instead of 'isLoggedIn' */}
                {user && showUserMenu && (
                  <div className="absolute right-0 top-full pt-2 w-56 z-[100]">
                    <div className="bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-gray-100 py-3 rounded-sm animate-in fade-in zoom-in-95 duration-200">
                      {/* ✅ STEP 4: Use user?.name */}
                      <p className="px-5 mb-3 text-[15px] font-medium text-gray-800 tracking-wide">
                        Welcome {user?.name?.split(' ')[0] || "User"}!
                      </p>
                      <div className="flex flex-col">
                        <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-4 px-5 py-2.5 text-[15px] text-gray-800 hover:text-primary transition-colors">
                          <User className="w-[18px] h-[18px] text-primary" strokeWidth={1.5} /> Account Details
                        </Link>
                        <Link to="/profile?tab=orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-4 px-5 py-2.5 text-[15px] text-gray-800 hover:text-primary transition-colors">
                          <CreditCard className="w-[18px] h-[18px] text-primary" strokeWidth={1.5} /> Order History
                        </Link>
                        <Link to="/profile?tab=wishlist" onClick={() => setShowUserMenu(false)} className="flex items-center gap-4 px-5 py-2.5 text-[15px] text-gray-800 hover:text-primary transition-colors">
                          <Heart className="w-[18px] h-[18px] text-primary" strokeWidth={1.5} /> Wishlist
                        </Link>
                      </div>
                      <button onClick={handleLogout} className="mt-2 px-5 py-2 text-[15px] text-gray-800 hover:text-primary w-full text-left transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="/profile?tab=wishlist" className="hidden sm:flex p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-all duration-200 relative">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold shadow-md">{wishlist.length}</span>}
              </Link>
              
              <button
                onClick={() => {
                  if (user) navigate("/cart");
                  else navigate("/account");
                }}
                className="p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-all duration-200 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>
              {/* <button onClick={() => { if(user) setIsCartOpen(true); else navigate("/account"); }} className="p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-all duration-200 relative">
                <ShoppingCart className="w-5 h-5" /> 
                {cart.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold shadow-md">{totalItems}</span>}
              </button> */}
              
              <button className="lg:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[80]" onClick={() => setSearchOpen(false)} />
          <div className="fixed top-0 left-0 right-0 bg-white z-[90] shadow-xl transform transition-transform duration-300">
            <div className="container py-4"> 
              <div className="max-w-2xl mx-auto">
                <div className="relative flex items-center border-b-2 border-primary pb-2">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearchSubmit(searchTerm);
                    }}
                    className="w-full text-base text-gray-800 focus:outline-none bg-transparent"
                    autoFocus
                  />
                  <button onClick={() => setSearchOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors ml-2">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                
                {suggestions.length > 0 && (
                  <div className="bg-white mt-1 shadow-lg border border-gray-100 rounded-b-md overflow-hidden absolute max-w-2xl w-full left-0 right-0 mx-auto z-[95]">
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-2.5 hover:bg-orange-50 cursor-pointer transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                        onClick={() => handleSearchSubmit(item)}
                      >
                        <Search className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-700 text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Trending:</p>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button key={term} onClick={() => handleSearchSubmit(term)} className="px-3 py-1 bg-gray-50 hover:bg-orange-50 hover:text-primary text-xs text-gray-600 rounded-sm transition-colors border border-gray-100">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CART DRAWER */}
      {/* {isCartOpen && <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setIsCartOpen(false)} />}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg">Shopping Bag ({cart.length})</h2>
          <button onClick={() => setIsCartOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Your bag is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 mb-4 border-b pb-4">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-md" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold line-clamp-2">{item.name}</h4>
                  <p className="text-primary font-bold mt-1">₹{(item.price || 0).toLocaleString("en-IN")}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button onClick={() => updateQuantity && updateQuantity(item.id, (item.qty || 1) - 1)} className="px-2 py-1 hover:bg-gray-100">-</button>
                      <span className="px-3 py-1 text-xs">{item.qty || 1}</span>
                      <button onClick={() => updateQuantity && updateQuantity(item.id, (item.qty || 1) + 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total:</span> <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <button onClick={() => { setIsCartOpen(false); navigate("/checkout"); }} className="w-full bg-primary text-white py-3 font-bold rounded-full hover:bg-primary/90 transition">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div> */}

      {/* MOBILE MENU */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[40]" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white z-[50] shadow-xl overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <img
                src={storeInfo.logo || "/logo.png"}
                alt="LM Shop"
                className="h-8 object-contain"
              />
              {/* <img src={storeInfo.logo} alt="LM Shop" className="h-8 object-contain" /> */}
              
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.path} className="block py-3 text-gray-700 border-b border-gray-100" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t">
                {user ? (
                  <>
                    <p className="text-sm font-semibold mb-2">Welcome, {user?.name?.split(' ')[0]}</p>
                    <Link to="/profile" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>My Profile</Link>
                    <Link to="/profile?tab=orders" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Order History</Link>
                    <Link to="/profile?tab=wishlist" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Wishlist</Link>
                    <button onClick={handleLogout} className="block py-2 text-red-500 w-full text-left">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/account" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Sign In / Register</Link>
                    <Link to="/profile?tab=wishlist" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Wishlist</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}} />
    </>
  );
};
  
export default Navbar;





// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Search, User, Heart, ShoppingCart, Menu, X, Phone, Mail, ChevronDown, Shield, LogOut, CreditCard } from "lucide-react"; 
// import { useShop } from "../ShopContext.jsx"; 

// import { getCategoryHierarchy } from "@/services/categoryService";
// import { getProducts } from "@/services/productService";
// import { getStoreInformation } from "@/services/settingService";
// import { getImageUrl } from "@/api/axiosClient";

// const Navbar = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const [navLinks, setNavLinks] = useState([]);
//   const [storeInfo, setStoreInfo] = useState({
//   logo: "",
//   email: "",
//   phone: "",
// });
  
//   const [placeholder, setPlaceholder] = useState("");
//   const [typingIndex, setTypingIndex] = useState(0);
//   const [charIndex, setCharIndex] = useState(0);
//   const [isDeleting, setIsDeleting] = useState(false);
  
//   const navigate = useNavigate();
//   // ✅ STEP 2: Get user and logout from context
//   const { cart, wishlist, removeFromCart, updateQuantity, user, logout } = useShop();
  
//   // ✅ STEP 3: Remove isLoggedIn state - use user directly

//   const allProducts = ["Saree", "Silk Saree", "Banarasi Saree", "Kanjeevaram Saree", "Organza Saree", "Lehenga", "Kurta", "Dupatta", "Blouse", "Jewellery", "Party Wear"];
//   const searchPhrases = ["What's trending for Mehendi?", "Search for Banarasi Sarees...", "Latest Bridal Lehengas...", "Designer Kurtas for Men..."];


//   useEffect(() => {
//   const loadNavbarData = async () => {
//     try {
//       const [categories, store] = await Promise.all([
//         getCategoryHierarchy(),
//         getStoreInformation(),
//       ]);

//       const getPriorityIndex = (name = "") => {
//         const value = name.toLowerCase().trim();

//         if (value.includes("women")) return 1;
//         if (value.includes("men")) return 2;
//         if (value.includes("jewel")) return 3;

//         return 999;
//       };

//       const sortedCategories = [...(categories || [])].sort((a, b) => {
//         const priorityA = getPriorityIndex(a.name);
//         const priorityB = getPriorityIndex(b.name);

//         if (priorityA !== priorityB) return priorityA - priorityB;

//         return a.name.localeCompare(b.name);
//       });

//       setStoreInfo({
//         logo: store.storeLogo ? getImageUrl(store.storeLogo) : "/logo.png",
//         email: store.contactEmail || "",
//         phone: store.whatsappNumber || "",
//       });

//       const categoryLinks = await Promise.all(
//         sortedCategories.map(async (cat) => {
//           let featuredImage = null;

//           try {
//             const products = await getProducts({
//               status: "active",
//               category_id: cat.id,
//               limit: 1,
//             });

//             const product = products?.[0];

//             if (product) {
//               const img =
//                 product.thumbnail ||
//                 product.images?.[0]?.image ||
//                 cat.image ||
//                 "";

//               featuredImage = {
//                 url: img ? getImageUrl(img) : "",
//                 title: product.name || cat.name,
//                 subtitle: cat.name,
//                 link: product.slug
//                   ? `/product/${product.slug}`
//                   : `/shop?category_id=${cat.id}`,
//               };
//             } else {
//               featuredImage = {
//                 url: cat.image ? getImageUrl(cat.image) : "",
//                 title: cat.name,
//                 subtitle: "Explore Collection",
//                 link: `/shop?category_id=${cat.id}`,
//               };
//             }
//           } catch (error) {
//             featuredImage = {
//               url: cat.image ? getImageUrl(cat.image) : "",
//               title: cat.name,
//               subtitle: "Explore Collection",
//               link: `/shop?category_id=${cat.id}`,
//             };
//           }

//           return {
//             label: cat.name,
//             path: `/shop?category_id=${cat.id}`,
//             hasDropdown: cat.sub_categories?.length > 0,
//             dropdownContent: {
//               columns: (cat.sub_categories || []).map((sub) => ({
//                 title: sub.name,
//                 subPath: `/shop?sub_category_id=${sub.id}`,
//                 links:
//                   sub.child_categories?.length > 0
//                     ? sub.child_categories.map((child) => ({
//                         name: child.name,
//                         path: `/shop?child_category_id=${child.id}`,
//                       }))
//                     : [
//                         {
//                           name: `All ${sub.name}`,
//                           path: `/shop?sub_category_id=${sub.id}`,
//                         },
//                       ],
//               })),
//               featuredImage,
//             },
//           };
//         })
//       );

//       setNavLinks([
//         ...categoryLinks,
//         { label: "About Us", path: "/about", hasDropdown: false },
//         { label: "Contact Us", path: "/contact", hasDropdown: false },
//       ]);
//     } catch (error) {
//       console.error("Navbar data fetch error:", error);
//       setStoreInfo({
//         logo: "/logo.png",
//         email: "",
//         phone: "",
//       });
//       setNavLinks([
//         { label: "About Us", path: "/about", hasDropdown: false },
//         { label: "Contact Us", path: "/contact", hasDropdown: false },
//       ]);
//     }
//   };

//   loadNavbarData();
// }, []);

//   // ✅ Function to handle dropdown link click - navigates with URL parameter
//   const handleDropdownClick = (item) => {
//     navigate(item.path);
//     setActiveDropdown(null);
//   };

//   useEffect(() => {
//     const currentPhrase = searchPhrases[typingIndex];
//     let timer;

//     if (searchOpen) {
//       if (isDeleting) {
//         timer = setTimeout(() => {
//           setPlaceholder(currentPhrase.substring(0, charIndex - 1));
//           setCharIndex(prev => prev - 1);
//         }, 50);
//       } else {
//         timer = setTimeout(() => {
//           setPlaceholder(currentPhrase.substring(0, charIndex + 1));
//           setCharIndex(prev => prev + 1);
//         }, 100);
//       }

//       if (!isDeleting && charIndex === currentPhrase.length) {
//         timer = setTimeout(() => setIsDeleting(true), 1500); 
//       } else if (isDeleting && charIndex === 0) {
//         setIsDeleting(false);
//         setTypingIndex((prev) => (prev + 1) % searchPhrases.length);
//       }
//     }
//     return () => clearTimeout(timer);
//   }, [charIndex, isDeleting, typingIndex, searchOpen]);

//   // ✅ STEP 1: REMOVE old useEffect that reads localStorage - not needed anymore

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     if (searchTerm === "") {
//       setSuggestions([]);
//     } else {
//       const filtered = allProducts.filter(item =>
//         item.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setSuggestions(filtered);
//     }
//   }, [searchTerm]);

//   const handleSearchSubmit = (term) => {
//     if (!term.trim()) return;
//     const lowerTerm = term.toLowerCase();
//     setSearchOpen(false);
//     setSearchTerm(""); 

//     if (lowerTerm.includes("saree")) navigate("/products/subcategory/sarees");
//     else if (lowerTerm.includes("shirt")) navigate("/products/subcategory/shirts");
//     else if (lowerTerm.includes("kurta")) navigate("/products/subcategory/kurtas");
//     else if (lowerTerm.includes("bangle")) navigate("/products/childcategory/bangles");
//     else if (lowerTerm.includes("jewel")) navigate("/products/subcategory/jewellery");
//     else navigate("/shop");
//   };

//   const handleUserIconClick = () => {
//     if (user) {
//       setShowUserMenu(false);
//       navigate("/profile");
//     } else {
//       navigate("/account");
//     }
//   };

//   // ✅ STEP 5: Updated logout function using context logout
//   const handleLogout = () => {
//     logout(); // ✅ context logout
//     setShowUserMenu(false);
//     navigate("/");
//   };

//   const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
//   const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
//   const freeShippingThreshold = 999;
//   const amountToFreeShipping = freeShippingThreshold - subtotal;
//   const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

//   const trendingSearches = ["Kanjeevaram Silk", "Designer Kurtas", "Bridal Lehenga", "Organza Saree"];

//   return (
//     <>
//       <header className={`w-full z-40 transition-all duration-300 ${scrolled ? "fixed top-0 shadow-xl" : "relative"}`}>
        
//         {!scrolled && (
//           <div className="bg-primary text-white">
//             <div className="container flex justify-between items-center py-2 px-4">
//               <div className="flex items-center gap-6">
//                 {storeInfo.email && (
//                     <a href={`mailto:${storeInfo.email}`} className="flex items-center gap-1.5 text-xs hover:text-orange-100 transition-colors">
//                       <Mail className="w-3 h-3" /> {storeInfo.email}
//                     </a>
//                   )}

//                 {storeInfo.phone && (
//                   <a href={`tel:${String(storeInfo.phone).replace(/\D/g, "")}`} className="hidden sm:flex items-center gap-1.5 text-xs hover:text-orange-100 transition-colors">
//                     <Phone className="w-3 h-3" /> {storeInfo.phone}
//                   </a>
//                 )}
//               </div>
//               <div className="hidden md:flex items-center gap-6 text-xs">
//                 <Link to="/track-order" className="flex items-center gap-1.5 hover:text-orange-100 transition-colors">Track Order</Link>
//                 <Link to="/store-locator" className="flex items-center gap-1.5 hover:text-orange-100 transition-colors">Store Locator</Link>
//               </div>
//             </div>
//           </div>
//         )}

//         <nav className="bg-white shadow-sm relative z-50">
//           <div className="container flex items-center justify-between h-20">
            
//             <Link to="/" className="flex items-center">
//             <img
//               src={storeInfo.logo || "/logo.png"}
//               alt="LM Shop"
//               className="h-14 object-contain"
//             />
//             {/* <img src={storeInfo.logo} alt="LM Shop" className="h-14 object-contain" /> */}
              
//             </Link>

//             <ul className="hidden lg:flex items-center h-full">
//               {navLinks.map((link) => (
//                 <li key={link.label} className="h-full flex items-center" onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.label)} onMouseLeave={() => setActiveDropdown(null)}>
//                   <Link to={link.path} className="flex items-center gap-1 px-4 text-sm font-semibold text-gray-600 hover:text-primary transition-colors duration-200 uppercase tracking-wide">
//                     {link.label} {link.hasDropdown && <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180 text-primary' : ''}`} />}
//                   </Link>

//                   {link.hasDropdown && activeDropdown === link.label && (
//                     <div className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-5xl bg-white shadow-2xl border border-gray-100 rounded-b-xl overflow-hidden z-50 mt-0 origin-top animate-in fade-in zoom-in-95 duration-200">
//                       <div className="p-6">
//                         <div className="flex gap-6">
//                           <div className="flex-1 grid grid-cols-4 gap-4">
//                             {link.dropdownContent?.columns.map((column, idx) => (
//                               <div key={idx}>
//                                 <button
//                                   onClick={() =>
//                                     handleDropdownClick({
//                                       path: column.subPath || column.links[0]?.path,
//                                     })
//                                   }
//                                   className="text-xs font-bold text-primary uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 hover:text-orange-600 transition-colors w-full text-left"
//                                 >
//                                   {column.title}
//                                 </button>
//                                 <ul className="space-y-2">
//                                   {column.links.map((item) => (
//                                     <li key={item.name}>
//                                       <button 
//                                         onClick={() => handleDropdownClick(item)}
//                                         className="text-sm text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center gap-2 w-full text-left cursor-pointer"
//                                       >
//                                         {item.name}
//                                       </button>
//                                     </li>
//                                   ))}
//                                 </ul>
//                               </div>
//                             ))}
//                           </div>
//                           {link.dropdownContent?.featuredImage && (
//                             <div className="w-56 flex-shrink-0">
//                               <Link to={link.dropdownContent.featuredImage.link} className="block group" onClick={() => setActiveDropdown(null)}>
//                                 <div className="relative rounded-lg overflow-hidden">
//                                   <img src={link.dropdownContent.featuredImage.url} alt={link.dropdownContent.featuredImage.title} className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
//                                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
//                                     <p className="text-white/80 text-xs mb-1">{link.dropdownContent.featuredImage.subtitle}</p>
//                                     <p className="text-white font-bold text-base">{link.dropdownContent.featuredImage.title}</p>
//                                   </div>
//                                 </div>
//                               </Link>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="bg-gray-50 px-6 py-2.5 border-t border-gray-100 flex items-center justify-between">
//                         <Link to={link.path} className="text-xs font-semibold text-primary hover:text-orange-600 transition-colors flex items-center gap-1" onClick={() => setActiveDropdown(null)}>
//                           View All {link.label} →
//                         </Link>
//                         <span className="text-[10px] text-gray-400 flex items-center gap-1">
//                           <Shield className="w-3 h-3" /> Premium Quality Assured
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </li>
//               ))}
//             </ul>

//             <div className="flex items-center gap-2">
//               <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-all duration-200">
//                 <Search className="w-5 h-5" />
//               </button>
              
//               {/* ✅ STEP 3: Use 'user' instead of 'isLoggedIn' */}
//               <div 
//                 className="relative hidden sm:flex" 
//                 onMouseEnter={() => user && setShowUserMenu(true)} 
//                 onMouseLeave={() => setShowUserMenu(false)}
//               >
//                 <button 
//                   onClick={handleUserIconClick} 
//                   className="p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-all duration-200 relative cursor-pointer"
//                 >
//                   <User className="w-5 h-5" />
//                   {user && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>}
//                 </button>

//                 {/* ✅ STEP 3: Use 'user' instead of 'isLoggedIn' */}
//                 {user && showUserMenu && (
//                   <div className="absolute right-0 top-full pt-2 w-56 z-[100]">
//                     <div className="bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-gray-100 py-3 rounded-sm animate-in fade-in zoom-in-95 duration-200">
//                       {/* ✅ STEP 4: Use user?.name */}
//                       <p className="px-5 mb-3 text-[15px] font-medium text-gray-800 tracking-wide">
//                         Welcome {user?.name?.split(' ')[0] || "User"}!
//                       </p>
//                       <div className="flex flex-col">
//                         <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-4 px-5 py-2.5 text-[15px] text-gray-800 hover:text-primary transition-colors">
//                           <User className="w-[18px] h-[18px] text-primary" strokeWidth={1.5} /> Account Details
//                         </Link>
//                         <Link to="/profile?tab=orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-4 px-5 py-2.5 text-[15px] text-gray-800 hover:text-primary transition-colors">
//                           <CreditCard className="w-[18px] h-[18px] text-primary" strokeWidth={1.5} /> Order History
//                         </Link>
//                         <Link to="/profile?tab=wishlist" onClick={() => setShowUserMenu(false)} className="flex items-center gap-4 px-5 py-2.5 text-[15px] text-gray-800 hover:text-primary transition-colors">
//                           <Heart className="w-[18px] h-[18px] text-primary" strokeWidth={1.5} /> Wishlist
//                         </Link>
//                       </div>
//                       <button onClick={handleLogout} className="mt-2 px-5 py-2 text-[15px] text-gray-800 hover:text-primary w-full text-left transition-colors">
//                         Sign Out
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               <Link to="/profile?tab=wishlist" className="hidden sm:flex p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-all duration-200 relative">
//                 <Heart className="w-5 h-5" />
//                 {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold shadow-md">{wishlist.length}</span>}
//               </Link>
              
//               <button onClick={() => { if(user) setIsCartOpen(true); else navigate("/account"); }} className="p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-all duration-200 relative">
//                 <ShoppingCart className="w-5 h-5" /> 
//                 {cart.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold shadow-md">{totalItems}</span>}
//               </button>
              
//               <button className="lg:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
//                 {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>
//         </nav>
//       </header>

//       {/* SEARCH OVERLAY */}
//       {searchOpen && (
//         <>
//           <div className="fixed inset-0 bg-black/30 z-[80]" onClick={() => setSearchOpen(false)} />
//           <div className="fixed top-0 left-0 right-0 bg-white z-[90] shadow-xl transform transition-transform duration-300">
//             <div className="container py-4"> 
//               <div className="max-w-2xl mx-auto">
//                 <div className="relative flex items-center border-b-2 border-primary pb-2">
//                   <Search className="w-5 h-5 text-gray-400 mr-3" />
//                   <input
//                     type="text"
//                     placeholder={placeholder}
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') handleSearchSubmit(searchTerm);
//                     }}
//                     className="w-full text-base text-gray-800 focus:outline-none bg-transparent"
//                     autoFocus
//                   />
//                   <button onClick={() => setSearchOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors ml-2">
//                     <X className="w-5 h-5 text-gray-400" />
//                   </button>
//                 </div>
                
//                 {suggestions.length > 0 && (
//                   <div className="bg-white mt-1 shadow-lg border border-gray-100 rounded-b-md overflow-hidden absolute max-w-2xl w-full left-0 right-0 mx-auto z-[95]">
//                     {suggestions.map((item, index) => (
//                       <div
//                         key={index}
//                         className="px-4 py-2.5 hover:bg-orange-50 cursor-pointer transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
//                         onClick={() => handleSearchSubmit(item)}
//                       >
//                         <Search className="w-3.5 h-3.5 text-gray-400" />
//                         <span className="text-gray-700 text-sm font-medium">{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div className="mt-4 flex items-center gap-3">
//                   <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Trending:</p>
//                   <div className="flex flex-wrap gap-2">
//                     {trendingSearches.map((term) => (
//                       <button key={term} onClick={() => handleSearchSubmit(term)} className="px-3 py-1 bg-gray-50 hover:bg-orange-50 hover:text-primary text-xs text-gray-600 rounded-sm transition-colors border border-gray-100">
//                         {term}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* CART DRAWER */}
//       {isCartOpen && <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setIsCartOpen(false)} />}
//       <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
//         <div className="p-4 border-b flex items-center justify-between">
//           <h2 className="font-bold text-lg">Shopping Bag ({cart.length})</h2>
//           <button onClick={() => setIsCartOpen(false)}><X className="w-5 h-5" /></button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-4">
//           {cart.length === 0 ? (
//             <div className="text-center text-gray-500 mt-10">
//               <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//               <p>Your bag is empty</p>
//             </div>
//           ) : (
//             cart.map(item => (
//               <div key={item.id} className="flex gap-4 mb-4 border-b pb-4">
//                 <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-md" />
//                 <div className="flex-1">
//                   <h4 className="text-sm font-semibold line-clamp-2">{item.name}</h4>
//                   <p className="text-primary font-bold mt-1">₹{(item.price || 0).toLocaleString("en-IN")}</p>
//                   <div className="flex items-center gap-3 mt-2">
//                     <div className="flex items-center border border-gray-200 rounded">
//                       <button onClick={() => updateQuantity && updateQuantity(item.id, (item.qty || 1) - 1)} className="px-2 py-1 hover:bg-gray-100">-</button>
//                       <span className="px-3 py-1 text-xs">{item.qty || 1}</span>
//                       <button onClick={() => updateQuantity && updateQuantity(item.id, (item.qty || 1) + 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
//                     </div>
//                     <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs">Remove</button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//         {cart.length > 0 && (
//           <div className="p-4 border-t">
//             <div className="flex justify-between font-bold text-lg mb-4">
//               <span>Total:</span> <span>₹{subtotal.toLocaleString("en-IN")}</span>
//             </div>
//             <button onClick={() => { setIsCartOpen(false); navigate("/checkout"); }} className="w-full bg-primary text-white py-3 font-bold rounded-full hover:bg-primary/90 transition">
//               Proceed to Checkout
//             </button>
//           </div>
//         )}
//       </div>

//       {/* MOBILE MENU */}
//       {mobileOpen && (
//         <>
//           <div className="fixed inset-0 bg-black/50 z-[40]" onClick={() => setMobileOpen(false)} />
//           <div className="fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white z-[50] shadow-xl overflow-y-auto">
//             <div className="p-4 border-b flex justify-between items-center">
//               <img
//                 src={storeInfo.logo || "/logo.png"}
//                 alt="LM Shop"
//                 className="h-8 object-contain"
//               />
//               {/* <img src={storeInfo.logo} alt="LM Shop" className="h-8 object-contain" /> */}
              
//               <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
//             </div>
//             <div className="p-4">
//               {navLinks.map((link) => (
//                 <Link key={link.label} to={link.path} className="block py-3 text-gray-700 border-b border-gray-100" onClick={() => setMobileOpen(false)}>
//                   {link.label}
//                 </Link>
//               ))}
//               <div className="mt-4 pt-4 border-t">
//                 {user ? (
//                   <>
//                     <p className="text-sm font-semibold mb-2">Welcome, {user?.name?.split(' ')[0]}</p>
//                     <Link to="/profile" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>My Profile</Link>
//                     <Link to="/profile?tab=orders" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Order History</Link>
//                     <Link to="/profile?tab=wishlist" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Wishlist</Link>
//                     <button onClick={handleLogout} className="block py-2 text-red-500 w-full text-left">Sign Out</button>
//                   </>
//                 ) : (
//                   <>
//                     <Link to="/account" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Sign In / Register</Link>
//                     <Link to="/profile?tab=wishlist" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Wishlist</Link>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       <style dangerouslySetInnerHTML={{__html: `
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}} />
//     </>
//   );
// };
  
// export default Navbar;


