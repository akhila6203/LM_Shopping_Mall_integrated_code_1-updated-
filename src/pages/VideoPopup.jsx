import { useEffect } from "react";
import { useShop } from "../ShopContext.jsx";

const VideoPopup = () => {
  const { customer, authLoading, openLoginModal } = useShop();

  useEffect(() => {
    if (authLoading) return;

    const token = sessionStorage.getItem("customer_token");
    if (token || customer) return;
    if (sessionStorage.getItem("login_popup_dismissed")) return;

    const timer = setTimeout(() => {
      openLoginModal({});
    }, 2000);

    return () => clearTimeout(timer);
  }, [authLoading, customer, openLoginModal]);

  return null;
};

export default VideoPopup;
