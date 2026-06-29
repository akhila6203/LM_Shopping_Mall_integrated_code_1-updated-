import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"; 
import { ShopProvider } from "./ShopContext.jsx";

// --> HEADER, FOOTER AUR COMPONENTS IMPORT <--
import Navbar from "./components/Navbar.jsx"; 
import Footer from "./components/Footer.jsx"; 

// 🔥 YAHAN IMPORT PATH THEEK KIYA HAI (Kyunki file bahar hai)
import ProtectedRoute from "./ProtectedRoute.jsx"; 

// --> YAHAN AAPKA NAYA VIDEO POPUP IMPORT KIYA HAI <--
import VideoPopup from "./pages/VideoPopup.jsx"; 
import FloatingVideoWidget from "./FloatingVideoWidget.jsx"; 
import LoginModal from "./components/LoginModal.jsx";

// --> PAGES IMPORT <--
import Index from "./pages/Index.jsx";
import Shop from "./pages/Shop.jsx";
import Sarees from "./pages/Sarees.jsx";
import Fabrics from "./pages/Fabrics.jsx";
import Kurtas from "./pages/Kurtas.jsx";
import Dupattas from "./pages/Dupattas.jsx";
import Categories from "./pages/Categories.jsx"; 
import Featured from "./pages/Featured.jsx";     
import Reviews from "./pages/Reviews.jsx";       
import Gallery from "./pages/Gallery.jsx";       
import ProductDetail from "./pages/ProductDetail.jsx";
import ProductListing from "./pages/ProductListing.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import SignIn from "./pages/SignIn.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import Faq from "./pages/Faq.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/Profile.jsx";

import ShippingPolicy from "./pages/ShippingPolicy.jsx";
import RefundPolicy from "./pages/RefundPolicy.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsConditions from "./pages/TermsConditions.jsx";



const App = () => {
  return (
    <ShopProvider>
      <BrowserRouter>
        
        {/* 'relative' class add ki hai taaki popups aur floating buttons theek se kaam karein */}
        <div className="flex flex-col min-h-screen relative">
          
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* 🟢 PUBLIC PAGES (Bina login ke koi bhi dekh sakta hai) */}
              <Route path="/" element={<Index />} />
              {/* <Route path="/shop" element={<Shop />} /> */}
              <Route path="/products" element={<Shop />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/featured" element={<Featured />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/sarees" element={<Sarees />} />
              <Route path="/fabrics" element={<Fabrics />} />
              <Route path="/kurtas" element={<Kurtas />} />
              <Route path="/dupattas" element={<Dupattas />} />

              <Route path="/shop" element={<Shop />} />
              <Route path="/products/category/:categoryId" element={<ProductListing />} />
              <Route path="/products/subcategory/:subCategoryId" element={<ProductListing />} />
              <Route path="/products/childcategory/:childCategoryId" element={<ProductListing />} />
              <Route path="/product/:slug" element={<ProductDetail />} />

              <Route path="/collections/:collectionId" element={<ProductListing />} />

              {/* <Route path="/products/category/:categorySlug" element={<ProductListing />} />
              <Route path="/products/subcategory/:subCategorySlug" element={<ProductListing />} />
              <Route path="/products/childcategory/:childCategorySlug" element={<ProductListing />} />
              <Route path="/product/:slug" element={<ProductDetail />} /> */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/account" element={<SignIn />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/faq" element={<Faq />} />

              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              
              {/* 🔴 PROTECTED PAGES (Sirf login ke baad hi dikhenge) */}
              <Route 
                path="/wishlist" 
                element={<ProtectedRoute><Wishlist /></ProtectedRoute>} 
              />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route 
                path="/profile" 
                element={<ProtectedRoute><Profile /></ProtectedRoute>} 
              />
              <Route 
                path="/checkout" 
                element={<ProtectedRoute><Checkout /></ProtectedRoute>} 
              />
              <Route 
                path="/order-success" 
                element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} 
              />
              
              {/* 🔥 ORDER HISTORY - Redirects to Profile with tab parameter */}
              <Route 
                path="/orders" 
                element={<ProtectedRoute><Profile /></ProtectedRoute>} 
              />
              
              {/* ⚠️ 404 PAGE - MUST BE LAST */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />

          {/* 🌟 POPUPS AUR WIDGETS 🌟 */}
          <VideoPopup />
          <FloatingVideoWidget />
          <LoginModal />

        </div>
      </BrowserRouter>
    </ShopProvider>
  );
};
export default App;