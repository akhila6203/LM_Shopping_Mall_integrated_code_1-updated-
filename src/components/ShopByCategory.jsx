import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { getSubCategories } from "@/services/categoryService";
import { getImageUrl } from "@/api/axiosClient";

const fallbackImages = [
  "https://i.pinimg.com/736x/d0/eb/cc/d0ebcc838287f2c5bd84dea65a7b3eeb.jpg",
  "https://i.pinimg.com/736x/c0/ff/35/c0ff355a86cc81c4382a00c33e9379d4.jpg",
  "https://i.pinimg.com/736x/11/54/cc/1154ccb6382b1a231ef9d4ba549bcddb.jpg",
  "https://i.pinimg.com/1200x/04/ec/53/04ec53cb56607ca5ec2950951fd88446.jpg",
  "https://i.pinimg.com/1200x/3f/14/b4/3f14b4e94cfac4f5fd836efbc4e1afb3.jpg",
];

const ShopByCategory = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [categories, setCategories] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    const loadSubCategories = async () => {
      try {
        const data = await getSubCategories("all", { limit: 30 });

        const formatted = data.map((item, index) => ({
          id: item.id,
          name: item.name,
          path: `/products/subcategory/${item.id}`,
          image: item.image
            ? getImageUrl(item.image)
            : fallbackImages[index % fallbackImages.length],
        }));

        setCategories(formatted);
      } catch (error) {
        console.error("Sub categories fetch error:", error);
        setCategories([]);
      }
    };

    loadSubCategories();
  }, []);

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  if (!categories.length) return null;

  return (
    <section
      id="categories"
      className="w-full pt-4 pb-8 md:pt-6 md:pb-10"
      ref={ref}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative">
          <h2
            className={`text-2xl md:text-4xl font-heading text-center w-full mb-6 md:mb-10 text-foreground ${
              isVisible ? "animate-fade-up" : ""
            }`}
          >
            Shop by Categories
          </h2>

          {categories.length > 5 && (
            <>
              <button
                type="button"
                onClick={() => scrollSlider("left")}
                className="hidden md:flex absolute left-0 top-[58%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-stone-100 items-center justify-center hover:bg-primary hover:text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => scrollSlider("right")}
                className="hidden md:flex absolute right-0 top-[58%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-stone-100 items-center justify-center hover:bg-primary hover:text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div
            ref={sliderRef}
            className={`flex overflow-x-auto gap-5 md:gap-10 pb-6 snap-x snap-mandatory scroll-smooth scrollbar-hide px-1 md:px-12 ${
              categories.length <= 4 ? "justify-center" : "justify-start"
            }`}
            // className="flex overflow-x-auto gap-5 md:gap-10 pb-6 snap-x snap-mandatory justify-start scroll-smooth scrollbar-hide px-1 md:px-12"
          >
            {categories.map((cat, i) => (
              <Link
                to={cat.path}
                key={cat.id}
                className={`flex flex-col items-center gap-3 md:gap-4 cursor-pointer group min-w-[90px] md:min-w-[120px] snap-center shrink-0 ${
                  isVisible ? `animate-scale-in stagger-${i + 1}` : ""
                }`}
              >
                <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[3px] border-transparent group-hover:border-primary transition-all duration-300 shadow-md">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImages[i % fallbackImages.length];
                    }}
                  />
                </div>

                <span className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors font-heading tracking-wide text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </section>
  );
};

export default ShopByCategory;

// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useScrollAnimation } from "@/hooks/useScrollAnimation";
// import { getSubCategories } from "@/services/categoryService";
// import { getImageUrl } from "@/api/axiosClient";

// const fallbackImages = [
//   "https://i.pinimg.com/736x/d0/eb/cc/d0ebcc838287f2c5bd84dea65a7b3eeb.jpg",
//   "https://i.pinimg.com/736x/c0/ff/35/c0ff355a86cc81c4382a00c33e9379d4.jpg",
//   "https://i.pinimg.com/736x/11/54/cc/1154ccb6382b1a231ef9d4ba549bcddb.jpg",
//   "https://i.pinimg.com/1200x/04/ec/53/04ec53cb56607ca5ec2950951fd88446.jpg",
//   "https://i.pinimg.com/1200x/3f/14/b4/3f14b4e94cfac4f5fd836efbc4e1afb3.jpg",
// ];

// const ShopByCategory = () => {
//   const { ref, isVisible } = useScrollAnimation();
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const loadSubCategories = async () => {
//       try {
//         const data = await getSubCategories("all", { limit: 20 });

//         const formatted = data.map((item, index) => ({
//           id: item.id,
//           name: item.name,
//           path: `/products/subcategory/${item.id}`,
//           image: item.image
//             ? getImageUrl(item.image)
//             : fallbackImages[index % fallbackImages.length],
//         }));

//         setCategories(formatted);
//       } catch (error) {
//         console.error("Sub categories fetch error:", error);
//         setCategories([]);
//       }
//     };

//     loadSubCategories();
//   }, []);

//   if (!categories.length) return null;

//   return (
//     <section
//       id="categories"
//       className="w-full pt-4 pb-8 md:pt-6 md:pb-10"
//       ref={ref}
//     >
//       <div className="container mx-auto px-4 md:px-6">
//         <h2
//           className={`text-2xl md:text-4xl font-heading text-center w-full mb-6 md:mb-10 text-foreground ${
//             isVisible ? "animate-fade-up" : ""
//           }`}
//         >
//           Shop by Categories
//         </h2>

//         <div
//           className="flex overflow-x-auto gap-5 md:gap-10 pb-6 snap-x snap-mandatory justify-start md:justify-center"
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//         >
//           <style>{`
//             div::-webkit-scrollbar { display: none; }
//           `}</style>

//           {categories.map((cat, i) => (
//             <Link
//               to={cat.path}
//               key={cat.id}
//               className={`flex flex-col items-center gap-3 md:gap-4 cursor-pointer group min-w-[90px] md:min-w-[120px] snap-center shrink-0 ${
//                 isVisible ? `animate-scale-in stagger-${i + 1}` : ""
//               }`}
//             >
//               <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[3px] border-transparent group-hover:border-primary transition-all duration-300 shadow-md">
//                 <img
//                   src={cat.image}
//                   alt={cat.name}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                 />
//               </div>

//               <span className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors font-heading tracking-wide text-center">
//                 {cat.name}
//               </span>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ShopByCategory;




// import { Link } from "react-router-dom";
// import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// const categories = [
//   {
//     id: 1,
//     name: "Sarees",
//     path: "/products/subcategory/sarees",
//     image: "https://i.pinimg.com/736x/d0/eb/cc/d0ebcc838287f2c5bd84dea65a7b3eeb.jpg",
//   },
//   {
//     id: 2,
//     name: "Shirts",
//     path: "/products/subcategory/shirts",
//     image: "https://i.pinimg.com/736x/c0/ff/35/c0ff355a86cc81c4382a00c33e9379d4.jpg",
//   },
//   {
//     id: 3,
//     name: "Kurtas",
//     path: "/products/subcategory/kurtas",
//     image: "https://i.pinimg.com/736x/11/54/cc/1154ccb6382b1a231ef9d4ba549bcddb.jpg",
//   },
//   {
//     id: 4,
//     name: "Jewellery",
//     path: "/products/subcategory/jewellery",
//     image: "https://i.pinimg.com/1200x/04/ec/53/04ec53cb56607ca5ec2950951fd88446.jpg",
//   },
//   {
//     id: 5,
//     name: "Lehengas",
//     path: "/products/subcategory/lehengas",
//     image: "https://i.pinimg.com/1200x/3f/14/b4/3f14b4e94cfac4f5fd836efbc4e1afb3.jpg",
//   },
// ];

// const ShopByCategory = () => {
//   const { ref, isVisible } = useScrollAnimation();

//   return (
//     <section id="categories" className="w-full pt-4 pb-8 md:pt-6 md:pb-10" ref={ref}>
//       <div className="container mx-auto px-4 md:px-6">
//         <h2
//           className={`text-2xl md:text-4xl font-heading text-center w-full mb-6 md:mb-10 text-foreground ${
//             isVisible ? "animate-fade-up" : ""
//           }`}
//         >
//           Shop by Categories
//         </h2>

//         <div
//           className="flex overflow-x-auto gap-5 md:gap-10 pb-6 snap-x snap-mandatory justify-start md:justify-center"
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//         >
//           <style>{`div::-webkit-scrollbar { display: none; }`}</style>

//           {categories.map((cat, i) => (
//             <Link
//               to={cat.path}
//               key={cat.id}
//               className={`flex flex-col items-center gap-3 md:gap-4 cursor-pointer group min-w-[90px] md:min-w-[120px] snap-center shrink-0 ${
//                 isVisible ? `animate-scale-in stagger-${i + 1}` : ""
//               }`}
//             >
//               <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[3px] border-transparent group-hover:border-primary transition-all duration-300 shadow-md">
//                 <img
//                   src={cat.image}
//                   alt={cat.name}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                 />
//               </div>

//               <span className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors font-heading tracking-wide text-center">
//                 {cat.name}
//               </span>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ShopByCategory;
