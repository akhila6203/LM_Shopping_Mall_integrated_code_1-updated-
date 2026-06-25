import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCartItems,
  addCartItem,
  updateCartItemApi,
  removeCartItemApi,
  clearCartItemsApi,
} from "@/services/cartService";
import { getImageUrl } from "@/api/axiosClient";

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

const normalizeSizes = (product) => {
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
  const sizes = normalizeSizes(item);
  const cartId = item.cartItemId || item.cart_id;

  return {
    ...item,

    // cart table id — update/remove ki idi use avvali
    cartItemId: String(cartId),
    cart_id: cartId,

    // product id — product details ki idi use avvali
    id: item.product_id || item.id,
    product_id: item.product_id || item.id,

    slug: item.slug || "",
    name: item.name || "",
    qty: Number(item.qty || item.quantity || 1),

    size: item.size || item.selected_size || sizes[0] || "Free Size",
    color: item.color || item.selected_color || "",

    image: item.image
      ? getImageUrl(item.image)
      : item.thumbnail
      ? getImageUrl(item.thumbnail)
      : "",

    price: Number(item.price || item.offer_price || item.item_price || 0),
    oldPrice: Number(item.oldPrice || item.old_price || item.mrp || 0),

    fabric: item.fabric || "",
    material: item.material || "",
    stock: Number(item.stock || 0),

    sizes,
    colors: item.colors || [],
  };
};

const getItemKey = (item) => item.cartItemId || item.cart_id;

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const data = await getCartItems();
      setCart((data || []).map(normalizeCartItem));
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
  try {
    const sizes = normalizeSizes(product);

    const payload = {
      product_id: product.product_id || product.id,
      variant_id: product.variant_id || null,
      quantity: Number(product.quantity || product.qty || 1),
      selected_size: product.selected_size || product.size || "Free Size",
      selected_color: product.selected_color || product.color || "",
      item_price: Number(product.item_price || product.price || 0),
      item_data: {
        sizes,
        colors: product.colors || [],
        image: product.image || "",
        fabric: product.fabric || "",
        material: product.material || "",
        brand: product.brand || "",
      },
    };

    await addCartItem(payload);
    await fetchCart();
    window.dispatchEvent(new Event("cart-updated"));
    return true;
  } catch (error) {
    console.error("Add cart error:", error);
    alert(error.response?.data?.message || "Failed to add cart");
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
    } catch (error) {
      console.error("Clear cart error:", error);
      alert(error.response?.data?.message || "Clear cart failed");
      await fetchCart();
    }
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      return [...prev, product];
    });
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        cartLoading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSize,
        clearCart,
        wishlist,
        toggleWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};