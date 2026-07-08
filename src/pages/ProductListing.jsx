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
// import { getProducts } from "@/services/productService";
import { getProducts, getProductBySlug } from "@/services/productService";
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

  const getVariantPrice = (variant) =>
  Number(variant?.offer_price || variant?.price || 0);

const handleAddToCart = async (e, product) => {
  e.preventDefault();
  e.stopPropagation();

  let fullProduct = product;

  if (product.slug) {
    try {
      fullProduct = await getProductBySlug(product.slug);
    } catch (error) {
      console.error("Full product fetch failed:", error);
    }
  }

  const variants = fullProduct.variants || fullProduct.product_variants || [];

  const lowestVariant = variants.length
    ? [...variants].sort((a, b) => getVariantPrice(a) - getVariantPrice(b))[0]
    : null;

  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];

  const selectedSize = lowestVariant?.size || sizes[0] || "";
  const selectedColor = lowestVariant?.color || "";

  const success = await addToCartProtected({
    product_id: fullProduct.id || product.id,
    variant_id: lowestVariant?.id || null,
    quantity: 1,
    selected_size: selectedSize,
    selected_color: selectedColor,
    item_price: Number(
      lowestVariant?.offer_price ||
      lowestVariant?.price ||
      fullProduct.offer_price ||
      fullProduct.price ||
      0
    ),
    item_data: {
      image: product.image,
      slug: fullProduct.slug || product.slug,
      name: fullProduct.name || product.name,
      brand: fullProduct.brand || "",
      fabric: lowestVariant?.fabric || fullProduct.fabric || "",
      material: fullProduct.material || "",
      sizes: sizes.length ? sizes : [selectedSize],
      colors,
      variants: variants.map((v) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        price: Number(v.price || 0),
        offer_price: Number(v.offer_price || v.price || 0),
      })),
    },
  });

  if (!success) return;

  setAddedToCart((prev) => ({ ...prev, [product.id]: true }));

  setTimeout(() => {
    setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
  }, 1500);
};
//   const handleAddToCart = async (e, product) => {
//   e.preventDefault();
//   e.stopPropagation();

//   let fullProduct = product;

//   if (product.slug) {
//     try {
//       fullProduct = await getProductBySlug(product.slug);
//     } catch (error) {
//       console.error("Full product fetch failed:", error);
//     }
//   }

//   const variants = fullProduct.variants || fullProduct.product_variants || [];

//   const sizes = [
//     ...new Set(
//       variants
//         .map((v) => v.size)
//         .filter(Boolean)
//     ),
//   ];

//   const firstVariant = variants[0] || null;
//   const firstSize = sizes[0] || firstVariant?.size || "Free Size";

//   const success = await addToCartProtected({
//     product_id: fullProduct.id || product.id,
//     variant_id: firstVariant?.id || null,
//     quantity: 1,
//     selected_size: firstSize,
//     selected_color: firstVariant?.color || fullProduct.color || "",
//     item_price: Number(
//       firstVariant?.offer_price ||
//       firstVariant?.price ||
//       fullProduct.offer_price ||
//       fullProduct.price ||
//       product.offer_price ||
//       product.price ||
//       0
//     ),
//     item_data: {
//       image: product.image,
//       slug: fullProduct.slug || product.slug,
//       name: fullProduct.name || product.name,
//       brand: fullProduct.brand || "",
//       fabric: fullProduct.fabric || "",
//       material: fullProduct.material || "",
//       sizes: sizes.length ? sizes : [firstSize],
//       colors: [
//         ...new Set(
//           variants
//             .map((v) => v.color)
//             .filter(Boolean)
//         ),
//       ],
//     },
//   });

//   if (!success) return;

//   setAddedToCart((prev) => ({ ...prev, [product.id]: true }));

//   setTimeout(() => {
//     setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
//   }, 1500);
// };
  

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
                      {/* <span className="flex items-center gap-1 text-[10px] text-green-600">
                        <Truck className="w-3 h-3" /> Free Delivery
                      </span> */}
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
//   Heart,
//   Search,
//   Eye,
//   Truck,
//   Shield,
//   Zap,
//   ChevronRight,
// } from "lucide-react";
// import { useShop } from "../ShopContext.jsx";
// import { useProtectedActions } from "@/hooks/useProtectedActions";
// import { getProducts } from "@/services/productService";
// import { getCategoryHierarchy } from "@/services/categoryService";
// import { getImageUrl } from "@/api/axiosClient";
// import { getCollectionById } from "@/services/collectionService";
// import { extractProductSizes } from "@/utils/productHelpers";
// import { useSearchParams } from "react-router-dom";

// const FALLBACK_IMAGE =
//   "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

// const ProductListing = () => {
//   const navigate = useNavigate();
//   const { categoryId, subCategoryId, childCategoryId, collectionId } = useParams();
//   const [searchParams] = useSearchParams();
// const searchText = searchParams.get("search") || "";
//   // const { categoryId, subCategoryId, childCategoryId } = useParams();

//   const [products, setProducts] = useState([]);
//   const [pageTitle, setPageTitle] = useState("Products");
//   const [breadcrumb, setBreadcrumb] = useState([]);
//   const [hoveredProduct, setHoveredProduct] = useState(null);
//   const [addedToCart, setAddedToCart] = useState({});
//   const [loading, setLoading] = useState(false);

//   const { wishlist, cart } = useShop();
//   const { handleAddToCart: addToCartProtected, handleToggleWishlist } = useProtectedActions();

//   useEffect(() => {
//     const loadListingData = async () => {
//       try {
//         setLoading(true);

//         if (collectionId) {
//           const collection = await getCollectionById(collectionId);

//           setProducts(collection?.products || []);
//           setPageTitle(collection?.name || "Collection");

//           setBreadcrumb([
//             {
//               name: collection?.name || "Collection",
//               path: `/collections/${collectionId}`,
//             },
//           ]);

//           setLoading(false);
//           return;
//         }

//         const params = {
//           status: "active",
//           limit: 100,
//         };

//         if (categoryId) params.category_id = categoryId;
//         if (subCategoryId) params.sub_category_id = subCategoryId;
//         if (childCategoryId) params.child_category_id = childCategoryId;
//         if (searchText) params.search = searchText;

//         const [productData, categoryData] = await Promise.all([
//           getProducts(params),
//           getCategoryHierarchy(),
//         ]);

//         setProducts(productData || []);

//         let title = searchText ? `Search: ${searchText}` : "Products";
//         let crumbs = searchText
//           ? [{ name: `Search: ${searchText}`, path: `/shop?search=${encodeURIComponent(searchText)}` }]
//           : [];

//         if (categoryId) {
//           const cat = (categoryData || []).find(
//             (item) => String(item.id) === String(categoryId)
//           );

//           if (cat) {
//             title = cat.name;
//             crumbs = [{ name: cat.name, path: `/shop?category_id=${cat.id}` }];
//           }
//         }

//         if (subCategoryId) {
//           for (const cat of categoryData || []) {
//             const sub = (cat.sub_categories || []).find(
//               (item) => String(item.id) === String(subCategoryId)
//             );

//             if (sub) {
//               title = sub.name;
//               crumbs = [
//                 { name: cat.name, path: `/shop?category_id=${cat.id}` },
//                 { name: sub.name, path: `/products/subcategory/${sub.id}` },
//               ];
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
//                 crumbs = [
//                   { name: cat.name, path: `/shop?category_id=${cat.id}` },
//                   { name: sub.name, path: `/products/subcategory/${sub.id}` },
//                   {
//                     name: child.name,
//                     path: `/products/childcategory/${child.id}`,
//                   },
//                 ];
//                 break;
//               }
//             }
//           }
//         }

//         setPageTitle(title);
//         setBreadcrumb(crumbs);
//       } catch (error) {
//         console.error("Product listing fetch error:", error);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadListingData();
//     window.scrollTo(0, 0);
//   }, [categoryId, subCategoryId, childCategoryId, collectionId, searchText]);

//   const normalizeProduct = (product) => {
//     const image = product.thumbnail || product.images?.[0]?.image || "";
//     const price = Number(product.offer_price || product.price || 0);
//     const oldPrice = Number(product.price || price || 0);

//     return {
//       ...product,
//       image: image ? getImageUrl(image) : FALLBACK_IMAGE,
//       price,
//       oldPrice,
//       stockLeft: Number(product.stock || 0),
//       categoryText:
//         product.child_category_name ||
//         product.sub_category_name ||
//         product.category_name ||
//         "",
//       badge: product.is_best_seller
//         ? "Bestseller"
//         : product.is_trending
//         ? "Trending"
//         : product.is_featured
//         ? "Featured"
//         : "",
//     };
//   };

//   const displayProducts = products.map(normalizeProduct);

//   const goToProduct = (product) => {
//     if (product.slug) navigate(`/product/${product.slug}`);
//   };

//   const handleAddToCart = async (e, product) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const sizes = extractProductSizes(product);

//     const success = await addToCartProtected({
//       product_id: product.id,
//       variant_id: null,
//       quantity: 1,
//       selected_size: sizes[0] || "Free Size",
//       selected_color: product.color || "",
//       item_price: Number(product.offer_price || product.price || 0),
//       item_data: {
//         image: product.image,
//         slug: product.slug,
//         name: product.name,
//         brand: product.brand || "",
//         fabric: product.fabric || "",
//         material: product.material || "",
//         sizes,
//         colors: product.colors || [],
//       },
//     });

//     if (!success) return;

//     setAddedToCart((prev) => ({ ...prev, [product.id]: true }));

//     setTimeout(() => {
//       setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
//     }, 1500);
//   };

//   const getDiscount = (price, oldPrice) =>
//     oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

//   return (
//     <div className="min-h-screen bg-stone-50">
//       {/* <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 py-5"> */}
//       <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 pt-6 pb-10">
//         <div className="flex items-center gap-2 text-xs text-stone-400 mb-8 flex-wrap">
//           <Link to="/" className="hover:text-primary transition-colors">
//             Home
//           </Link>

//           {breadcrumb.map((item) => (
//             <React.Fragment key={item.path}>
//               <ChevronRight className="w-3 h-3" />
//               <Link to={item.path} className="hover:text-primary transition-colors">
//                 {item.name}
//               </Link>
//             </React.Fragment>
//           ))}
//         </div>

//         <div className="mb-8">
//           {/* <span className="text-primary text-xs uppercase tracking-[0.25em] font-semibold">
//             Products
//           </span> */}
//           <h1 className="font-heading text-2xl md:text-3xl text-primary mt-1">
//             {pageTitle}
//           </h1>
//           <p className="text-stone-500 text-sm mt-1">
//             {displayProducts.length} product
//             {displayProducts.length !== 1 ? "s" : ""} found
//           </p>
//         </div>

//         {loading ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-stone-200">
//             Loading products...
//           </div>
//         ) : displayProducts.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-stone-200">
//             <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Search className="w-8 h-8 text-stone-400" />
//             </div>
//             <h3 className="text-xl font-heading text-stone-800 mb-2">
//               No products found
//             </h3>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
//             {displayProducts.map((product) => {
//               const isWishlisted = wishlist.some((item) => item.id === product.id);
//               const isInCart = cart.some((item) => item.id === product.id);
//               const discount = getDiscount(product.price, product.oldPrice);
//               const isLowStock = product.stockLeft <= 3 && product.stockLeft > 0;

//               return (
//                 <div
//                   key={product.id}
//                   className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100 relative cursor-pointer"
//                   onMouseEnter={() => setHoveredProduct(product.id)}
//                   onMouseLeave={() => setHoveredProduct(null)}
//                   onClick={() => goToProduct(product)}
//                 >
//                   <div className="relative h-52 sm:h-60 md:h-64 lg:h-72 bg-stone-100 overflow-hidden">
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className={`w-full h-full object-cover transition-transform duration-500 ${
//                         hoveredProduct === product.id ? "scale-105" : "scale-100"
//                       }`}
//                       onError={(e) => {
//                         e.currentTarget.src = FALLBACK_IMAGE;
//                       }}
//                     />

//                     <div className="absolute top-2 left-2 flex flex-col gap-1">
//                       {product.badge && (
//                         <span className="bg-primary text-white text-[9px] uppercase tracking-wider px-2 py-1 rounded-full font-bold shadow">
//                           {product.badge}
//                         </span>
//                       )}

//                       {discount && (
//                         <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow">
//                           {discount}% OFF
//                         </span>
//                       )}
//                     </div>

//                     <div
//                       className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${
//                         hoveredProduct === product.id
//                           ? "opacity-100 translate-x-0"
//                           : "opacity-0 translate-x-5"
//                       }`}
//                     >
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleToggleWishlist(product);
//                         }}
//                         className="p-2 bg-white rounded-full shadow hover:bg-primary hover:text-white transition"
//                       >
//                         <Heart
//                           className={`w-4 h-4 ${
//                             isWishlisted
//                               ? "fill-red-500 text-red-500"
//                               : "text-stone-700"
//                           }`}
//                         />
//                       </button>

//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           goToProduct(product);
//                         }}
//                         className="p-2 bg-white rounded-full shadow hover:bg-primary hover:text-white transition"
//                       >
//                         <Eye className="w-4 h-4 text-stone-700" />
//                       </button>
//                     </div>

//                     {isLowStock && (
//                       <div className="absolute bottom-2 left-2 bg-stone-800 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow flex items-center gap-1">
//                         <Zap className="w-3 h-3 fill-white" />
//                         Only {product.stockLeft} left
//                       </div>
//                     )}
//                   </div>

//                   <div className="p-3">
//                     <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1 font-semibold">
//                       {product.categoryText}
//                     </p>

//                     <h3 className="font-semibold text-stone-800 text-sm line-clamp-2 mb-2 hover:text-primary transition-colors leading-snug">
//                       {product.name}
//                     </h3>

//                     <div className="flex items-center gap-2 mb-2">
//                       <span className="text-base font-bold text-stone-800">
//                         ₹{product.price.toLocaleString("en-IN")}
//                       </span>

//                       {product.oldPrice > product.price && (
//                         <span className="text-xs text-stone-400 line-through">
//                           ₹{product.oldPrice.toLocaleString("en-IN")}
//                         </span>
//                       )}
//                     </div>

//                     <div className="hidden sm:flex items-center gap-2 mb-3">
//                       <span className="flex items-center gap-1 text-[10px] text-green-600">
//                         <Truck className="w-3 h-3" /> Free Delivery
//                       </span>
//                       <span className="flex items-center gap-1 text-[10px] text-stone-500">
//                         <Shield className="w-3 h-3" /> Secure
//                       </span>
//                     </div>

//                     <button
//                       onClick={(e) => handleAddToCart(e, product)}
//                       className={`w-full py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
//                         addedToCart[product.id]
//                           ? "bg-green-500 text-white"
//                           : isInCart
//                           ? "bg-green-600 text-white"
//                           : "bg-stone-800 text-white hover:bg-primary"
//                       }`}
//                     >
//                       {addedToCart[product.id]
//                         ? "✓ Added"
//                         : isInCart
//                         ? "In Cart"
//                         : "Add to Cart"}
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//             .line-clamp-2{
//               display:-webkit-box;
//               -webkit-line-clamp:2;
//               -webkit-box-orient:vertical;
//               overflow:hidden;
//             }
//           `,
//         }}
//       />
//     </div>
//   );
// };

// export default ProductListing;


