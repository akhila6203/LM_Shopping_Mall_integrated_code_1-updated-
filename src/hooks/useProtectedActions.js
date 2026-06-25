import { useNavigate, useLocation } from "react-router-dom";
import { useShop } from "../ShopContext.jsx";

export const useProtectedActions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, toggleWishlist, openLoginModal, isLoggedIn } = useShop();

  const isAuthenticated = () => isLoggedIn();

  const redirectToLogin = (pendingAction, fromPath) => {
    openLoginModal({
      from: fromPath || location,
      pendingAction,
    });
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated()) {
      redirectToLogin({ type: "addToCart", product });
      return false;
    }
    return addToCart(product);
  };

  const handleBuyNow = async (product) => {
    if (!isAuthenticated()) {
      redirectToLogin({ type: "buyNow", product }, { pathname: "/cart" });
      return false;
    }
    const success = await addToCart(product);
    if (success) navigate("/cart");
    return success;
  };

  const handleToggleWishlist = async (product) => {
    if (!isAuthenticated()) {
      redirectToLogin(
        { type: "toggleWishlist", product },
        { pathname: "/profile", search: "?tab=wishlist" }
      );
      return false;
    }
    return toggleWishlist(product);
  };

  return {
    isAuthenticated,
    handleAddToCart,
    handleBuyNow,
    handleToggleWishlist,
  };
};
