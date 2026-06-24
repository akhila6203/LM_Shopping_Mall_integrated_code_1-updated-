import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userAuth = localStorage.getItem("userAuth"); // Check if user is logged in
  const location = useLocation(); // Yaad rakho user kahan jana chahta tha

  if (!userAuth) {
    // Agar login nahi hai, to account (SignIn) pe bhejo aur location save karlo
    return <Navigate to="/account" state={{ from: location }} replace />;
  }

  // Agar login hai, to page dikha do
  return children;
};

export default ProtectedRoute;