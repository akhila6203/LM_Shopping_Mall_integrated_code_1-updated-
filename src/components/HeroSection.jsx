import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getBanners } from "@/services/bannerService";
import { getImageUrl } from "@/api/axiosClient";

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await getBanners();

        const formatted = data.map((banner) => ({
          id: banner.id,
          image: getImageUrl(banner.image),
          title: banner.title || "",
          subtitle: banner.subtitle || "",
          subtitle1: banner.subtitle1||"",
          description: banner.description || "Discover our handcrafted collection of premium sarees, fabrics &ethnic wear.",
          buttonText: banner.button_text || "Shop Now",
          buttonLink: banner.button_link || "/shop",
        }));

        setSlides(formatted);
      } catch (error) {
        console.error("Banner fetch error:", error);
      }
    };

    loadBanners();
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    startSlider();

    return () => clearInterval(intervalRef.current);
  }, [slides]);

  const startSlider = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    startSlider();
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    startSlider();
  };

  if (!slides.length) return null;

  const currentBanner = slides[currentSlide];

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-black/20 z-0" />

      <div className="absolute inset-0 flex items-center z-10">
        <div className="container pl-16 md:pl-20">
          <div className="max-w-lg animate-fade-up transition-all duration-500">

            {currentBanner.subtitle && (
              <p className="text-primary-foreground/80 text-sm tracking-[0.3em] uppercase mb-3 font-body">
                {currentBanner.title}
              </p>
            )}

            <h2 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground leading-tight mb-4">
              {currentBanner.subtitle}
              <br />
              <span className="text-gold">
                {currentBanner.subtitle1}
              </span>
            </h2>

            {currentBanner.description && (
              <p className="text-primary-foreground/70 text-sm md:text-base mb-6 font-body">
                {currentBanner.description}
              </p>
            )}

            {currentBanner.buttonText && (
              <Link
                to={currentBanner.buttonLink}
                className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-sm text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
              >
                {currentBanner.buttonText}
              </Link>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              startSlider();
            }}
            className={`w-2 h-2 rounded-full transition ${
              currentSlide === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;


// import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { ChevronLeft, ChevronRight } from "lucide-react"; 
// import heroBanner from "@/assets/hero-banner.jpg"; 

// const slides = [
//   {
//     image: heroBanner, 
//     tag: "New Collection 2026",
//     titleLine1: "Timeless",
//     titleLine2: "Elegance",
//     subtitle: "Discover our handcrafted collection of premium sarees, fabrics & ethnic wear.",
//     link: "/shop",
//     btnText: "Shop Now"
//   },
//   {
//     image: "https://i.pinimg.com/736x/f9/04/34/f90434c1a5c20058e8ef2e72123c40aa.jpg", 
//     tag: "Bridal Special",
//     titleLine1: "Wedding",
//     titleLine2: "Collection",
//     subtitle: "Make your special day unforgettable with our exclusive bridal range.",
//     link: "/shop",
//     btnText: "Explore Bridal"
//   },
//   {
//     image: "https://i.pinimg.com/736x/4c/11/a0/4c11a04596af47c006dc20b82b42d33e.jpg", 
//     tag: "Limited Time Offer",
//     titleLine1: "Flat 30%",
//     titleLine2: "OFF",
//     subtitle: "On all silk sarees this festive season. Don't miss out!",
//     link: "/shop",
//     btnText: "Grab Deal"
//   }
// ];

// const HeroSection = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     startSlider();
//     return () => clearInterval(intervalRef.current);
//   }, []);

//   const startSlider = () => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 5000); 
//   };

//   const goToPrev = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//     startSlider(); 
//   };

//   const goToNext = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//     startSlider(); 
//   };

//   return (
//     <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden group">
      
//       {slides.map((slide, index) => (
//         <div
//           key={index}
//           className={`absolute inset-0 transition-opacity duration-700 ${
//             currentSlide === index ? 'opacity-100' : 'opacity-0'
//           }`}
//         >
//           <img 
//             src={slide.image} 
//             alt="Elegant traditional collection" 
//             className="w-full h-full object-cover" 
//           />
//         </div>
//       ))}

//       <div className="absolute inset-0 bg-black/20 z-0" />

//       <div className="absolute inset-0 flex items-center z-10">
//         <div className="container pl-16 md:pl-20">
//           <div className="max-w-lg animate-fade-up transition-all duration-500">
//             <p className="text-primary-foreground/80 text-sm tracking-[0.3em] uppercase mb-3 font-body">
//               {slides[currentSlide].tag}
//             </p>
//             <h2 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground leading-tight mb-4">
//               {slides[currentSlide].titleLine1} <br />
//               <span className="text-gold">{slides[currentSlide].titleLine2}</span>
//             </h2>
//             <p className="text-primary-foreground/70 text-sm md:text-base mb-6 font-body">
//               {slides[currentSlide].subtitle}
//             </p>
//             <Link 
//               to={slides[currentSlide].link} 
//               className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-sm text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
//             >
//               {slides[currentSlide].btnText}
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* LEFT ARROW - Transparent */}
//       <button
//         onClick={goToPrev}
//         className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition"
//       >
//         <ChevronLeft className="w-6 h-6" />
//       </button>

//       {/* RIGHT ARROW - Transparent */}
//       <button
//         onClick={goToNext}
//         className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition"
//       >
//         <ChevronRight className="w-6 h-6" />
//       </button>

//       {/* DOTS - Small realistic */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => {
//               setCurrentSlide(index);
//               startSlider();
//             }}
//             className={`w-2 h-2 rounded-full transition ${
//               currentSlide === index ? "bg-white" : "bg-white/40"
//             }`}
//           />
//         ))}
//       </div>

//     </section>
//   );
// };

// export default HeroSection;