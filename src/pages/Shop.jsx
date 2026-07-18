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
// import { getProducts } from "@/services/productService";
import { getCategoryHierarchy } from "@/services/categoryService";
import { getImageUrl } from "@/api/axiosClient";
import { extractProductSizes } from "@/utils/productHelpers";
import { getProducts, getProductBySlug } from "@/services/productService";


// const FALLBACK_IMAGE =
//   "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

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
  const backendImage =
    product.thumbnail ||
    product.images?.[0]?.image ||
    product.image ||
    "";

  const price = Number(product.offer_price || product.price || 0);
  const oldPrice = Number(product.price || price || 0);

  return {
    ...product,

    // Backend/admin image unte matrame URL create chesthundi.
    // Frontend fallback image use cheyyatam ledhu.
    image: backendImage ? getImageUrl(backendImage) : "",

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
  // const normalizeProduct = (product) => {
  //   const image = product.thumbnail || product.images?.[0]?.image || "";
  //   const price = Number(product.offer_price || product.price || 0);
  //   const oldPrice = Number(product.price || price || 0);

  //   return {
  //     ...product,
  //     image: image ? getImageUrl(image) : FALLBACK_IMAGE,
  //     price,
  //     oldPrice,
  //     stockLeft: Number(product.stock || 0),
  //     categoryText:
  //       product.child_category_name ||
  //       product.sub_category_name ||
  //       product.category_name ||
  //       currentCategory?.name ||
  //       "",
  //     badge: product.is_best_seller
  //       ? "Bestseller"
  //       : product.is_trending
  //       ? "Trending"
  //       : product.is_featured
  //       ? "Featured"
  //       : "",
  //   };
  // };

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

  const saleMode =
  String(
    fullProduct.sale_mode ||
      product.sale_mode ||
      "piece"
  )
    .trim()
    .toLowerCase();

const minimumQuantity =
  saleMode === "meter"
    ? Number(
        fullProduct.minimum_quantity ||
          product.minimum_quantity ||
          1
      )
    : 1;

const quantityStep =
  saleMode === "meter"
    ? Number(
        fullProduct.quantity_step ||
          product.quantity_step ||
          0.5
      )
    : 1;

const unitName =
  fullProduct.unit_name ||
  product.unit_name ||
  (
    saleMode === "meter"
      ? "meter"
      : "piece"
  );
const success =
  await addToCartProtected({
    product_id:
      fullProduct.id ||
      product.id,

    variant_id:
      lowestVariant?.id ||
      null,

    quantity:
      minimumQuantity,

    selected_size:
      saleMode === "size"
        ? selectedSize
        : "",

    selected_color:
      selectedColor || "",

    sale_mode:
      saleMode,

    unit_name:
      unitName,

    minimum_quantity:
      minimumQuantity,

    quantity_step:
      quantityStep,

    item_price: Number(
      lowestVariant?.offer_price ||
        lowestVariant?.price ||
        fullProduct.offer_price ||
        fullProduct.price ||
        0
    ),

    item_data: {
      image:
        product.image,

      slug:
        fullProduct.slug ||
        product.slug,

      name:
        fullProduct.name ||
        product.name,

      brand:
        fullProduct.brand ||
        "",

      fabric:
        lowestVariant?.fabric ||
        fullProduct.fabric ||
        "",

      material:
        fullProduct.material ||
        "",

      sizes:
        sizes,

      colors,

      sale_mode:
        saleMode,

      unit_name:
        unitName,

      minimum_quantity:
        minimumQuantity,

      quantity_step:
        quantityStep,

      gst_percent:
        Number(
          fullProduct.gst_percent ||
            0
        ),

      variants:
        variants.map((v) => ({
          id: v.id,
          size: v.size || "",
          color: v.color || "",
          stock: Number(
            v.stock || 0
          ),
          price: Number(
            v.price || 0
          ),
          offer_price: Number(
            v.offer_price ||
              v.price ||
              0
          ),
        })),
    },
  });


  if (!success) return;

  setAddedToCart((prev) => ({ ...prev, [product.id]: true }));

  setTimeout(() => {
    setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
  }, 1500);
};
  // const handleAddToCart = async (e, product) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   const sizes = extractProductSizes(product);

  //   const success = await addToCartProtected({
  //     product_id: product.id,
  //     variant_id: null,
  //     quantity: 1,
  //     selected_size: sizes[0] || "Free Size",
  //     selected_color: product.color || "",
  //     item_price: Number(product.offer_price || product.price || 0),
  //     item_data: {
  //       image: product.image,
  //       slug: product.slug,
  //       name: product.name,
  //       brand: product.brand || "",
  //       fabric: product.fabric || "",
  //       material: product.material || "",
  //       sizes,
  //       colors: product.colors || [],
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
                  {/* <img
                    src={cat.image || FALLBACK_IMAGE}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  /> */}
                  {cat.image ? (
  <img
    src={cat.image}
    alt={cat.name}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    onError={(event) => {
      event.currentTarget.style.display = "none";
    }}
  />
) : (
  <div className="w-full h-full bg-stone-100" />
)}
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
                    {/* <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        hoveredProduct === product.id ? "scale-105" : "scale-100"
                      }`}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    /> */}
                    {product.image ? (
  <img
    src={product.image}
    alt={product.name}
    className={`w-full h-full object-cover transition-transform duration-500 ${
      hoveredProduct === product.id ? "scale-105" : "scale-100"
    }`}
    onError={(event) => {
      event.currentTarget.style.display = "none";
    }}
  />
) : (
  <div className="w-full h-full bg-stone-100" />
)}

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


