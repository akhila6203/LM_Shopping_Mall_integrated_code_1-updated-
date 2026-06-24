import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-stone-400" />
        </div>
        <h1 className="font-heading text-4xl text-stone-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-stone-700 mb-3">Page Not Found</h2>
        <p className="text-stone-500 mb-6">
          The page "{location.pathname}" doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition"
        >
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;