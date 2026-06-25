import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useShop } from "./ShopContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { customer, authLoading, openLoginModal } = useShop();
  const customerToken = sessionStorage.getItem("customer_token");
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && !customerToken && !customer) {
      openLoginModal({ from: location });
    }
  }, [authLoading, customerToken, customer, location, openLoginModal]);

  if (authLoading || (customerToken && !customer)) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-stone-200 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-stone-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!customerToken && !customer) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
