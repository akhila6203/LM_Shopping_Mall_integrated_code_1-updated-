import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();
export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  
  // 🔥 AUTH STATE - GLOBAL
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userAuth");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 1. PAGE LOAD HOTE HI PURANA DATA BROWSER SE NIKALNA
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("llmShop_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("llmShop_wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // 2. JAB BHI CART MEIN KUCH ADD/REMOVE HO, USE BROWSER MEIN PERMANENT SAVE KARNA
  useEffect(() => {
    localStorage.setItem("llmShop_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("llmShop_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // 🔥 AUTH FUNCTIONS
  const login = (userData) => {
    localStorage.setItem("userAuth", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("userAuth");
    localStorage.removeItem("rememberedEmail");
    setUser(null);
  };

  const updateUser = (userData) => {
    localStorage.setItem("userAuth", JSON.stringify(userData));
    setUser(userData);
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  // --- ADD TO CART ---
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1, size: "Free Size" }];
    });
  };

  // --- REMOVE FROM CART ---
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // --- UPDATE QUANTITY ---
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, qty: newQty } : item));
  };

  // --- UPDATE SIZE ---
  const updateSize = (id, newSize) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, size: newSize } : item));
  };

  // --- TOGGLE WISHLIST (Add/Remove) ---
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      return [...prev, product];
    });
  };

  // ✅ REMOVE FROM WISHLIST - DIRECT FUNCTION
  const removeFromWishlist = (id) => {
    console.log("removeFromWishlist called with id:", id);
    setWishlist((prev) => {
      const newWishlist = prev.filter((item) => item.id !== id);
      console.log("Old wishlist length:", prev.length, "New wishlist length:", newWishlist.length);
      return newWishlist;
    });
  };

  // ✅ ADD TO WISHLIST - DIRECT FUNCTION
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (!exists) {
        return [...prev, product];
      }
      return prev;
    });
  };

  // ✅ CHECK IF PRODUCT IS IN WISHLIST
  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  // ✅ CLEAR WISHLIST
  const clearWishlist = () => {
    setWishlist([]);
  };

  // ✅ CLEAR CART
  const clearCart = () => {
    setCart([]);
  };

  // ✅ GET CART TOTAL
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);
  };

  // ✅ GET CART COUNT
  const getCartCount = () => {
    return cart.reduce((count, item) => count + (item.qty || 1), 0);
  };

  return (
    <ShopContext.Provider value={{ 
      // AUTH
      user,
      login,
      logout,
      updateUser,
      isLoggedIn,
      
      // CART
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      updateSize,
      clearCart,
      getCartTotal,
      getCartCount,
      
      // WISHLIST
      wishlist, 
      toggleWishlist,
      removeFromWishlist,
      addToWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </ShopContext.Provider>
  );
};