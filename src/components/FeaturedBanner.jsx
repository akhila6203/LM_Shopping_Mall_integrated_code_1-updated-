import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { getBanners } from "@/services/bannerService";
import { getImageUrl } from "@/api/axiosClient";

const FeaturedBanner = () => {
  const { ref, isVisible } = useScrollAnimation();
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await getBanners();

        const formatted = (data || []).map((banner) => ({
          id: banner.id,
          image: getImageUrl(banner.image),
          title: banner.title || "Featured Collection",
          subtitle: banner.description || "Latest collection from our store",
          path: banner.button_link || "/shop",
          buttonText: banner.button_text || "Shop Now",
          price: Number(banner.price || 0),
        }));

        if (formatted.length === 1) {
          setBanners([formatted[0], formatted[0]]);
        } else {
          setBanners(formatted.slice(0, 2));
        }
      } catch (error) {
        console.error("Featured banners fetch error:", error);
        setBanners([]);
      }
    };

    loadBanners();
  }, []);

  const handleBannerClick = (categoryPath) => {
    navigate(categoryPath);
  };

  const handleShopNowClick = (e, banner) => {
    e.stopPropagation();

    navigate("/cart", {
      state: {
        newItem: {
          id: banner.id,
          name: banner.title,
          price: banner.price,
          image: banner.image,
        },
      },
    });
  };

  if (!banners.length) return null;

  const leftBanner = banners[0];
  const rightBanner = banners[1] || banners[0];

  return (
    <section id="featured" className="pt-6 pb-16 md:pt-6 md:pb-24" ref={ref}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[500px]">
          <div
            onClick={() => handleBannerClick(leftBanner.path)}
            className={`relative overflow-hidden rounded-lg cursor-pointer group ${
              isVisible ? "animate-slide-left" : ""
            }`}
          >
            <img
              src={leftBanner.image}
              alt={leftBanner.title}
              loading="lazy"
              width={640}
              height={800}
              className="w-full h-80 md:h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <p className="text-primary text-xs uppercase tracking-widest mb-1">
                Exclusive
              </p>
              <h3 className="text-primary-foreground text-2xl md:text-3xl font-heading font-semibold italic">
                {leftBanner.title}
              </h3>
              <p className="text-primary-foreground/70 text-sm mt-1 mb-4">
                {leftBanner.subtitle}
              </p>

              <button
                onClick={(e) => handleShopNowClick(e, leftBanner)}
                className="bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground border border-primary-foreground/30 px-6 py-2 rounded-sm text-xs uppercase tracking-wider hover:bg-primary-foreground/30 transition-all z-10 relative"
              >
                {leftBanner.buttonText}
              </button>
            </div>
          </div>

          <div
            onClick={() => handleBannerClick(rightBanner.path)}
            className={`relative overflow-hidden rounded-lg cursor-pointer group ${
              isVisible ? "animate-slide-right" : ""
            }`}
          >
            <img
              src={rightBanner.image}
              alt={rightBanner.title}
              loading="lazy"
              width={640}
              height={512}
              className="w-full h-80 md:h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
            <div className="absolute bottom-8 right-8 text-right">
              <p className="text-primary text-xs uppercase tracking-widest mb-1">
                Exclusive
              </p>
              <h3 className="text-primary-foreground text-2xl md:text-3xl font-heading font-bold">
                {rightBanner.title}
              </h3>
              <p className="text-primary-foreground/70 text-sm mt-1 mb-4">
                {rightBanner.subtitle}
              </p>

              <button
                onClick={(e) => handleShopNowClick(e, rightBanner)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all z-10 relative"
              >
                {rightBanner.buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBanner;

// import { useNavigate } from "react-router-dom";
// import { useScrollAnimation } from "@/hooks/useScrollAnimation";
// import casualElegance from "@/assets/casual-elegance.jpg";
// import mixMatch from "@/assets/mix-match.jpg";

// const FeaturedBanner = () => {
//   const { ref, isVisible } = useScrollAnimation();
//   const navigate = useNavigate();

//   // Image Click: Goes to category
//   const handleBannerClick = (categoryPath) => {
//     navigate(categoryPath);
//   };

//   // 'Shop Now' Button Click: Product data ko seedha Cart mein bhejega
//   const handleShopNowClick = (e, productData) => {
//     e.stopPropagation(); // Image click rokega
//     // React Router ki madad se hum Data seedha /cart par bhej rahe hain
//     navigate("/cart", { state: { newItem: productData } });
//   };

//   return (
//     <section id="featured" className="pt-6 pb-16 md:pt-6 md:pb-24" ref={ref}>
//       <div className="container">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[500px]">
          
//           {/* LEFT BANNER */}
//           <div 
//             onClick={() => handleBannerClick("/kurtas")} 
//             className={`relative overflow-hidden rounded-lg cursor-pointer group ${isVisible ? "animate-slide-left" : "opacity-0"}`}
//           >
//             <img src={casualElegance} alt="Casual Elegance" loading="lazy" width={640} height={800} className="w-full h-80 md:h-full object-cover transition-transform duration-700 group-hover:scale-105" />
//             <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
//             <div className="absolute bottom-8 left-8">
//               <h3 className="text-primary-foreground text-2xl md:text-3xl font-heading font-semibold italic">Casual Elegance</h3>
//               <p className="text-primary-foreground/70 text-sm mt-1 mb-4">Everyday style, timeless grace</p>
              
//               {/* BUTTON PAR CLICK KARTE HI PRODUCT KI DETAILS CART MEIN JAYENGI */}
//               <button 
//                 onClick={(e) => handleShopNowClick(e, { id: 301, name: "Casual Elegance Kurta", price: 2999, image: casualElegance })}
//                 className="bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground border border-primary-foreground/30 px-6 py-2 rounded-sm text-xs uppercase tracking-wider hover:bg-primary-foreground/30 transition-all z-10 relative"
//               >
//                 Shop Now
//               </button>
//             </div>
//           </div>

//           {/* RIGHT BANNER */}
//           <div 
//             onClick={() => handleBannerClick("/dupattas")} 
//             className={`relative overflow-hidden rounded-lg cursor-pointer group ${isVisible ? "animate-slide-right" : "opacity-0"}`}
//           >
//             <img src={mixMatch} alt="Mix and Match" loading="lazy" width={640} height={512} className="w-full h-80 md:h-full object-cover transition-transform duration-700 group-hover:scale-105" />
//             <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
//             <div className="absolute bottom-8 right-8 text-right">
//               <p className="text-primary text-xs uppercase tracking-widest mb-1">Exclusive</p>
//               <h3 className="text-primary-foreground text-2xl md:text-3xl font-heading font-bold">Mix & Match</h3>
//               <p className="text-primary-foreground/70 text-sm mt-1 mb-4">Curated sets for every occasion</p>
              
//               {/* BUTTON PAR CLICK KARTE HI PRODUCT KI DETAILS CART MEIN JAYENGI */}
//               <button 
//                 onClick={(e) => handleShopNowClick(e, { id: 401, name: "Mix & Match Exclusive Set", price: 4500, image: mixMatch })}
//                 className="bg-primary text-primary-foreground px-6 py-2 rounded-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all z-10 relative"
//               >
//                 Shop Now
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedBanner;
