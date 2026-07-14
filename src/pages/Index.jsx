import HeroSection from "@/components/HeroSection";
import BestOfSeason from "@/components/BestOfSeason";
import ProductGrid from "@/components/ProductGrid";
import ShopByCategory from "@/components/ShopByCategory";
import FeaturedBanner from "@/components/FeaturedBanner";
import CustomerReviews from "@/components/CustomerReviews";
import InstagramGallery from "@/components/InstagramGallery";
import AboutUs from "@/components/AboutUs";
import TrustStrip from "@/components/TrustStrip";
import InstagramFeed from "@/components/InstagramFeed";

const Index = () => (
  <div className="min-h-screen">
    {/* Navbar yahan se hata diya gaya hai */}
    <HeroSection />
    <TrustStrip />
    <BestOfSeason />
    <ProductGrid />
    <ShopByCategory />
    <InstagramFeed />
    <FeaturedBanner />
    <AboutUs/>
    {/* <CustomerReviews /> */}
    {/* <InstagramGallery /> */}
    {/* Footer yahan se hata diya gaya hai */}
  </div>
);

export default Index;