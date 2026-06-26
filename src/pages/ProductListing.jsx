import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Search,
  Eye,
  Truck,
  Shield,
  Zap,
  ChevronRight,
} from "lucide-react";
import { useShop } from "../ShopContext.jsx";
import { useProtectedActions } from "@/hooks/useProtectedActions";
import { getProducts } from "@/services/productService";
import { getCategoryHierarchy } from "@/services/categoryService";
import { getImageUrl } from "@/api/axiosClient";
import { getCollectionById } from "@/services/collectionService";
import { extractProductSizes } from "@/utils/productHelpers";
import { useSearchParams } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

const ProductListing = () => {
  const navigate = useNavigate();
  const { categoryId, subCategoryId, childCategoryId, collectionId } = useParams();
  const [searchParams] = useSearchParams();
const searchText = searchParams.get("search") || "";
  // const { categoryId, subCategoryId, childCategoryId } = useParams();

  const [products, setProducts] = useState([]);
  const [pageTitle, setPageTitle] = useState("Products");
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});
  const [loading, setLoading] = useState(false);

  const { wishlist, cart } = useShop();
  const { handleAddToCart: addToCartProtected, handleToggleWishlist } = useProtectedActions();

  useEffect(() => {
    const loadListingData = async () => {
      try {
        setLoading(true);

        if (collectionId) {
          const collection = await getCollectionById(collectionId);

          setProducts(collection?.products || []);
          setPageTitle(collection?.name || "Collection");

          setBreadcrumb([
            {
              name: collection?.name || "Collection",
              path: `/collections/${collectionId}`,
            },
          ]);

          setLoading(false);
          return;
        }

        const params = {
          status: "active",
          limit: 100,
        };

        if (categoryId) params.category_id = categoryId;
        if (subCategoryId) params.sub_category_id = subCategoryId;
        if (childCategoryId) params.child_category_id = childCategoryId;
        if (searchText) params.search = searchText;

        const [productData, categoryData] = await Promise.all([
          getProducts(params),
          getCategoryHierarchy(),
        ]);

        setProducts(productData || []);

        let title = searchText ? `Search: ${searchText}` : "Products";
        let crumbs = searchText
          ? [{ name: `Search: ${searchText}`, path: `/shop?search=${encodeURIComponent(searchText)}` }]
          : [];

        if (categoryId) {
          const cat = (categoryData || []).find(
            (item) => String(item.id) === String(categoryId)
          );

          if (cat) {
            title = cat.name;
            crumbs = [{ name: cat.name, path: `/shop?category_id=${cat.id}` }];
          }
        }

        if (subCategoryId) {
          for (const cat of categoryData || []) {
            const sub = (cat.sub_categories || []).find(
              (item) => String(item.id) === String(subCategoryId)
            );

            if (sub) {
              title = sub.name;
              crumbs = [
                { name: cat.name, path: `/shop?category_id=${cat.id}` },
                { name: sub.name, path: `/products/subcategory/${sub.id}` },
              ];
              break;
            }
          }
        }

        if (childCategoryId) {
          for (const cat of categoryData || []) {
            for (const sub of cat.sub_categories || []) {
              const child = (sub.child_categories || []).find(
                (item) => String(item.id) === String(childCategoryId)
              );

              if (child) {
                title = child.name;
                crumbs = [
                  { name: cat.name, path: `/shop?category_id=${cat.id}` },
                  { name: sub.name, path: `/products/subcategory/${sub.id}` },
                  {
                    name: child.name,
                    path: `/products/childcategory/${child.id}`,
                  },
                ];
                break;
              }
            }
          }
        }

        setPageTitle(title);
        setBreadcrumb(crumbs);
      } catch (error) {
        console.error("Product listing fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadListingData();
    window.scrollTo(0, 0);
  }, [categoryId, subCategoryId, childCategoryId, collectionId, searchText]);

  const normalizeProduct = (product) => {
    const image = product.thumbnail || product.images?.[0]?.image || "";
    const price = Number(product.offer_price || product.price || 0);
    const oldPrice = Number(product.price || price || 0);

    return {
      ...product,
      image: image ? getImageUrl(image) : FALLBACK_IMAGE,
      price,
      oldPrice,
      stockLeft: Number(product.stock || 0),
      categoryText:
        product.child_category_name ||
        product.sub_category_name ||
        product.category_name ||
        "",
      badge: product.is_best_seller
        ? "Bestseller"
        : product.is_trending
        ? "Trending"
        : product.is_featured
        ? "Featured"
        : "",
    };
  };

  const displayProducts = products.map(normalizeProduct);

  const goToProduct = (product) => {
    if (product.slug) navigate(`/product/${product.slug}`);
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const sizes = extractProductSizes(product);

    const success = await addToCartProtected({
      product_id: product.id,
      variant_id: null,
      quantity: 1,
      selected_size: sizes[0] || "Free Size",
      selected_color: product.color || "",
      item_price: Number(product.offer_price || product.price || 0),
      item_data: {
        image: product.image,
        slug: product.slug,
        name: product.name,
        brand: product.brand || "",
        fabric: product.fabric || "",
        material: product.material || "",
        sizes,
        colors: product.colors || [],
      },
    });

    if (!success) return;

    setAddedToCart((prev) => ({ ...prev, [product.id]: true }));

    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const getDiscount = (price, oldPrice) =>
    oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 py-5"> */}
      <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 pt-6 pb-10">
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-8 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>

          {breadcrumb.map((item) => (
            <React.Fragment key={item.path}>
              <ChevronRight className="w-3 h-3" />
              <Link to={item.path} className="hover:text-primary transition-colors">
                {item.name}
              </Link>
            </React.Fragment>
          ))}
        </div>

        <div className="mb-8">
          {/* <span className="text-primary text-xs uppercase tracking-[0.25em] font-semibold">
            Products
          </span> */}
          <h1 className="font-heading text-2xl md:text-3xl text-primary mt-1">
            {pageTitle}
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {displayProducts.length} product
            {displayProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-stone-200">
            Loading products...
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-stone-200">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-xl font-heading text-stone-800 mb-2">
              No products found
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {displayProducts.map((product) => {
              const isWishlisted = wishlist.some((item) => item.id === product.id);
              const isInCart = cart.some((item) => item.id === product.id);
              const discount = getDiscount(product.price, product.oldPrice);
              const isLowStock = product.stockLeft <= 3 && product.stockLeft > 0;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100 relative cursor-pointer"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => goToProduct(product)}
                >
                  <div className="relative h-52 sm:h-60 md:h-64 lg:h-72 bg-stone-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        hoveredProduct === product.id ? "scale-105" : "scale-100"
                      }`}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />

                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.badge && (
                        <span className="bg-primary text-white text-[9px] uppercase tracking-wider px-2 py-1 rounded-full font-bold shadow">
                          {product.badge}
                        </span>
                      )}

                      {discount && (
                        <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    <div
                      className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${
                        hoveredProduct === product.id
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-5"
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWishlist(product);
                        }}
                        className="p-2 bg-white rounded-full shadow hover:bg-primary hover:text-white transition"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isWishlisted
                              ? "fill-red-500 text-red-500"
                              : "text-stone-700"
                          }`}
                        />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToProduct(product);
                        }}
                        className="p-2 bg-white rounded-full shadow hover:bg-primary hover:text-white transition"
                      >
                        <Eye className="w-4 h-4 text-stone-700" />
                      </button>
                    </div>

                    {isLowStock && (
                      <div className="absolute bottom-2 left-2 bg-stone-800 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-white" />
                        Only {product.stockLeft} left
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1 font-semibold">
                      {product.categoryText}
                    </p>

                    <h3 className="font-semibold text-stone-800 text-sm line-clamp-2 mb-2 hover:text-primary transition-colors leading-snug">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base font-bold text-stone-800">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>

                      {product.oldPrice > product.price && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{product.oldPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <div className="hidden sm:flex items-center gap-2 mb-3">
                      <span className="flex items-center gap-1 text-[10px] text-green-600">
                        <Truck className="w-3 h-3" /> Free Delivery
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-stone-500">
                        <Shield className="w-3 h-3" /> Secure
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`w-full py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                        addedToCart[product.id]
                          ? "bg-green-500 text-white"
                          : isInCart
                          ? "bg-green-600 text-white"
                          : "bg-stone-800 text-white hover:bg-primary"
                      }`}
                    >
                      {addedToCart[product.id]
                        ? "✓ Added"
                        : isInCart
                        ? "In Cart"
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .line-clamp-2{
              display:-webkit-box;
              -webkit-line-clamp:2;
              -webkit-box-orient:vertical;
              overflow:hidden;
            }
          `,
        }}
      />
    </div>
  );
};

export default ProductListing;


// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import {
//   Filter,
//   Heart,
//   X,
//   ChevronDown,
//   Star,
//   Search,
//   Eye,
//   Truck,
//   Shield,
//   Zap,
//   Plus,
//   Minus,
//   ChevronRight,
// } from "lucide-react";
// import { useShop } from "../ShopContext.jsx";
// import { getProducts } from "@/services/productService";
// import { getCategoryHierarchy } from "@/services/categoryService";
// import { getImageUrl } from "@/api/axiosClient";

// const FALLBACK_IMAGE =
//   "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

// const filterSections = {
//   "Price Range": {
//     options: ["Under ₹5,000", "₹5,000 - ₹10,000", "₹10,000 - ₹15,000", "Over ₹15,000"],
//   },
//   Fabric: {
//     options: [],
//   },
//   // Fabric: {
//   //   options: ["Silk", "Cotton", "Tissue", "Organza", "Linen", "Georgette", "Net", "Metal"],
//   // },
// };

// const sortOptions = ["Featured", "Newest", "Price: Low to High", "Price: High to Low", "Rating"];

// const ProductListing = () => {
//   const navigate = useNavigate();
//   const { categoryId, subCategoryId, childCategoryId } = useParams();

//   const [products, setProducts] = useState([]);
//   const [pageTitle, setPageTitle] = useState("Products");
//   const [sortBy, setSortBy] = useState("Featured");
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const [showMobileFilter, setShowMobileFilter] = useState(false);
//   const [hoveredProduct, setHoveredProduct] = useState(null);
//   const [addedToCart, setAddedToCart] = useState({});
//   const [expandedSections, setExpandedSections] = useState({});
//   const [selectedFilters, setSelectedFilters] = useState({});
//   const [loading, setLoading] = useState(false);

//   const { addToCart, toggleWishlist, wishlist, cart } = useShop();

//   useEffect(() => {
//     const loadListingData = async () => {
//       try {
//         setLoading(true);

//         const params = {
//           status: "active",
//           limit: 80,
//         };

//         if (categoryId) params.category_id = categoryId;
//         if (subCategoryId) params.sub_category_id = subCategoryId;
//         if (childCategoryId) params.child_category_id = childCategoryId;

//         const [productData, categoryData] = await Promise.all([
//           getProducts(params),
//           getCategoryHierarchy(),
//         ]);

//         setProducts(productData || []);

//         let title = "Products";

//         if (categoryId) {
//           const cat = (categoryData || []).find(
//             (item) => String(item.id) === String(categoryId)
//           );
//           if (cat) title = cat.name;
//         }

//         if (subCategoryId) {
//           for (const cat of categoryData || []) {
//             const sub = (cat.sub_categories || []).find(
//               (item) => String(item.id) === String(subCategoryId)
//             );
//             if (sub) {
//               title = sub.name;
//               break;
//             }
//           }
//         }

//         if (childCategoryId) {
//           for (const cat of categoryData || []) {
//             for (const sub of cat.sub_categories || []) {
//               const child = (sub.child_categories || []).find(
//                 (item) => String(item.id) === String(childCategoryId)
//               );
//               if (child) {
//                 title = child.name;
//                 break;
//               }
//             }
//           }
//         }

//         setPageTitle(title);
//       } catch (error) {
//         console.error("Product listing fetch error:", error);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadListingData();
//     window.scrollTo(0, 0);
//   }, [categoryId, subCategoryId, childCategoryId]);

//   const normalizeProduct = (product) => {
//     const image = product.thumbnail || product.images?.[0]?.image || "";
//     const price = Number(product.offer_price || product.price || 0);
//     const oldPrice = Number(product.price || price || 0);

//     return {
//       ...product,
//       image: image ? getImageUrl(image) : FALLBACK_IMAGE,
//       price,
//       oldPrice,
//       fabric: product.fabric || product.product_type || "",
//       rating: Number(product.avg_rating || 4.5),
//       reviews: Number(product.review_count || 0),
//       stockLeft: Number(product.stock || 0),
//       badge: product.is_best_seller
//         ? "Bestseller"
//         : product.is_trending
//         ? "Trending"
//         : product.is_featured
//         ? "Featured"
//         : "",
//     };
//   };

//   const apiProducts = products.map(normalizeProduct);
  
//   const dynamicFilterSections = {
//     ...filterSections,
//     Fabric: {
//       options: [...new Set(apiProducts.map((p) => p.fabric).filter(Boolean))],
//     },
//   };

//   const toggleSection = (section) =>
//     setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

//   const handleFilterCheck = (section, value) => {
//     setSelectedFilters((prev) => {
//       const current = prev[section] || [];
//       const updated = current.includes(value)
//         ? current.filter((item) => item !== value)
//         : [...current, value];

//       return { ...prev, [section]: updated };
//     });
//   };

//   const filteredProducts = apiProducts.filter((product) => {
//     const fabricMatch =
//       !selectedFilters.Fabric?.length || selectedFilters.Fabric.includes(product.fabric);

//     const priceFilters = selectedFilters["Price Range"] || [];
//     const priceMatch =
//       !priceFilters.length ||
//       priceFilters.some((range) => {
//         if (range === "Under ₹5,000") return product.price < 5000;
//         if (range === "₹5,000 - ₹10,000") return product.price >= 5000 && product.price <= 10000;
//         if (range === "₹10,000 - ₹15,000") return product.price >= 10000 && product.price <= 15000;
//         if (range === "Over ₹15,000") return product.price > 15000;
//         return true;
//       });

//     return fabricMatch && priceMatch;
//   });

//   const sortedProducts = [...filteredProducts].sort((a, b) => {
//     switch (sortBy) {
//       case "Price: Low to High":
//         return a.price - b.price;
//       case "Price: High to Low":
//         return b.price - a.price;
//       case "Newest":
//         return b.id - a.id;
//       case "Rating":
//         return b.rating - a.rating;
//       default:
//         return 0;
//     }
//   });

//   const goToProduct = (product) => {
//     if (product.slug) navigate(`/product/${product.slug}`);
//   };

//   const handleAddToCart = (e, product) => {
//     e.preventDefault();
//     e.stopPropagation();

//     addToCart({
//       id: product.id,
//       slug: product.slug,
//       name: product.name,
//       price: product.price,
//       oldPrice: product.oldPrice,
//       image: product.image,
//       qty: 1,
//       category: product.category_name || "",
//       stock: product.stockLeft,
//     });

//     setAddedToCart((prev) => ({ ...prev, [product.id]: true }));
//     setTimeout(() => {
//       setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
//     }, 1500);
//   };

//   const clearAllFilters = () => {
//     setSelectedFilters({});
//     setExpandedSections({});
//   };

//   const getDiscount = (price, oldPrice) =>
//     oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

//   const formatNumber = (num) =>
//     Number(num) >= 1000 ? `${(Number(num) / 1000).toFixed(1)}K` : String(num || 0);

//   return (
//     <div className="min-h-screen bg-stone-50">
//       <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-5">
//         <div className="flex items-center gap-2 text-xs text-stone-400 mb-4">
//           <Link to="/" className="hover:text-primary transition-colors">
//             Home
//           </Link>
//           <ChevronRight className="w-3 h-3" />
//           <span className="text-primary font-semibold">{pageTitle}</span>
//         </div>

//         <div className="mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
//           <div>
//             <span className="text-primary text-xs uppercase tracking-[0.25em] font-semibold">
//               Products
//             </span>
//             <h1 className="font-heading text-2xl md:text-3xl text-stone-800 mt-1">
//               {pageTitle}
//             </h1>
//             <p className="text-stone-500 text-sm mt-1">
//               {sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""} found
//             </p>
//           </div>

//           <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
//             <button
//               onClick={() => setShowMobileFilter(true)}
//               className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 rounded-full text-sm font-medium shadow-sm"
//             >
//               <Filter className="w-4 h-4" /> Filters
//             </button>

//             <div className="relative">
//               <button
//                 onClick={() => setShowSortDropdown(!showSortDropdown)}
//                 className="flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 rounded-full text-sm text-stone-600 hover:border-primary shadow-sm transition-all"
//               >
//                 <span className="text-stone-400">Sort:</span>
//                 <span className="font-semibold text-stone-800">{sortBy}</span>
//                 <ChevronDown
//                   className={`w-4 h-4 transition-transform duration-300 ${
//                     showSortDropdown ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {showSortDropdown && (
//                 <>
//                   <div className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)} />
//                   <div className="absolute right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-xl z-40 min-w-[200px] overflow-hidden">
//                     {sortOptions.map((opt) => (
//                       <button
//                         key={opt}
//                         onClick={() => {
//                           setSortBy(opt);
//                           setShowSortDropdown(false);
//                         }}
//                         className={`w-full text-left px-4 py-2.5 text-sm hover:bg-stone-50 transition-colors ${
//                           sortBy === opt
//                             ? "text-primary font-semibold bg-primary/5 border-l-2 border-primary"
//                             : "text-stone-700"
//                         }`}
//                       >
//                         {opt}
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-5 items-start">
//           <aside className="hidden lg:block w-[250px] flex-shrink-0">
//             <div className="bg-white rounded-xl shadow-sm border border-stone-200 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
//               <div className="p-4">
//                 <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
//                   <h3 className="font-heading text-base text-stone-800 flex items-center gap-2">
//                     <Filter className="w-4 h-4 text-primary" />
//                     Filters
//                   </h3>
//                   <button
//                     onClick={clearAllFilters}
//                     className="text-xs text-primary font-semibold hover:underline"
//                   >
//                     Clear
//                   </button>
//                 </div>

//                 <div className="space-y-1">
//                   {Object.entries(filterSections).map(([section, data]) => (
//                     <div key={section} className="border-b border-stone-100 last:border-0">
//                       <button
//                         onClick={() => toggleSection(section)}
//                         className="flex items-center justify-between w-full py-3 text-sm font-semibold text-stone-800 hover:text-primary transition-colors group"
//                       >
//                         <span>{section}</span>
//                         <span
//                           className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
//                             expandedSections[section]
//                               ? "bg-primary border-primary text-white"
//                               : "border-stone-300 text-stone-400"
//                           }`}
//                         >
//                           {expandedSections[section] ? (
//                             <Minus className="w-3 h-3" />
//                           ) : (
//                             <Plus className="w-3 h-3" />
//                           )}
//                         </span>
//                       </button>

//                       {expandedSections[section] && (
//                         <div className="pb-3 space-y-2.5">
//                           {data.options.map((option) => (
//                             <label key={option} className="flex items-center gap-3 cursor-pointer">
//                               <input
//                                 type="checkbox"
//                                 checked={(selectedFilters[section] || []).includes(option)}
//                                 onChange={() => handleFilterCheck(section, option)}
//                                 className="w-4 h-4"
//                               />
//                               <span className="text-sm text-stone-600">{option}</span>
//                             </label>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </aside>

//           <main className="flex-1 min-w-0">
//             {loading ? (
//               <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-stone-200">
//                 Loading products...
//               </div>
//             ) : sortedProducts.length === 0 ? (
//               <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-stone-200">
//                 <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Search className="w-8 h-8 text-stone-400" />
//                 </div>
//                 <h3 className="text-xl font-heading text-stone-800 mb-2">
//                   No products found
//                 </h3>
//                 <button
//                   onClick={clearAllFilters}
//                   className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
//                 {sortedProducts.map((product) => {
//                   const isWishlisted = wishlist.some((item) => item.id === product.id);
//                   const isInCart = cart.some((item) => item.id === product.id);
//                   const discount = getDiscount(product.price, product.oldPrice);
//                   const isLowStock = product.stockLeft <= 3 && product.stockLeft > 0;

//                   return (
//                     <div
//                       key={product.id}
//                       className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100 relative cursor-pointer"
//                       onMouseEnter={() => setHoveredProduct(product.id)}
//                       onMouseLeave={() => setHoveredProduct(null)}
//                       onClick={() => goToProduct(product)}
//                     >
//                       <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
//                         <img
//                           src={product.image}
//                           alt={product.name}
//                           className={`w-full h-full object-cover transition-transform duration-500 ${
//                             hoveredProduct === product.id ? "scale-105" : "scale-100"
//                           }`}
//                           onError={(e) => {
//                             e.currentTarget.src = FALLBACK_IMAGE;
//                           }}
//                         />

//                         <div className="absolute top-2 left-2 flex flex-col gap-1">
//                           {product.badge && (
//                             <span className="bg-primary text-white text-[9px] uppercase tracking-wider px-2 py-1 rounded-full font-bold shadow">
//                               {product.badge}
//                             </span>
//                           )}
//                           {discount && (
//                             <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow">
//                               {discount}% OFF
//                             </span>
//                           )}
//                         </div>

//                         <div
//                           className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${
//                             hoveredProduct === product.id
//                               ? "opacity-100 translate-x-0"
//                               : "opacity-0 translate-x-5"
//                           }`}
//                         >
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               toggleWishlist(product);
//                             }}
//                             className="p-2 bg-white rounded-full shadow hover:bg-primary hover:text-white transition"
//                           >
//                             <Heart
//                               className={`w-4 h-4 ${
//                                 isWishlisted ? "fill-red-500 text-red-500" : "text-stone-700"
//                               }`}
//                             />
//                           </button>

//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               goToProduct(product);
//                             }}
//                             className="p-2 bg-white rounded-full shadow hover:bg-primary hover:text-white transition"
//                           >
//                             <Eye className="w-4 h-4 text-stone-700" />
//                           </button>
//                         </div>

//                         {isLowStock && (
//                           <div className="absolute bottom-2 left-2 bg-stone-800 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow flex items-center gap-1">
//                             <Zap className="w-3 h-3 fill-white" />
//                             Only {product.stockLeft} left
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-3">
//                         <div className="flex items-center gap-1 mb-1">
//                           {[...Array(5)].map((_, i) => (
//                             <Star
//                               key={i}
//                               className={`w-3 h-3 ${
//                                 i < Math.floor(product.rating)
//                                   ? "fill-yellow-500 text-yellow-500"
//                                   : "text-stone-200"
//                               }`}
//                             />
//                           ))}
//                           <span className="text-[10px] text-stone-400">
//                             ({formatNumber(product.reviews)})
//                           </span>
//                         </div>

//                         <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1 font-semibold">
//                           {product.fabric}
//                         </p>

//                         <h3 className="font-semibold text-stone-800 text-sm line-clamp-2 mb-2 hover:text-primary transition-colors leading-snug">
//                           {product.name}
//                         </h3>

//                         <div className="flex items-center gap-2 mb-2">
//                           <span className="text-base font-bold text-stone-800">
//                             ₹{product.price.toLocaleString("en-IN")}
//                           </span>
//                           {product.oldPrice > product.price && (
//                             <span className="text-xs text-stone-400 line-through">
//                               ₹{product.oldPrice.toLocaleString("en-IN")}
//                             </span>
//                           )}
//                         </div>

//                         <div className="hidden sm:flex items-center gap-2 mb-3">
//                           <span className="flex items-center gap-1 text-[10px] text-green-600">
//                             <Truck className="w-3 h-3" /> Free Delivery
//                           </span>
//                           <span className="flex items-center gap-1 text-[10px] text-stone-500">
//                             <Shield className="w-3 h-3" /> Secure
//                           </span>
//                         </div>

//                         <button
//                           onClick={(e) => handleAddToCart(e, product)}
//                           className={`w-full py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
//                             addedToCart[product.id]
//                               ? "bg-green-500 text-white"
//                               : isInCart
//                               ? "bg-green-600 text-white"
//                               : "bg-stone-800 text-white hover:bg-primary"
//                           }`}
//                         >
//                           {addedToCart[product.id]
//                             ? "✓ Added"
//                             : isInCart
//                             ? "In Cart"
//                             : "Add to Cart"}
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </main>
//         </div>
//       </div>

//       {showMobileFilter && (
//         <>
//           <div
//             className="fixed inset-0 bg-black/60 z-40"
//             onClick={() => setShowMobileFilter(false)}
//           />
//           <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 overflow-y-auto flex flex-col shadow-2xl">
//             <div className="p-5 border-b border-stone-200 flex items-center justify-between">
//               <h2 className="text-lg font-heading font-bold">Filters</h2>
//               <button
//                 onClick={() => setShowMobileFilter(false)}
//                 className="p-2 bg-stone-100 rounded-full"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>

//             <div className="p-5 space-y-4 flex-1">
//               {Object.entries(filterSections).map(([section, data]) => (
//                 <div key={section} className="border-b border-stone-100 pb-4">
//                   <button
//                     onClick={() => toggleSection(section)}
//                     className="flex items-center justify-between w-full py-2 text-sm font-semibold text-stone-800"
//                   >
//                     {section}
//                     {expandedSections[section] ? (
//                       <Minus className="w-4 h-4 text-primary" />
//                     ) : (
//                       <Plus className="w-4 h-4" />
//                     )}
//                   </button>

//                   {expandedSections[section] && (
//                     <div className="space-y-2 pt-2">
//                       {data.options.map((option) => (
//                         <label key={option} className="flex items-center gap-3">
//                           <input
//                             type="checkbox"
//                             checked={(selectedFilters[section] || []).includes(option)}
//                             onChange={() => handleFilterCheck(section, option)}
//                             className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary/20"
//                           />
//                           <span className="text-sm">{option}</span>
//                         </label>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <div className="p-4 border-t border-stone-200 flex gap-3">
//               <button
//                 onClick={clearAllFilters}
//                 className="flex-1 border-2 border-stone-300 text-stone-800 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full"
//               >
//                 Clear All
//               </button>
//               <button
//                 onClick={() => setShowMobileFilter(false)}
//                 className="flex-1 bg-primary text-white py-3.5 text-xs font-bold uppercase tracking-widest rounded-full"
//               >
//                 Apply ({sortedProducts.length})
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//             .scrollbar-hide::-webkit-scrollbar{display:none}
//             .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
//             .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
//           `,
//         }}
//       />
//     </div>
//   );
// };

// export default ProductListing;


