import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { getCollections } from "@/services/collectionService";
import { getImageUrl } from "@/api/axiosClient";

import categorySarees from "@/assets/category-sarees.jpg";
import categoryFabrics from "@/assets/category-fabrics.jpg";
import categoryKurtas from "@/assets/category-kurtas.jpg";

const fallbackImages = [categorySarees, categoryFabrics, categoryKurtas];

const BestOfSeason = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections();
        setCollections(data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    };

    fetchCollections();
  }, []);

  const items = collections.map((item, index) => ({
    id: item.id,
    img: item.image ? getImageUrl(item.image) : fallbackImages[index % fallbackImages.length],
    label: item.name,
    sub: item.label || item.type || "Season Collection",
    path: `/collections/${item.id}`,
  }));
  

  if (!items.length) return null;

  return (
    <section id="best-of-season" className="pt-6 pb-2 md:pt-8 md:pb-4 scroll-mt-20" ref={ref}>
      <div className="container">
        <h2
          className={`text-3xl md:text-4xl font-heading text-center mb-6 ${
            isVisible ? "animate-fade-up" : ""
          }`}
        >
          Best of the Season
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-5"> */}
          {items.map((item, i) => (
            <Link
              to={item.path}
              key={item.id}
              className={`group relative overflow-hidden rounded-lg cursor-pointer block ${
                isVisible ? `animate-fade-up stagger-${i + 1}` : ""
              }`}
            >
              <img
                src={item.img}
                alt={item.label}
                loading="lazy"
                width={640}
                height={640}
                className="w-full h-72 md:h-80 object-cover object-top transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-primary-foreground/70 text-xs uppercase tracking-widest">
                  {item.sub}
                </p>
                <h3 className="text-primary-foreground text-xl font-heading font-semibold">
                  {item.label}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestOfSeason;


// import { Link } from "react-router-dom";
// import { useScrollAnimation } from "@/hooks/useScrollAnimation";
// import categorySarees from "@/assets/category-sarees.jpg";
// import categoryFabrics from "@/assets/category-fabrics.jpg";
// import categoryKurtas from "@/assets/category-kurtas.jpg";

// const fallbackImages = [categorySarees, categoryFabrics, categoryKurtas];

// const items = [
//   {
//     id: 1,
//     img: fallbackImages[0],
//     label: "Sarees",
//     sub: "Women's Collection",
//     path: "/products/subcategory/sarees",
//   },
//   {
//     id: 2,
//     img: fallbackImages[1],
//     label: "Shirts",
//     sub: "Men's Collection",
//     path: "/products/subcategory/shirts",
//   },
//   {
//     id: 3,
//     img: fallbackImages[2],
//     label: "Bangles",
//     sub: "Jewellery & Accessories",
//     path: "/products/childcategory/bangles",
//   },
// ];

// const BestOfSeason = () => {
//   const { ref, isVisible } = useScrollAnimation();

//   return (
//     <section id="best-of-season" className="pt-6 pb-2 md:pt-8 md:pb-4 scroll-mt-20" ref={ref}>
//       <div className="container">
//         <h2
//           className={`text-3xl md:text-4xl font-heading text-center mb-6 ${
//             isVisible ? "animate-fade-up" : ""
//           }`}
//         >
//           Best of the Season
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           {items.map((item, i) => (
//             <Link
//               to={item.path}
//               key={item.id}
//               className={`group relative overflow-hidden rounded-lg cursor-pointer block ${
//                 isVisible ? `animate-fade-up stagger-${i + 1}` : ""
//               }`}
//             >
//               <img
//                 src={item.img}
//                 alt={item.label}
//                 loading="lazy"
//                 width={640}
//                 height={640}
//                 className="w-full h-72 md:h-80 object-cover object-top transition-transform duration-700 group-hover:scale-110"
//               />

//               <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />

//               <div className="absolute bottom-0 left-0 p-6">
//                 <p className="text-primary-foreground/70 text-xs uppercase tracking-widest">
//                   {item.sub}
//                 </p>
//                 <h3 className="text-primary-foreground text-xl font-heading font-semibold">
//                   {item.label}
//                 </h3>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BestOfSeason;
