import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Heart,
  Eye,
  Search,
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
import { extractProductSizes } from "@/utils/productHelpers";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

const Shop = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get("category_id");
  const searchText = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});
  const [loading, setLoading] = useState(false);

  const { wishlist, cart } = useShop();
  const { handleAddToCart: addToCartProtected, handleToggleWishlist } = useProtectedActions();

  useEffect(() => {
    const loadShopData = async () => {
      try {
        setLoading(true);

        const params = {
          status: "active",
          limit: 100,
        };

        if (categoryId) params.category_id = categoryId;
        if (searchText) params.search = searchText;

        const [productData, categoryData] = await Promise.all([
          getProducts(params),
          getCategoryHierarchy(),
        ]);

        setProducts(productData || []);
        setCategories(categoryData || []);

        const matchedCategory = (categoryData || []).find(
          (cat) => String(cat.id) === String(categoryId)
        );

        setCurrentCategory(matchedCategory || null);
      } catch (error) {
        console.error("Shop fetch error:", error);
        setProducts([]);
        setCategories([]);
        setCurrentCategory(null);
      } finally {
        setLoading(false);
      }
    };

    loadShopData();
    window.scrollTo(0, 0);
  }, [categoryId, searchText]);

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
        currentCategory?.name ||
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

  const shopCategories = currentCategory
    ? (currentCategory.sub_categories || []).map((sub) => ({
        id: sub.id,
        name: sub.name,
        mainName: currentCategory.name,
        path: `/products/subcategory/${sub.id}`,
        image: sub.image ? getImageUrl(sub.image) : "",
      }))
    : categories.flatMap((main) =>
        (main.sub_categories || []).map((sub) => ({
          id: sub.id,
          name: sub.name,
          mainName: main.name,
          path: `/products/subcategory/${sub.id}`,
          image: sub.image ? getImageUrl(sub.image) : "",
        }))
      );

  const pageTitle = searchText
    ? `Search: ${searchText}`
    : currentCategory?.name || "Shop All";

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
      <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 pt-8 pb-8">
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-8 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-semibold">{pageTitle}</span>
        </div>

        <div className="mb-10">
          <div className="mb-6">
            <span className="text-primary text-xs uppercase tracking-[0.25em] font-semibold">
              Discover
            </span>
            <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mt-1">
              Shop by Categories
            </h2>
          </div>

          <div className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-5">
            {shopCategories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.path}
                className="group relative flex-shrink-0 w-[135px] md:w-[155px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="aspect-[3/4] overflow-hidden bg-stone-100">
                  <img
                    src={cat.image || FALLBACK_IMAGE}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white/70 text-[10px] uppercase tracking-wider">
                    {cat.mainName}
                  </p>
                  <h3 className="text-white font-heading text-base font-bold">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-5 border-t border-stone-200 pt-6">
          <h1 className="font-heading text-2xl md:text-3xl text-primary">
            All {pageTitle} Products
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
            .scrollbar-hide::-webkit-scrollbar{display:none}
            .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
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

export default Shop;


// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import {
//   Filter,
//   Heart,
//   ShoppingCart,
//   ChevronDown,
//   Star,
//   Eye,
//   Search,
//   Truck,
//   Shield,
//   Zap,
//   X,
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
//   "Price Range": ["Under ₹2,000", "₹2,000 - ₹5,000", "₹5,000 - ₹10,000", "Over ₹10,000"],
//   Fabric: ["Silk", "Cotton", "Linen", "Georgette", "Banarasi", "Chanderi"],
// };

// const sortOptions = [
//   { value: "featured", label: "Featured" },
//   { value: "lowToHigh", label: "Price: Low to High" },
//   { value: "highToLow", label: "Price: High to Low" },
//   { value: "newest", label: "Newest" },
// ];

// const Shop = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const categoryId = searchParams.get("category_id");
//   const searchText = searchParams.get("search");

//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [sortBy, setSortBy] = useState("featured");
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const [showMobileFilter, setShowMobileFilter] = useState(false);
//   const [hoveredProduct, setHoveredProduct] = useState(null);
//   const [addedToCart, setAddedToCart] = useState({});
//   const [expandedSections, setExpandedSections] = useState({});
//   const [selectedFilters, setSelectedFilters] = useState({});
//   const [loading, setLoading] = useState(false);

//   const { addToCart, toggleWishlist, wishlist, cart } = useShop();

//   useEffect(() => {
//     const loadShopData = async () => {
//       try {
//         setLoading(true);

//         const params = {
//           status: "active",
//           limit: 80,
//         };

//         if (categoryId) params.category_id = categoryId;
//         if (searchText) params.search = searchText;

//         const [productData, categoryData] = await Promise.all([
//           getProducts(params),
//           getCategoryHierarchy(),
//         ]);

//         setProducts(productData || []);
//         setCategories(categoryData || []);

//         const matchedCategory = (categoryData || []).find(
//           (cat) => String(cat.id) === String(categoryId)
//         );

//         setCurrentCategory(matchedCategory || null);
//       } catch (error) {
//         console.error("Shop fetch error:", error);
//         setProducts([]);
//         setCategories([]);
//         setCurrentCategory(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadShopData();
//     window.scrollTo(0, 0);
//   }, [categoryId, searchText]);

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
//       category: product.category_name || currentCategory?.name || "",
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

//   const shopCategories = currentCategory
//     ? (currentCategory.sub_categories || []).map((sub) => ({
//         id: sub.id,
//         name: sub.name,
//         mainName: currentCategory.name,
//         path: `/products/subcategory/${sub.id}`,
//         image: sub.image ? getImageUrl(sub.image) : "",
//       }))
//     : categories.flatMap((main) =>
//         (main.sub_categories || []).map((sub) => ({
//           id: sub.id,
//           name: sub.name,
//           mainName: main.name,
//           path: `/products/subcategory/${sub.id}`,
//           image: sub.image ? getImageUrl(sub.image) : "",
//         }))
//       );

//   const pageTitle = searchText
//     ? `Search: ${searchText}`
//     : currentCategory?.name || "Shop All";

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

//     const priceMatch =
//       !selectedFilters["Price Range"]?.length ||
//       selectedFilters["Price Range"].some((range) => {
//         if (range === "Under ₹2,000") return product.price < 2000;
//         if (range === "₹2,000 - ₹5,000") return product.price >= 2000 && product.price <= 5000;
//         if (range === "₹5,000 - ₹10,000") return product.price >= 5000 && product.price <= 10000;
//         if (range === "Over ₹10,000") return product.price > 10000;
//         return true;
//       });

//     return fabricMatch && priceMatch;
//   });

//   const sortedProducts = [...filteredProducts].sort((a, b) => {
//     if (sortBy === "lowToHigh") return a.price - b.price;
//     if (sortBy === "highToLow") return b.price - a.price;
//     if (sortBy === "newest") return b.id - a.id;
//     return 0;
//   });

//   const goToProduct = (product) => {
//     navigate(`/product/${product.slug}`);
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
//       category: product.category,
//       stock: product.stockLeft,
//     });

//     setAddedToCart((prev) => ({ ...prev, [product.id]: true }));
//     setTimeout(() => {
//       setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
//     }, 1500);
//   };

//   const getDiscount = (price, oldPrice) =>
//     oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

//   const formatNumber = (num) =>
//     Number(num) >= 1000 ? `${(Number(num) / 1000).toFixed(1)}K` : String(num || 0);

//   const clearAllFilters = () => {
//     setSelectedFilters({});
//     setExpandedSections({});
//   };

//   const ProductCard = ({ product }) => {
//     const isWishlisted = wishlist.some((item) => item.id === product.id);
//     const isInCart = cart.some((item) => item.id === product.id);
//     const discount = getDiscount(product.price, product.oldPrice);
//     const isLowStock = product.stockLeft <= 3 && product.stockLeft > 0;

//     return (
//       <div
//         className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-stone-100 relative cursor-pointer"
//         onMouseEnter={() => setHoveredProduct(product.id)}
//         onMouseLeave={() => setHoveredProduct(null)}
//         onClick={() => goToProduct(product)}
//       >
//         <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
//           <img
//             src={product.image}
//             alt={product.name}
//             className={`w-full h-full object-cover transition-transform duration-700 ${
//               hoveredProduct === product.id ? "scale-110" : "scale-100"
//             }`}
//             loading="lazy"
//             onError={(e) => {
//               e.currentTarget.src = FALLBACK_IMAGE;
//             }}
//           />

//           <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
//             {product.badge && (
//               <span className="bg-primary text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold shadow-xl">
//                 {product.badge}
//               </span>
//             )}
//             {discount && (
//               <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xl">
//                 {discount}% OFF
//               </span>
//             )}
//           </div>

//           <div
//             className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
//               hoveredProduct === product.id ? "opacity-100" : "opacity-0"
//             }`}
//           >
//             <div className="absolute top-3 right-3 flex flex-col gap-2">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleWishlist(product);
//                 }}
//                 className="p-2.5 bg-white rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all hover:scale-110"
//               >
//                 <Heart
//                   className={`w-4 h-4 ${
//                     isWishlisted ? "fill-red-500 text-red-500" : "text-stone-700"
//                   }`}
//                 />
//               </button>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   goToProduct(product);
//                 }}
//                 className="p-2.5 bg-white rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all hover:scale-110"
//               >
//                 <Eye className="w-4 h-4 text-stone-700" />
//               </button>
//             </div>

//             <div className="absolute bottom-4 left-4 right-4">
//               <button
//                 onClick={(e) => handleAddToCart(e, product)}
//                 className="w-full py-3 bg-white text-stone-800 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all shadow-xl"
//               >
//                 {addedToCart[product.id] ? "✓ Added!" : "Quick Add"}
//               </button>
//             </div>
//           </div>

//           {isLowStock && (
//             <div className="absolute bottom-3 left-3 bg-stone-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 z-10">
//               <Zap className="w-3 h-3 fill-white" />
//               Only {product.stockLeft} left!
//             </div>
//           )}
//         </div>

//         <div className="p-4">
//           <div className="flex items-center gap-1 mb-2">
//             <div className="flex">
//               {[...Array(5)].map((_, index) => (
//                 <Star
//                   key={index}
//                   className={`w-3.5 h-3.5 ${
//                     index < Math.floor(product.rating)
//                       ? "fill-yellow-500 text-yellow-500"
//                       : "text-stone-200 fill-stone-200"
//                   }`}
//                 />
//               ))}
//             </div>
//             <span className="text-xs text-stone-400 font-medium">
//               ({formatNumber(product.reviews)})
//             </span>
//           </div>

//           <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1 font-semibold">
//             {product.category} {product.fabric ? `· ${product.fabric}` : ""}
//           </p>

//           <h3 className="font-semibold text-stone-800 text-sm line-clamp-2 mb-2 hover:text-primary transition-colors leading-snug">
//             {product.name}
//           </h3>

//           <div className="flex items-center gap-2 mb-1">
//             <span className="text-lg font-bold text-stone-800">
//               ₹{product.price.toLocaleString("en-IN")}
//             </span>
//             {product.oldPrice > product.price && (
//               <span className="text-xs text-stone-400 line-through font-medium">
//                 ₹{product.oldPrice.toLocaleString("en-IN")}
//               </span>
//             )}
//           </div>

//           <div className="flex items-center gap-3 mb-4">
//             <span className="flex items-center gap-1 text-[10px] text-stone-500 font-medium">
//               <Truck className="w-3 h-3" /> Free Delivery
//             </span>
//             <span className="flex items-center gap-1 text-[10px] text-stone-500 font-medium">
//               <Shield className="w-3 h-3" /> Secure
//             </span>
//           </div>

//           <button
//             onClick={(e) => handleAddToCart(e, product)}
//             className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
//               addedToCart[product.id]
//                 ? "bg-green-500 text-white"
//                 : isInCart
//                 ? "bg-stone-700 text-white"
//                 : "bg-stone-800 text-white hover:bg-primary"
//             }`}
//           >
//             {addedToCart[product.id] ? "✓ Added!" : isInCart ? "In Cart" : "Add to Cart"}
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-stone-50">
//       <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
//         <div className="flex items-center gap-2 text-xs text-stone-400 mb-4">
//           <Link to="/" className="hover:text-primary transition-colors">
//             Home
//           </Link>
//           <ChevronRight className="w-3 h-3" />
//           <span className="text-primary font-semibold">{pageTitle}</span>
//         </div>

//         <div className="mb-8">
//           <div className="mb-5">
//             <span className="text-primary text-xs uppercase tracking-[0.3em] font-semibold">
//               Discover
//             </span>
//             <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mt-1">
//               Shop by Categories
//             </h2>
//           </div>

//           <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-4">
//             {shopCategories.map((cat) => (
//               <Link
//                 key={cat.id}
//                 to={cat.path}
//                 className="group relative flex-shrink-0 w-[130px] md:w-[150px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
//               >
//                 <div className="aspect-[3/4] overflow-hidden">
//                   <img
//                     src={cat.image || FALLBACK_IMAGE}
//                     alt={cat.name}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                     onError={(e) => {
//                       e.currentTarget.src = FALLBACK_IMAGE;
//                     }}
//                   />
//                 </div>
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
//                 <div className="absolute bottom-0 left-0 right-0 p-4">
//                   <p className="text-white/70 text-[10px] uppercase tracking-wider">
//                     {cat.mainName}
//                   </p>
//                   <h3 className="text-white font-heading text-base font-bold">
//                     {cat.name}
//                   </h3>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-4 mb-6">
//           <div className="flex items-center justify-between gap-4 flex-wrap">
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="text-sm font-semibold text-stone-700">Filters:</span>
//               {Object.values(selectedFilters).flat().length === 0 && (
//                 <span className="text-xs text-stone-400">None applied</span>
//               )}

//               {Object.entries(selectedFilters).map(([section, values]) =>
//                 values.map((value) => (
//                   <span
//                     key={value}
//                     className="text-xs bg-stone-800 text-white px-2.5 py-1 rounded-full flex items-center gap-1"
//                   >
//                     {value}
//                     <button onClick={() => handleFilterCheck(section, value)}>
//                       <X className="w-3 h-3" />
//                     </button>
//                   </span>
//                 ))
//               )}
//             </div>

//             <div className="relative">
//               <button
//                 onClick={() => setShowSortDropdown(!showSortDropdown)}
//                 className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-sm text-stone-600 hover:border-primary transition-all"
//               >
//                 <span className="text-stone-400">Sort:</span>
//                 <span className="font-semibold text-stone-800">
//                   {sortOptions.find((item) => item.value === sortBy)?.label}
//                 </span>
//                 <ChevronDown
//                   className={`w-4 h-4 transition-transform ${
//                     showSortDropdown ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {showSortDropdown && (
//                 <>
//                   <div
//                     className="fixed inset-0 z-30"
//                     onClick={() => setShowSortDropdown(false)}
//                   />
//                   <div className="absolute right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-xl z-40 min-w-[200px] overflow-hidden">
//                     {sortOptions.map((option) => (
//                       <button
//                         key={option.value}
//                         onClick={() => {
//                           setSortBy(option.value);
//                           setShowSortDropdown(false);
//                         }}
//                         className={`w-full text-left px-4 py-2.5 text-sm hover:bg-stone-50 ${
//                           sortBy === option.value
//                             ? "text-primary font-semibold bg-primary/5"
//                             : "text-stone-700"
//                         }`}
//                       >
//                         {option.label}
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-6 items-start">
//           <aside className="hidden lg:block w-[280px] flex-shrink-0">
//             <div className="bg-white rounded-2xl shadow-lg border border-stone-200 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
//               <div className="p-5">
//                 <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
//                   <h3 className="font-heading text-lg text-stone-800 flex items-center gap-2">
//                     <Filter className="w-4 h-4 text-primary" />
//                     Filters
//                   </h3>
//                   <button
//                     onClick={clearAllFilters}
//                     className="text-xs text-primary font-semibold hover:underline"
//                   >
//                     Clear All
//                   </button>
//                 </div>

//                 <div className="space-y-1">
//                   {Object.entries(filterSections).map(([section, options]) => (
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
//                               : "border-stone-300 text-stone-400 group-hover:border-primary group-hover:text-primary"
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
//                         <div className="pb-3 space-y-2.5 animate-slideDown">
//                           {options.map((option) => (
//                             <label key={option} className="flex items-center gap-3 cursor-pointer group">
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
//             <div className="mb-4">
//               <h1 className="font-heading text-2xl md:text-3xl text-stone-800">
//                 {pageTitle}
//               </h1>
//               <p className="text-sm text-stone-500 mt-1">
//                 {sortedProducts.length} products found
//               </p>
//             </div>

//             {loading ? (
//               <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-stone-200">
//                 Loading products...
//               </div>
//             ) : sortedProducts.length === 0 ? (
//               <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-stone-200">
//                 <Search className="w-10 h-10 text-stone-300 mx-auto mb-4" />
//                 <h3 className="text-xl font-heading text-stone-800 mb-2">
//                   No products found
//                 </h3>
//                 <button
//                   onClick={clearAllFilters}
//                   className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold"
//                 >
//                   Clear All Filters
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
//                 {sortedProducts.map((product) => (
//                   <ProductCard key={product.id} product={product} />
//                 ))}
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
//         </>
//       )}

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//             .scrollbar-hide::-webkit-scrollbar{display:none}
//             .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
//             @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
//             .animate-slideDown{animation:slideDown .3s ease-out forwards}
//             .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
//           `,
//         }}
//       />
//     </div>
//   );
// };

// export default Shop;

