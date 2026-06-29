import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import {
  getCartItems,
  addCartItem,
  updateCartItemApi,
  removeCartItemApi,
  clearCartItemsApi,
} from "@/services/cartService";
import { getWishlistItems, toggleWishlistApi } from "@/services/wishlistService";
import {
  loginCustomer,
  registerCustomer,
  logoutCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  updateCustomerAvatar,
} from "@/services/customerAuthService";
import { getImageUrl } from "@/api/axiosClient";
import { extractProductSizes } from "@/utils/productHelpers";

const ShopContext = createContext();
export const useShop = () => useContext(ShopContext);

const parseItemData = (item) => {
  const raw = item?.item_data;
  if (!raw) return {};
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const normalizeSizes = (product) => {
  const extracted = extractProductSizes(product);
  if (extracted.length) return extracted;

  const sizes =
    product.sizes ||
    product.available_sizes ||
    product.size_options ||
    product.variant_sizes ||
    [];

  if (Array.isArray(sizes)) return sizes.filter(Boolean);

  if (typeof sizes === "string") {
    return sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeCartItem = (item) => {
  const itemData = parseItemData(item);
  const sizes = normalizeSizes({ ...item, ...itemData });
  const cartId = item.cartItemId || item.cart_id || item.id;

  return {
    ...item,
    ...itemData,
    cartItemId: String(cartId),
    cart_id: cartId,
    id: item.product_id || item.id,
    product_id: item.product_id || item.id,
    variant_id: item.variant_id || null,
    slug: item.slug || itemData.slug || "",
    name: item.name || itemData.name || "",
    qty: Number(item.qty || item.quantity || 1),
    size: item.size || item.selected_size || sizes[0] || "Free Size",
    color: item.color || item.selected_color || "",
    image: itemData.image
      ? getImageUrl(itemData.image)
      : item.image
      ? getImageUrl(item.image)
      : item.thumbnail
      ? getImageUrl(item.thumbnail)
      : "",
    price: Number(item.price || item.offer_price || item.item_price || 0),
    oldPrice: Number(item.oldPrice || item.old_price || item.mrp || 0),
    fabric: item.fabric || itemData.fabric || "",
    material: item.material || itemData.material || "",
    brand: item.brand || itemData.brand || "",
    stock: Number(item.stock || 0),
    sizes,
    colors: item.colors || itemData.colors || [],
  };
};

const normalizeWishlistItem = (item) => {
  const product = item.product || {};
  const image = item.image || item.thumbnail || product.thumbnail || product.image || "";
  const price = Number(
    item.offer_price || item.price || product.offer_price || product.price || 0
  );

  return {
    ...item,
    id: item.product_id || item.id || product.id,
    product_id: item.product_id || item.id || product.id,
    slug: item.slug || product.slug || "",
    name: item.name || product.name || "",
    price,
    oldPrice: Number(item.old_price || item.price || product.price || price),
    image: image ? getImageUrl(image) : "",
    category: item.category_name || product.category_name || "",
    stock: Number(item.stock || product.stock || 0),
  };
};

const getItemKey = (item) => item.cartItemId || item.cart_id;

const parseAuthPayload = (response) => {
  const root = response?.data ?? response;
  const payload = root?.data ?? root;
  return {
    customer: payload?.customer ?? null,
    token: payload?.token ?? null,
    refreshToken: payload?.refreshToken ?? null,
  };
};

const parseProfilePayload = (response) => {
  const root = response?.data ?? response;
  const payload = root?.data ?? root;
  return payload?.customer ?? payload;
};

const normalizeCustomer = (customer) => {
  if (!customer) return null;
  return {
    ...customer,
    name:
      `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
      customer.name ||
      "User",
    profilePhoto: customer.avatar ? getImageUrl(customer.avatar) : customer.profilePhoto || "",
  };
};

const persistAuthTokens = (token, refreshToken) => {
  if (token) sessionStorage.setItem("customer_token", token);
  if (refreshToken) sessionStorage.setItem("customer_refresh_token", refreshToken);
};

const clearAuthTokens = () => {
  sessionStorage.removeItem("customer_token");
  sessionStorage.removeItem("customer_refresh_token");
};

export const ShopProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginModal, setLoginModal] = useState({ open: false, from: null, pendingAction: null });
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const openLoginModal = useCallback(({ from, pendingAction } = {}) => {
    if (sessionStorage.getItem("customer_token") && customer) return;
    setLoginModal({
      open: true,
      from: from || null,
      pendingAction: pendingAction || null,
    });
  }, [customer]);

  const closeLoginModal = useCallback(() => {
    setLoginModal({ open: false, from: null, pendingAction: null });
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const data = await getCartItems();
      setCart((data || []).map(normalizeCartItem));
    } catch (error) {
      console.error("Fetch cart error:", error);
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("customer_token");
      if (!token) {
        setWishlist([]);
        return;
      }
      const data = await getWishlistItems();
      setWishlist((data || []).map(normalizeWishlistItem));
    } catch (error) {
      console.error("Fetch wishlist error:", error);
      setWishlist([]);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const savedToken = sessionStorage.getItem("customer_token");
    if (!savedToken) {
      setCustomer(null);
      setToken(null);
      return null;
    }

    setToken(savedToken);
    const profileResponse = await getCustomerProfile();
    const profileCustomer = normalizeCustomer(parseProfilePayload(profileResponse));
    if (!profileCustomer) {
      throw new Error("Unable to load customer profile");
    }
    setCustomer(profileCustomer);
    return profileCustomer;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = sessionStorage.getItem("customer_token");
      if (!savedToken) {
        setCart([]);
        setWishlist([]);
        setAuthLoading(false);
        return;
      }

      setToken(savedToken);

      try {
        await refreshProfile();
        await fetchCart();
        await fetchWishlist();
      } catch (error) {
        console.error("Auth init error:", error);
        clearAuthTokens();
        setCustomer(null);
        setToken(null);
        setCart([]);
        setWishlist([]);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, [fetchCart, fetchWishlist, refreshProfile]);

  const login = async (identifier, password) => {
    const trimmed = identifier.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = trimmed.replace(/\D/g, "").slice(-10);
    const isEmailLogin = emailRegex.test(trimmed);

    const payload = isEmailLogin
      ? { email: trimmed.toLowerCase(), password }
      : { phone: phoneDigits, password };

    const response = await loginCustomer(payload);
    const { customer: authCustomer, token: authToken, refreshToken } =
      parseAuthPayload(response);

    if (!authToken || !authCustomer) {
      const message = response?.message || "Invalid Email or Password. Please try again.";
      throw Object.assign(new Error(message), { response: { data: response } });
    }

    persistAuthTokens(authToken, refreshToken);
    const normalizedCustomer = normalizeCustomer(authCustomer);
    setToken(authToken);
    setCustomer(normalizedCustomer);
    await fetchCart();
    await fetchWishlist();
    closeLoginModal();
    window.dispatchEvent(new Event("auth-updated"));
    window.dispatchEvent(new Event("cart-updated"));
    return normalizedCustomer;
  };

  const register = async (formData) => {
    const response = await registerCustomer(formData);
    if (response?.success === false) {
      const message = response?.message || "Registration failed. Please try again.";
      throw Object.assign(new Error(message), { response: { data: response } });
    }
    return response;
  };

  const logout = async () => {
    try {
      await logoutCustomer();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthTokens();
      setCustomer(null);
      setToken(null);
      setCart([]);
      setWishlist([]);
      closeLoginModal();
      window.dispatchEvent(new Event("auth-updated"));
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new Event("wishlist-updated"));
    }
  };

  const updateUser = async (userData) => {
    try {
      let response;
      if (userData.avatarFile instanceof File) {
        response = await updateCustomerAvatar(userData.avatarFile, {
          first_name: userData.first_name || userData.name?.split(" ")?.[0],
          last_name:
            userData.last_name ||
            userData.name?.split(" ")?.slice(1).join(" ") ||
            "",
          phone: userData.phone,
          gender: userData.gender,
          date_of_birth: userData.date_of_birth,
        });
      } else {
        response = await updateCustomerProfile({
          first_name: userData.first_name || userData.name?.split(" ")?.[0],
          last_name:
            userData.last_name ||
            userData.name?.split(" ")?.slice(1).join(" ") ||
            "",
          phone: userData.phone,
          gender: userData.gender,
          date_of_birth: userData.date_of_birth,
        });
      }
      const updated = normalizeCustomer(parseProfilePayload(response));
      if (updated) {
        setCustomer(updated);
      } else {
        setCustomer((prev) => normalizeCustomer({ ...prev, ...userData }));
      }
      window.dispatchEvent(new Event("auth-updated"));
      return updated;
    } catch (error) {
      setCustomer((prev) => normalizeCustomer({ ...prev, ...userData }));
      window.dispatchEvent(new Event("auth-updated"));
      throw error;
    }
  };

  const isLoggedIn = () =>
    Boolean(sessionStorage.getItem("customer_token") || customer);

  const addToCart = async (product) => {
    const token = sessionStorage.getItem("customer_token");
    if (!token) {
      return false;
    }

    try {
      const sizes = normalizeSizes(product);
      const itemData = product.item_data || {
        image: product.image || "",
        slug: product.slug || "",
        name: product.name || "",
        brand: product.brand || "",
        fabric: product.fabric || "",
        material: product.material || "",
        sizes,
        colors: product.colors || [],
      };

      const payload = {
        product_id: product.product_id || product.id,
        variant_id: product.variant_id || null,
        quantity: Number(product.quantity || product.qty || 1),
        selected_size: product.selected_size || product.size || sizes[0] || "Free Size",
        selected_color: product.selected_color || product.color || "",
        item_price: Number(
          product.item_price || product.price || product.offer_price || 0
        ),
        item_data: itemData,
      };

      await addCartItem(payload);
      await fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
      return true;
    } catch (error) {
      console.error("Add cart error:", error);
      alert(error.response?.data?.message || "Failed to add to cart");
      return false;
    }
  };

  const removeFromCart = async (key) => {
    try {
      const cartId = String(key);
      setCart((prev) =>
        prev.filter((item) => String(getItemKey(item)) !== cartId)
      );
      await removeCartItemApi(cartId);
      await fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Remove cart error:", error);
      alert(error.response?.data?.message || "Remove failed");
      await fetchCart();
    }
  };

  const updateQuantity = async (key, qty) => {
    const cartId = String(key);
    const newQty = Math.max(1, Number(qty) || 1);

    try {
      setCart((prev) =>
        prev.map((item) =>
          String(getItemKey(item)) === cartId ? { ...item, qty: newQty } : item
        )
      );
      await updateCartItemApi(cartId, { quantity: newQty });
      await fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Update quantity error:", error);
      alert(error.response?.data?.message || "Quantity update failed");
      await fetchCart();
    }
  };

  const updateSize = async (key, size) => {
    const cartId = String(key);

    try {
      setCart((prev) =>
        prev.map((item) =>
          String(getItemKey(item)) === cartId ? { ...item, size } : item
        )
      );
      await updateCartItemApi(cartId, { selected_size: size });
      await fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Update size error:", error);
      alert(error.response?.data?.message || "Size update failed");
      await fetchCart();
    }
  };

  const clearCart = async () => {
    try {
      setCart([]);
      await clearCartItemsApi();
      await fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Clear cart error:", error);
      alert(error.response?.data?.message || "Clear cart failed");
      await fetchCart();
    }
  };

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * (item.qty || 1), 0);

  const getCartCount = () =>
    cart.reduce((count, item) => count + Number(item.qty || item.quantity || 1), 0);

  const toggleWishlist = async (product) => {
    const token = sessionStorage.getItem("customer_token");
    if (!token) {
      return false;
    }

    try {
      await toggleWishlistApi(product.product_id || product.id);
      await fetchWishlist();
      window.dispatchEvent(new Event("wishlist-updated"));
      return true;
    } catch (error) {
      console.error("Toggle wishlist error:", error);
      alert(error.response?.data?.message || "Wishlist update failed");
      return false;
    }
  };

  const removeFromWishlist = async (id) => {
    const item = wishlist.find((w) => String(w.id) === String(id));
    if (item) await toggleWishlist(item);
  };

  const addToWishlist = async (product) => {
    const exists = wishlist.some(
      (item) => String(item.id) === String(product.id || product.product_id)
    );
    if (!exists) return toggleWishlist(product);
    return true;
  };

  const isInWishlist = (id) =>
    wishlist.some((item) => String(item.id) === String(id));

  const clearWishlist = () => setWishlist([]);

  return (
    <ShopContext.Provider
      value={{
        customer,
        user: customer,
        token,
        authLoading,
        loginModal,
        openLoginModal,
        closeLoginModal,
        login,
        register,
        logout,
        updateUser,
        refreshProfile,
        isLoggedIn,
        cart,
        cartLoading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSize,
        clearCart,
        getCartTotal,
        getCartCount,
        wishlist,
        fetchWishlist,
        toggleWishlist,
        removeFromWishlist,
        addToWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
