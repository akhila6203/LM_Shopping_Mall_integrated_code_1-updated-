import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Truck,
  RefreshCcw,
  Minus,
  Plus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Droplet,
  Maximize2,
  Shield,
  Share2,
  Ruler,
} from "lucide-react";
import { useShop } from "../ShopContext.jsx";
import { getProductBySlug, getProducts } from "@/services/productService";
import { getImageUrl } from "@/api/axiosClient";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

const ExpandableSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-stone-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between group hover:bg-stone-50/50 transition-all px-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-stone-800">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-stone-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-stone-400" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
};

const SizeGuide = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-stone-200">
          <th className="text-left py-2 px-3 font-semibold text-stone-700">Size</th>
          <th className="text-left py-2 px-3 font-semibold text-stone-700">Bust (in)</th>
          <th className="text-left py-2 px-3 font-semibold text-stone-700">Waist (in)</th>
          <th className="text-left py-2 px-3 font-semibold text-stone-700">Hip (in)</th>
        </tr>
      </thead>
      <tbody>
        {["XS", "S", "M", "L", "XL", "XXL"].map((size, idx) => (
          <tr key={size} className="border-b border-stone-100">
            <td className="py-2 px-3 font-medium text-stone-600">{size}</td>
            <td className="py-2 px-3 text-stone-500">
              {["32", "34", "36", "38", "40", "42"][idx]}
            </td>
            <td className="py-2 px-3 text-stone-500">
              {["26", "28", "30", "32", "34", "36"][idx]}
            </td>
            <td className="py-2 px-3 text-stone-500">
              {["34", "36", "38", "40", "42", "44"][idx]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ProductDetails = ({ product }) => (
  <div className="space-y-3">
    {[
      { label: "Fabric", value: product.fabric || "-" },
      { label: "Brand", value: product.brand || "-" },
      { label: "Material", value: product.material || product.fabric || "-" },
      { label: "Color", value: product.colorText || "-" },
    ].map((item, idx) => (
      <div
        key={idx}
        className="flex justify-between items-center pb-2 border-b border-stone-100"
      >
        <span className="text-sm text-stone-500">{item.label}</span>
        <span className="text-sm font-medium text-stone-800">{item.value}</span>
      </div>
    ))}
  </div>
);

const DeliveryReturns = () => (
  <div className="space-y-4">
    {[
      { icon: Truck, title: "Free Delivery", desc: "3-5 business days" },
      { icon: RefreshCcw, title: "Easy Returns", desc: "7 days return policy" },
      { icon: Shield, title: "100% Authentic", desc: "Certificate included" },
    ].map((item, idx) => (
      <div key={idx} className="flex items-start gap-3">
        <item.icon className="w-4 h-4 text-primary mt-0.5" />
        <div>
          <p className="text-sm font-medium text-stone-800">{item.title}</p>
          <p className="text-xs text-stone-500">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [colorProducts, setColorProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(false);

  const { addToCart, toggleWishlist, wishlist } = useShop();

  const normalizeImage = (img) => {
    if (!img) return FALLBACK_IMAGE;
    if (typeof img === "string") return getImageUrl(img);
    return getImageUrl(img.image || img.url || img.path || img.thumbnail || "");
  };

 const getSizesFromProduct = (data) => {
  const sizes = [];

  const addSize = (value) => {
    if (!value) return;
    sizes.push(String(value).trim());
  };

  if (Array.isArray(data.variants)) {
    data.variants.forEach((variant) => {
      addSize(variant.size);

      const optionValues =
        typeof variant.option_values === "string"
          ? JSON.parse(variant.option_values || "[]")
          : variant.option_values || [];

      optionValues.forEach((opt) => {
        if (String(opt.name || "").toLowerCase() === "size") {
          addSize(opt.value);
        }
      });
    });
  }

  if (Array.isArray(data.variant_options)) {
    data.variant_options.forEach((option) => {
      if (String(option.option_name || "").toLowerCase() === "size") {
        const values =
          typeof option.option_values === "string"
            ? JSON.parse(option.option_values || "[]")
            : option.option_values || [];

        values.forEach(addSize);
      }
    });
  }

  return [...new Set(sizes)].filter(Boolean);
};
  

  const getColorsFromProduct = (data) => {
  const colors = [];

  const addColor = (value) => {
    if (!value) return;
    colors.push(String(value).trim());
  };

  if (Array.isArray(data.variants)) {
    data.variants.forEach((variant) => {
      addColor(variant.color);

      const optionValues =
        typeof variant.option_values === "string"
          ? JSON.parse(variant.option_values || "[]")
          : variant.option_values || [];

      optionValues.forEach((opt) => {
        if (String(opt.name || "").toLowerCase() === "color") {
          addColor(opt.value);
        }
      });
    });
  }

  if (Array.isArray(data.variant_options)) {
    data.variant_options.forEach((option) => {
      if (String(option.option_name || "").toLowerCase() === "color") {
        const values =
          typeof option.option_values === "string"
            ? JSON.parse(option.option_values || "[]")
            : option.option_values || [];

        values.forEach(addColor);
      }
    });
  }

  return [...new Set(colors)].filter(Boolean);
};


  const normalizeProduct = (data) => {
    const images =
      data.images?.length > 0
        ? data.images.map(normalizeImage)
        : data.thumbnail
        ? [getImageUrl(data.thumbnail)]
        : [FALLBACK_IMAGE];

    const price = Number(data.offer_price || data.price || 0);
    const oldPrice = Number(data.price || data.offer_price || 0);
    const sizes = getSizesFromProduct(data);
    const colors = getColorsFromProduct(data);

    return {
      ...data,
      images,
      image: images[0],
      price,
      oldPrice,
      originalPrice: oldPrice,
      stockLeft: Number(data.stock || 0),
      rating: Number(data.avg_rating || data.rating || 4.5),
      reviews: Number(data.review_count || data.reviews || 0),
      desc:
        data.short_description ||
        data.long_description ||
        data.description ||
        "",
        fabric: data.fabric || "",
        brand: data.brand || data.brand_name || "",
        material: data.material || data.material_name || "",
      // fabric: data.fabric || data.product_type || "",
      // brand: data.brand || data.brand_name || "",
      // material: data.material || data.material_name || data.fabric || "",
      sizes,
      colors,
      colorText: colors[0] || data.color || data.color_name || "",
      categoryText:
        data.child_category_name ||
        data.sub_category_name ||
        data.category_name ||
        "",
      collectionText:
        data.child_category_name ||
        data.sub_category_name ||
        data.category_name ||
        "Premium Collection",
    };
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const data = await getProductBySlug(slug);

        if (!data) {
          setProduct(null);
          return;
        }

        const normalized = normalizeProduct(data);

        setProduct(normalized);
        setSelectedImage(0);
        setQuantity(1);
        setSelectedSize(normalized.sizes?.[0] || "");
        setSelectedColor(normalized.colors?.[0] || null);

        const similarParams = {
          status: "active",
          limit: 12,
        };

        if (data.child_category_id) similarParams.child_category_id = data.child_category_id;
        else if (data.sub_category_id) similarParams.sub_category_id = data.sub_category_id;
        else if (data.category_id) similarParams.category_id = data.category_id;

        const related = await getProducts(similarParams);

        setSimilarProducts(
          (related || [])
            .filter((item) => item.slug !== data.slug)
            .slice(0, 8)
            .map(normalizeProduct)
        );

        const colorParams = {
          status: "active",
          limit: 12,
        };

        if (data.sub_category_id) colorParams.sub_category_id = data.sub_category_id;
        else if (data.category_id) colorParams.category_id = data.category_id;

        const colorRelated = await getProducts(colorParams);

        setColorProducts(
          (colorRelated || [])
            .filter((item) => item.slug !== data.slug)
            .slice(0, 8)
            .map(normalizeProduct)
        );

        const stored = localStorage.getItem("llmshop_recently_viewed");
        const viewed = stored ? JSON.parse(stored) : [];

        const updated = [
          normalized,
          ...viewed.filter((p) => p.id !== normalized.id),
        ].slice(0, 8);

        localStorage.setItem("llmshop_recently_viewed", JSON.stringify(updated));
        setRecentlyViewed(updated);
      } catch (error) {
        console.error("Product details fetch error:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }

      window.scrollTo(0, 0);
    };

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h2 className="text-xl font-heading text-stone-800 mb-2">Product not found</h2>
          <Link to="/shop" className="text-primary hover:underline">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = product.categoryText || "Products";
  const categoryLink = product.sub_category_id
    ? `/products/subcategory/${product.sub_category_id}`
    : product.category_id
    ? `/shop?category_id=${product.category_id}`
    : "/shop";

  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const originalPrice = product.oldPrice || product.originalPrice;
  const discount =
    originalPrice > product.price
      ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
      : 0;

  const isLowStock = product.stockLeft <= 3 && product.stockLeft > 0;
  const productImages = product.images?.length ? product.images : [product.image || FALLBACK_IMAGE];

 const handleAddToCart = async (productToAdd) => {
  const item = productToAdd || product;

  const success = await addToCart({
    product_id: item.id,
    id: item.id,
    variant_id: null,
    quantity: Number(quantity) || 1,
    qty: Number(quantity) || 1,
    selected_size: selectedSize || "Free Size",
    size: selectedSize || "Free Size",
    selected_color: selectedColor || "",
    color: selectedColor || "",
    item_price: Number(item.price || 0),
    price: Number(item.price || 0),
    sizes: item.sizes?.length ? item.sizes : [selectedSize || "Free Size"],
    colors: item.colors || [],
    slug: item.slug,
    name: item.name,
    image: item.image || item.images?.[0],
    oldPrice: item.oldPrice,
    fabric: item.fabric || "",
    material: item.material || "",
    stock: item.stockLeft,
  });

  if (!success) return false;

  setAddedToCart(true);
  setShowToast(`${quantity} item(s) added to cart!`);

  setTimeout(() => {
    setAddedToCart(false);
    setShowToast(null);
  }, 2000);

  return true;
};

  const handleBuyNow = async () => {
  const success = await handleAddToCart();
  if (success) navigate("/cart");
};

  const MiniCard = ({ item }) => (
    <Link
      to={`/product/${item.slug}`}
      className="min-w-[220px] bg-white border border-stone-100 block hover:shadow-lg transition-shadow"
    >
      <img
        src={item.image || FALLBACK_IMAGE}
        alt={item.name}
        className="w-full h-[280px] object-cover"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />
      <div className="p-3">
        <p className="text-xs text-stone-400 uppercase tracking-wider line-clamp-1">
          {item.colorText || item.categoryText}
        </p>
        <p className="text-sm text-black line-clamp-2">{item.name}</p>
        <p className="text-sm font-semibold mt-1">
          ₹{Number(item.price || 0).toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );

  return (
    <div className="w-full min-h-screen bg-stone-50">
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100]">
          <div className="bg-stone-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            {showToast}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-7xl py-4">
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <Link to="/" className="hover:text-primary transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={categoryLink} className="hover:text-primary transition">
            {categoryLabel}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-600 truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="relative w-full bg-white overflow-hidden border border-stone-200">
                <div className="relative h-[420px] md:h-[500px] lg:h-[560px] flex items-center justify-center bg-stone-50">
                {/* <div className="relative h-[520px]  flex items-center justify-center bg-stone-50"> */}
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain transition-all duration-500"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === 0 ? productImages.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 shadow-md hover:bg-white transition"
                      >
                        <ChevronLeft className="w-5 h-5 text-stone-700" />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === productImages.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 shadow-md hover:bg-white transition"
                      >
                        <ChevronRight className="w-5 h-5 text-stone-700" />
                      </button>
                    </>
                  )}

                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {discount > 0 && (
                      <span className="bg-stone-800 text-white text-xs font-bold px-3 py-1.5 shadow-lg">
                        {discount}% OFF
                      </span>
                    )}

                    {isLowStock && (
                      <span className="bg-stone-700 text-white text-xs font-bold px-3 py-1.5 shadow-lg flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-white" />
                        Only {product.stockLeft} left
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-4 right-4 p-2.5 shadow-md transition-all hover:scale-110 ${
                      isInWishlist ? "bg-primary text-white" : "bg-white text-stone-600"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? "fill-white" : ""}`} />
                  </button>

                  <div className="absolute bottom-4 right-4 bg-white/90 text-xs font-medium text-stone-600 px-3 py-1.5 rounded-full shadow">
                    {selectedImage + 1} / {productImages.length}
                  </div>
                </div>
              </div>

              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? "border-primary"
                          : "border-stone-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {colorProducts.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {colorProducts.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.slug}`}
                      className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        item.slug === product.slug
                          ? "border-primary"
                          : "border-stone-200 opacity-70 hover:opacity-100"
                      }`}
                      title={item.colorText || item.name}
                    >
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <span className="text-xs text-primary font-bold uppercase tracking-wider">
              {product.collectionText}
            </span>

            <h1 className="font-heading text-3xl md:text-4xl text-stone-800 mt-1 mb-3">
              {product.name}
            </h1>

            <div className="mb-6 pb-4 border-b border-stone-200">
              <div className="flex items-end gap-3">
                <span className="font-heading text-3xl text-stone-800">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {originalPrice > product.price && (
                  <>
                    <span className="text-lg text-stone-400 line-through mb-1">
                      ₹{originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-primary font-bold bg-primary/10 px-2 py-0.5">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-2">Inclusive of all taxes • Free shipping</p>
            </div>

            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-stone-700 mb-2">Color:</p>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border text-sm transition-all ${
                        selectedColor === color
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-stone-200 text-stone-600 hover:border-primary/50"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-stone-700">Size</p>
                  <button className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" />
                    Size Guide
                  </button>
                </div>

                {product.sizes?.length > 0 ? (
                  <div className="grid grid-cols-6 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 border font-medium text-sm transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-stone-200 text-stone-600 hover:border-primary/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-stone-400">Size not available</p>
                )}
              </div>
             
            )}

            <div className="mb-6">
              <p className="text-sm font-medium text-stone-700 mb-3">Quantity</p>
              <div className="flex items-center border border-stone-200 w-32 bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3">
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-full text-center font-medium text-stone-800 bg-transparent outline-none"
                />
                <button onClick={() => setQuantity(quantity + 1)} className="p-3">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => handleAddToCart()}
                className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-stone-800 text-white py-4 font-bold text-sm uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </button>
            </div>

            <div className="border border-stone-200 overflow-hidden bg-white">
              <ExpandableSection title="Product Details" icon={Info} defaultOpen={true}>
                <p className="text-sm text-stone-600 mb-4">{product.desc}</p>
                <ProductDetails product={product} />
              </ExpandableSection>

              <ExpandableSection title="Size Guide" icon={Ruler}>
                <SizeGuide />
              </ExpandableSection>

              <ExpandableSection title="Delivery & Returns" icon={Truck}>
                <DeliveryReturns />
              </ExpandableSection>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200">
              <button className="flex items-center gap-2 text-sm text-stone-500 hover:text-primary transition">
                <Share2 className="w-4 h-4" />
                Share this product
              </button>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-6">Similar Products</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {similarProducts.map((item) => (
                <MiniCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {recentlyViewed.length > 1 && (
          <div className="mt-12 border-t border-stone-200 pt-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-widest">History</span>
                <h3 className="text-xl font-semibold text-black">Recently Viewed</h3>
              </div>
              <button
                onClick={() => {
                  setRecentlyViewed([]);
                  localStorage.removeItem("llmshop_recently_viewed");
                }}
                className="text-xs text-gray-400 hover:text-red-500"
              >
                Clear
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {recentlyViewed
                .filter((p) => p.slug !== product.slug)
                .slice(0, 6)
                .map((p) => (
                  <MiniCard key={p.id} item={p} />
                ))}
            </div>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .scrollbar-hide::-webkit-scrollbar{display:none}
            .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
            .line-clamp-1{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
            .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
          `,
        }}
      />
    </div>
  );
};

export default ProductDetail;


// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   ShoppingCart,
//   Heart,
//   Star,
//   Truck,
//   RefreshCcw,
//   Minus,
//   Plus,
//   ShieldCheck,
//   CheckCircle2,
//   ChevronLeft,
//   ChevronRight,
//   Zap,
//   Info,
//   ChevronDown,
//   ChevronUp,
//   Droplet,
//   Maximize2,
//   Shield,
//   WashingMachine,
//   Sun,
//   Thermometer,
//   Share2,
//   Ruler,
// } from "lucide-react";
// import { useShop } from "../ShopContext.jsx";
// import {
//   getProductBySlug,
//   getProductsBySubCategory,
//   findSubCategory,
// } from "@/utils/productHelpers";

// const FALLBACK_IMAGE =
//   "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

// const ExpandableSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
//   const [isOpen, setIsOpen] = useState(defaultOpen);
//   return (
//     <div className="border-b border-stone-100 last:border-0">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full py-4 flex items-center justify-between group hover:bg-stone-50/50 transition-all px-4"
//       >
//         <div className="flex items-center gap-3">
//           <div className="p-1.5 bg-primary/10 rounded-lg">
//             <Icon className="w-4 h-4 text-primary" />
//           </div>
//           <span className="font-medium text-stone-800">{title}</span>
//         </div>
//         {isOpen ? (
//           <ChevronUp className="w-4 h-4 text-stone-400" />
//         ) : (
//           <ChevronDown className="w-4 h-4 text-stone-400" />
//         )}
//       </button>
//       <div
//         className={`overflow-hidden transition-all duration-300 ${
//           isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
//         }`}
//       >
//         <div className="px-4 pb-4">{children}</div>
//       </div>
//     </div>
//   );
// };

// const SizeGuide = () => (
//   <div className="overflow-x-auto">
//     <table className="w-full text-sm">
//       <thead>
//         <tr className="border-b border-stone-200">
//           <th className="text-left py-2 px-3 font-semibold text-stone-700">Size</th>
//           <th className="text-left py-2 px-3 font-semibold text-stone-700">Bust (in)</th>
//           <th className="text-left py-2 px-3 font-semibold text-stone-700">Waist (in)</th>
//           <th className="text-left py-2 px-3 font-semibold text-stone-700">Hip (in)</th>
//         </tr>
//       </thead>
//       <tbody>
//         {["XS", "S", "M", "L", "XL", "XXL"].map((size, idx) => (
//           <tr key={size} className="border-b border-stone-100">
//             <td className="py-2 px-3 font-medium text-stone-600">{size}</td>
//             <td className="py-2 px-3 text-stone-500">
//               {["32", "34", "36", "38", "40", "42"][idx]}
//             </td>
//             <td className="py-2 px-3 text-stone-500">
//               {["26", "28", "30", "32", "34", "36"][idx]}
//             </td>
//             <td className="py-2 px-3 text-stone-500">
//               {["34", "36", "38", "40", "42", "44"][idx]}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// const FabricCare = () => (
//   <div className="grid grid-cols-2 gap-3">
//     {[
//       { icon: WashingMachine, text: "Dry Clean Only" },
//       { icon: Sun, text: "No Direct Sunlight" },
//       { icon: Thermometer, text: "Cool Iron Only" },
//       { icon: Droplet, text: "No Bleach" },
//     ].map((item, idx) => (
//       <div key={idx} className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg">
//         <item.icon className="w-4 h-4 text-primary" />
//         <span className="text-xs text-stone-600">{item.text}</span>
//       </div>
//     ))}
//   </div>
// );

// const ProductDetails = ({ product }) => (
//   <div className="space-y-3">
//     {[
//       { label: "Fabric", value: product.fabric },
//       { label: "Occasion", value: product.occasion },
//       { label: "Weave Type", value: "Handwoven" },
//       { label: "Wash Care", value: "Dry Clean Only" },
//     ].map((item, idx) => (
//       <div
//         key={idx}
//         className="flex justify-between items-center pb-2 border-b border-stone-100"
//       >
//         <span className="text-sm text-stone-500">{item.label}</span>
//         <span className="text-sm font-medium text-stone-800">{item.value}</span>
//       </div>
//     ))}
//   </div>
// );

// const DeliveryReturns = () => (
//   <div className="space-y-4">
//     {[
//       { icon: Truck, title: "Free Delivery", desc: "3-5 business days" },
//       { icon: RefreshCcw, title: "Easy Returns", desc: "7 days return policy" },
//       { icon: Shield, title: "100% Authentic", desc: "Certificate included" },
//     ].map((item, idx) => (
//       <div key={idx} className="flex items-start gap-3">
//         <item.icon className="w-4 h-4 text-primary mt-0.5" />
//         <div>
//           <p className="text-sm font-medium text-stone-800">{item.title}</p>
//           <p className="text-xs text-stone-500">{item.desc}</p>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// const ProductDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState("M");
//   const [addedToCart, setAddedToCart] = useState(false);
//   const [showToast, setShowToast] = useState(null);
//   const [recentlyViewed, setRecentlyViewed] = useState([]);
//   const { addToCart, toggleWishlist, wishlist } = useShop();

//   useEffect(() => {
//     const foundProduct = getProductBySlug(slug);
//     if (foundProduct) {
//       setProduct(foundProduct);
//       setSelectedColor(foundProduct.colors?.[0] || null);
//       setSelectedImage(0);

//       const stored = localStorage.getItem("llmshop_recently_viewed");
//       const viewed = stored ? JSON.parse(stored) : [];
//       const normalized = {
//         ...foundProduct,
//         image: foundProduct.image || foundProduct.images?.[0],
//         originalPrice: foundProduct.oldPrice,
//       };
//       const updated = [normalized, ...viewed.filter((p) => p.id !== foundProduct.id)].slice(
//         0,
//         8
//       );
//       localStorage.setItem("llmshop_recently_viewed", JSON.stringify(updated));
//     } else {
//       setProduct(null);
//     }
//     window.scrollTo(0, 0);
//   }, [slug]);

//   useEffect(() => {
//     const stored = localStorage.getItem("llmshop_recently_viewed");
//     if (stored) setRecentlyViewed(JSON.parse(stored));
//   }, [product]);

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-stone-50">
//         <div className="text-center">
//           <h2 className="text-xl font-heading text-stone-800 mb-2">Product not found</h2>
//           <Link to="/shop" className="text-primary hover:underline">
//             Back to shop
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const subCategoryInfo = findSubCategory(product.subCategorySlug);
//   const categoryLabel = subCategoryInfo?.sub?.name || product.subCategorySlug;
//   const categoryLink = `/products/subcategory/${product.subCategorySlug}`;

//   const similarProducts = getProductsBySubCategory(product.subCategorySlug)
//     .filter((p) => p.slug !== product.slug)
//     .slice(0, 4);

//   const isInWishlist = wishlist.some((item) => item.id === product.id);
//   const originalPrice = product.oldPrice || product.originalPrice;
//   const discount =
//     originalPrice > product.price
//       ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
//       : 0;
//   const isLowStock = product.stockLeft <= 3;
//   const productImages = product.images?.length
//     ? product.images
//     : [product.image || FALLBACK_IMAGE];

//   const handleAddToCart = (productToAdd) => {
//     const item = productToAdd || product;
//     addToCart({
//       ...item,
//       qty: quantity,
//       size: selectedSize,
//       selectedColor,
//       image: item.image || item.images?.[0],
//     });
//     setAddedToCart(true);
//     setShowToast(`${item.name} added to cart!`);
//     setTimeout(() => {
//       setAddedToCart(false);
//       setShowToast(null);
//     }, 2000);
//   };

//   const handleBuyNow = () => {
//     handleAddToCart();
//     setTimeout(() => navigate("/checkout"), 500);
//   };

//   return (
//     <div className="w-full min-h-screen bg-stone-50">
//       {showToast && (
//         <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100]">
//           <div className="bg-stone-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-sm font-medium">
//             <CheckCircle2 className="w-4 h-4 text-primary" />
//             {showToast}
//           </div>
//         </div>
//       )}

//       <div className="container mx-auto px-4 max-w-7xl py-4">
//         <div className="flex items-center gap-2 text-xs text-stone-400">
//           <Link to="/" className="hover:text-primary transition">
//             Home
//           </Link>
//           <ChevronRight className="w-3 h-3" />
//           <Link to={categoryLink} className="hover:text-primary transition">
//             {categoryLabel}
//           </Link>
//           <ChevronRight className="w-3 h-3" />
//           <span className="text-stone-600 truncate">{product.name}</span>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 max-w-7xl pb-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
//           <div className="lg:col-span-7">
//             <div className="lg:sticky lg:top-24 space-y-4">
//               <div className="relative w-full bg-white overflow-hidden border border-stone-200">
//                 <div className="relative aspect-[3/4] flex items-center justify-center bg-stone-50">
//                   <img
//                     src={productImages[selectedImage]}
//                     alt={product.name}
//                     className="w-full h-full object-contain transition-all duration-500"
//                     onError={(e) => {
//                       e.target.src = FALLBACK_IMAGE;
//                     }}
//                   />
//                   {productImages.length > 1 && (
//                     <>
//                       <button
//                         onClick={() =>
//                           setSelectedImage((prev) =>
//                             prev === 0 ? productImages.length - 1 : prev - 1
//                           )
//                         }
//                         className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 shadow-md hover:bg-white transition"
//                       >
//                         <ChevronLeft className="w-5 h-5 text-stone-700" />
//                       </button>
//                       <button
//                         onClick={() =>
//                           setSelectedImage((prev) =>
//                             prev === productImages.length - 1 ? 0 : prev + 1
//                           )
//                         }
//                         className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 shadow-md hover:bg-white transition"
//                       >
//                         <ChevronRight className="w-5 h-5 text-stone-700" />
//                       </button>
//                     </>
//                   )}
//                   <div className="absolute top-4 left-4 flex flex-col gap-2">
//                     {discount > 0 && (
//                       <span className="bg-stone-800 text-white text-xs font-bold px-3 py-1.5 shadow-lg">
//                         {discount}% OFF
//                       </span>
//                     )}
//                     {isLowStock && (
//                       <span className="bg-stone-700 text-white text-xs font-bold px-3 py-1.5 shadow-lg flex items-center gap-1">
//                         <Zap className="w-3 h-3 fill-white" />
//                         Only {product.stockLeft} left
//                       </span>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => toggleWishlist(product)}
//                     className={`absolute top-4 right-4 p-2.5 shadow-md transition-all hover:scale-110 ${
//                       isInWishlist ? "bg-primary text-white" : "bg-white text-stone-600"
//                     }`}
//                   >
//                     <Heart className={`w-5 h-5 ${isInWishlist ? "fill-white" : ""}`} />
//                   </button>
//                   <div className="absolute bottom-4 right-4 bg-white/90 text-xs font-medium text-stone-600 px-3 py-1.5 rounded-full shadow">
//                     {selectedImage + 1} / {productImages.length}
//                   </div>
//                 </div>
//               </div>
//               {productImages.length > 1 && (
//                 <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
//                   {productImages.map((img, idx) => (
//                     <button
//                       key={idx}
//                       onClick={() => setSelectedImage(idx)}
//                       className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
//                         selectedImage === idx
//                           ? "border-primary"
//                           : "border-stone-200 opacity-70 hover:opacity-100"
//                       }`}
//                     >
//                       <img src={img} alt="" className="w-full h-full object-cover" />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="lg:col-span-5">
//             <span className="text-xs text-primary font-bold uppercase tracking-wider">
//               Premium Collection
//             </span>
//             <h1 className="font-heading text-3xl md:text-4xl text-stone-800 mt-1 mb-3">
//               {product.name}
//             </h1>
//             <div className="flex items-center gap-3 mb-4">
//               <div className="flex items-center gap-1">
//                 <span className="text-sm font-bold text-stone-800">{product.rating}</span>
//                 <div className="flex">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`w-4 h-4 ${
//                         i < Math.floor(product.rating)
//                           ? "fill-yellow-500 text-yellow-500"
//                           : "text-stone-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <span className="text-xs text-stone-400">({product.reviews} reviews)</span>
//               <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
//               <span className="text-xs text-stone-600 flex items-center gap-1">
//                 <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
//                 In Stock
//               </span>
//             </div>
//             <div className="mb-6 pb-4 border-b border-stone-200">
//               <div className="flex items-end gap-3">
//                 <span className="font-heading text-3xl text-stone-800">
//                   ₹{product.price.toLocaleString("en-IN")}
//                 </span>
//                 {originalPrice > product.price && (
//                   <>
//                     <span className="text-lg text-stone-400 line-through mb-1">
//                       ₹{originalPrice.toLocaleString("en-IN")}
//                     </span>
//                     <span className="text-sm text-primary font-bold bg-primary/10 px-2 py-0.5">
//                       Save {discount}%
//                     </span>
//                   </>
//                 )}
//               </div>
//               <p className="text-xs text-stone-400 mt-2">Inclusive of all taxes • Free shipping</p>
//             </div>

//             {product.colors && (
//               <div className="mb-6">
//                 <p className="text-sm font-medium text-stone-700 mb-2">Color:</p>
//                 <div className="flex gap-3">
//                   {product.colors.map((color, idx) => (
//                     <button
//                       key={idx}
//                       onClick={() => setSelectedColor(color)}
//                       className={`w-12 h-12 rounded-full border-2 transition-all ${
//                         selectedColor === color
//                           ? "border-primary scale-110"
//                           : "border-stone-200 hover:scale-105"
//                       }`}
//                       style={{ backgroundColor: color }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="mb-6">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-sm font-medium text-stone-700">Size</p>
//                 <button className="text-xs text-primary hover:underline flex items-center gap-1">
//                   <Maximize2 className="w-3 h-3" />
//                   Size Guide
//                 </button>
//               </div>
//               <div className="grid grid-cols-6 gap-2">
//                 {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
//                   <button
//                     key={size}
//                     onClick={() => setSelectedSize(size)}
//                     className={`py-2.5 border font-medium text-sm transition-all ${
//                       selectedSize === size
//                         ? "border-primary bg-primary/5 text-primary"
//                         : "border-stone-200 text-stone-600 hover:border-primary/50"
//                     }`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-6">
//               <p className="text-sm font-medium text-stone-700 mb-3">Quantity</p>
//               <div className="flex items-center border border-stone-200 w-32 bg-white">
//                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3">
//                   <Minus className="w-4 h-4" />
//                 </button>
//                 <input
//                   type="text"
//                   value={quantity}
//                   readOnly
//                   className="w-full text-center font-medium text-stone-800 bg-transparent outline-none"
//                 />
//                 <button onClick={() => setQuantity(quantity + 1)} className="p-3">
//                   <Plus className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3 mb-8">
//               <button
//                 onClick={() => handleAddToCart()}
//                 className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
//                   addedToCart
//                     ? "bg-green-500 text-white"
//                     : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
//                 }`}
//               >
//                 {addedToCart ? (
//                   <>
//                     <CheckCircle2 className="w-5 h-5" />
//                     Added
//                   </>
//                 ) : (
//                   <>
//                     <ShoppingCart className="w-5 h-5" />
//                     Add to Cart
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={handleBuyNow}
//                 className="flex-1 bg-stone-800 text-white py-4 font-bold text-sm uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2"
//               >
//                 <Zap className="w-5 h-5" />
//                 Buy Now
//               </button>
//             </div>

//             <div className="border border-stone-200 overflow-hidden bg-white">
//               <ExpandableSection title="Product Details" icon={Info} defaultOpen={true}>
//                 <p className="text-sm text-stone-600 mb-4">{product.desc}</p>
//                 <ProductDetails product={product} />
//               </ExpandableSection>
//               <ExpandableSection title="Size Guide" icon={Ruler}>
//                 <SizeGuide />
//               </ExpandableSection>
//               <ExpandableSection title="Fabric & Care" icon={Droplet}>
//                 <FabricCare />
//               </ExpandableSection>
//               <ExpandableSection title="Delivery & Returns" icon={Truck}>
//                 <DeliveryReturns />
//               </ExpandableSection>
//             </div>

//             <div className="mt-6 pt-4 border-t border-stone-200">
//               <button className="flex items-center gap-2 text-sm text-stone-500 hover:text-primary transition">
//                 <Share2 className="w-4 h-4" />
//                 Share this product
//               </button>
//             </div>
//           </div>
//         </div>

//         {similarProducts.length > 0 && (
//           <div className="mt-12">
//             <h2 className="text-xl md:text-2xl font-semibold mb-6">Similar Products</h2>
//             <div className="flex gap-4 overflow-x-auto scrollbar-hide">
//               {similarProducts.map((item) => (
//                 <Link
//                   key={item.id}
//                   to={`/product/${item.slug}`}
//                   className="min-w-[220px] bg-white border border-stone-100 block hover:shadow-lg transition-shadow"
//                 >
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-full h-[280px] object-cover"
//                   />
//                   <div className="p-3">
//                     <p className="text-sm text-black line-clamp-2">{item.name}</p>
//                     <p className="text-sm font-semibold mt-1">
//                       ₹{item.price.toLocaleString()}
//                     </p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )}

//         {recentlyViewed.length > 1 && (
//           <div className="mt-12 border-t border-stone-200 pt-8">
//             <div className="flex items-center justify-between mb-5">
//               <div>
//                 <span className="text-xs text-gray-400 uppercase tracking-widest">History</span>
//                 <h3 className="text-xl font-semibold text-black">Recently Viewed</h3>
//               </div>
//               <button
//                 onClick={() => {
//                   setRecentlyViewed([]);
//                   localStorage.removeItem("llmshop_recently_viewed");
//                 }}
//                 className="text-xs text-gray-400 hover:text-red-500"
//               >
//                 Clear
//               </button>
//             </div>
//             <div className="flex gap-4 overflow-x-auto scrollbar-hide">
//               {recentlyViewed
//                 .filter((p) => p.slug !== product.slug)
//                 .slice(0, 6)
//                 .map((p) => (
//                   <div key={p.id} className="min-w-[200px] flex-shrink-0">
//                     <Link to={`/product/${p.slug || p.id}`}>
//                       <img
//                         src={p.images?.[0] || p.image}
//                         alt={p.name}
//                         className="w-full h-[260px] object-cover"
//                       />
//                     </Link>
//                     <Link to={`/product/${p.slug || p.id}`}>
//                       <p className="text-sm text-black mt-2 line-clamp-2 hover:text-primary transition">
//                         {p.name}
//                       </p>
//                     </Link>
//                     <p className="text-sm font-semibold">₹{p.price.toLocaleString()}</p>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`,
//         }}
//       />
//     </div>
//   );
// };

// export default ProductDetail;





// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   ShoppingCart,
//   Heart,
//   Star,
//   Truck,
//   RefreshCcw,
//   Minus,
//   Plus,
//   ShieldCheck,
//   CheckCircle2,
//   ChevronLeft,
//   ChevronRight,
//   Zap,
//   Info,
//   ChevronDown,
//   ChevronUp,
//   Droplet,
//   Maximize2,
//   Shield,
//   WashingMachine,
//   Sun,
//   Thermometer,
//   Share2,
//   Ruler,
// } from "lucide-react";
// import { useShop } from "../ShopContext.jsx";
// import {
//   getProductBySlug,
//   getProductsBySubCategory,
//   findSubCategory,
// } from "@/utils/productHelpers";

// const FALLBACK_IMAGE =
//   "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

// const ExpandableSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
//   const [isOpen, setIsOpen] = useState(defaultOpen);
//   return (
//     <div className="border-b border-stone-100 last:border-0">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full py-4 flex items-center justify-between group hover:bg-stone-50/50 transition-all px-4"
//       >
//         <div className="flex items-center gap-3">
//           <div className="p-1.5 bg-primary/10 rounded-lg">
//             <Icon className="w-4 h-4 text-primary" />
//           </div>
//           <span className="font-medium text-stone-800">{title}</span>
//         </div>
//         {isOpen ? (
//           <ChevronUp className="w-4 h-4 text-stone-400" />
//         ) : (
//           <ChevronDown className="w-4 h-4 text-stone-400" />
//         )}
//       </button>
//       <div
//         className={`overflow-hidden transition-all duration-300 ${
//           isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
//         }`}
//       >
//         <div className="px-4 pb-4">{children}</div>
//       </div>
//     </div>
//   );
// };

// const SizeGuide = () => (
//   <div className="overflow-x-auto">
//     <table className="w-full text-sm">
//       <thead>
//         <tr className="border-b border-stone-200">
//           <th className="text-left py-2 px-3 font-semibold text-stone-700">Size</th>
//           <th className="text-left py-2 px-3 font-semibold text-stone-700">Bust (in)</th>
//           <th className="text-left py-2 px-3 font-semibold text-stone-700">Waist (in)</th>
//           <th className="text-left py-2 px-3 font-semibold text-stone-700">Hip (in)</th>
//         </tr>
//       </thead>
//       <tbody>
//         {["XS", "S", "M", "L", "XL", "XXL"].map((size, idx) => (
//           <tr key={size} className="border-b border-stone-100">
//             <td className="py-2 px-3 font-medium text-stone-600">{size}</td>
//             <td className="py-2 px-3 text-stone-500">
//               {["32", "34", "36", "38", "40", "42"][idx]}
//             </td>
//             <td className="py-2 px-3 text-stone-500">
//               {["26", "28", "30", "32", "34", "36"][idx]}
//             </td>
//             <td className="py-2 px-3 text-stone-500">
//               {["34", "36", "38", "40", "42", "44"][idx]}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// const FabricCare = () => (
//   <div className="grid grid-cols-2 gap-3">
//     {[
//       { icon: WashingMachine, text: "Dry Clean Only" },
//       { icon: Sun, text: "No Direct Sunlight" },
//       { icon: Thermometer, text: "Cool Iron Only" },
//       { icon: Droplet, text: "No Bleach" },
//     ].map((item, idx) => (
//       <div key={idx} className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg">
//         <item.icon className="w-4 h-4 text-primary" />
//         <span className="text-xs text-stone-600">{item.text}</span>
//       </div>
//     ))}
//   </div>
// );

// const ProductDetails = ({ product }) => (
//   <div className="space-y-3">
//     {[
//       { label: "Fabric", value: product.fabric },
//       { label: "Occasion", value: product.occasion },
//       { label: "Weave Type", value: "Handwoven" },
//       { label: "Wash Care", value: "Dry Clean Only" },
//     ].map((item, idx) => (
//       <div
//         key={idx}
//         className="flex justify-between items-center pb-2 border-b border-stone-100"
//       >
//         <span className="text-sm text-stone-500">{item.label}</span>
//         <span className="text-sm font-medium text-stone-800">{item.value}</span>
//       </div>
//     ))}
//   </div>
// );

// const DeliveryReturns = () => (
//   <div className="space-y-4">
//     {[
//       { icon: Truck, title: "Free Delivery", desc: "3-5 business days" },
//       { icon: RefreshCcw, title: "Easy Returns", desc: "7 days return policy" },
//       { icon: Shield, title: "100% Authentic", desc: "Certificate included" },
//     ].map((item, idx) => (
//       <div key={idx} className="flex items-start gap-3">
//         <item.icon className="w-4 h-4 text-primary mt-0.5" />
//         <div>
//           <p className="text-sm font-medium text-stone-800">{item.title}</p>
//           <p className="text-xs text-stone-500">{item.desc}</p>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// const ProductDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState("M");
//   const [addedToCart, setAddedToCart] = useState(false);
//   const [showToast, setShowToast] = useState(null);
//   const [recentlyViewed, setRecentlyViewed] = useState([]);
//   const { addToCart, toggleWishlist, wishlist } = useShop();

//   useEffect(() => {
//     const foundProduct = getProductBySlug(slug);
//     if (foundProduct) {
//       setProduct(foundProduct);
//       setSelectedColor(foundProduct.colors?.[0] || null);
//       setSelectedImage(0);

//       const stored = localStorage.getItem("llmshop_recently_viewed");
//       const viewed = stored ? JSON.parse(stored) : [];
//       const normalized = {
//         ...foundProduct,
//         image: foundProduct.image || foundProduct.images?.[0],
//         originalPrice: foundProduct.oldPrice,
//       };
//       const updated = [normalized, ...viewed.filter((p) => p.id !== foundProduct.id)].slice(
//         0,
//         8
//       );
//       localStorage.setItem("llmshop_recently_viewed", JSON.stringify(updated));
//     } else {
//       setProduct(null);
//     }
//     window.scrollTo(0, 0);
//   }, [slug]);

//   useEffect(() => {
//     const stored = localStorage.getItem("llmshop_recently_viewed");
//     if (stored) setRecentlyViewed(JSON.parse(stored));
//   }, [product]);

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-stone-50">
//         <div className="text-center">
//           <h2 className="text-xl font-heading text-stone-800 mb-2">Product not found</h2>
//           <Link to="/shop" className="text-primary hover:underline">
//             Back to shop
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const subCategoryInfo = findSubCategory(product.subCategorySlug);
//   const categoryLabel = subCategoryInfo?.sub?.name || product.subCategorySlug;
//   const categoryLink = `/products/subcategory/${product.subCategorySlug}`;

//   const similarProducts = getProductsBySubCategory(product.subCategorySlug)
//     .filter((p) => p.slug !== product.slug)
//     .slice(0, 4);

//   const isInWishlist = wishlist.some((item) => item.id === product.id);
//   const originalPrice = product.oldPrice || product.originalPrice;
//   const discount =
//     originalPrice > product.price
//       ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
//       : 0;
//   const isLowStock = product.stockLeft <= 3;
//   const productImages = product.images?.length
//     ? product.images
//     : [product.image || FALLBACK_IMAGE];

//   const handleAddToCart = (productToAdd) => {
//     const item = productToAdd || product;
//     addToCart({
//       ...item,
//       qty: quantity,
//       size: selectedSize,
//       selectedColor,
//       image: item.image || item.images?.[0],
//     });
//     setAddedToCart(true);
//     setShowToast(`${item.name} added to cart!`);
//     setTimeout(() => {
//       setAddedToCart(false);
//       setShowToast(null);
//     }, 2000);
//   };

//   const handleBuyNow = () => {
//     handleAddToCart();
//     setTimeout(() => navigate("/checkout"), 500);
//   };

//   return (
//     <div className="w-full min-h-screen bg-stone-50">
//       {showToast && (
//         <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100]">
//           <div className="bg-stone-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-sm font-medium">
//             <CheckCircle2 className="w-4 h-4 text-primary" />
//             {showToast}
//           </div>
//         </div>
//       )}

//       <div className="container mx-auto px-4 max-w-7xl py-4">
//         <div className="flex items-center gap-2 text-xs text-stone-400">
//           <Link to="/" className="hover:text-primary transition">
//             Home
//           </Link>
//           <ChevronRight className="w-3 h-3" />
//           <Link to={categoryLink} className="hover:text-primary transition">
//             {categoryLabel}
//           </Link>
//           <ChevronRight className="w-3 h-3" />
//           <span className="text-stone-600 truncate">{product.name}</span>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 max-w-7xl pb-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
//           <div className="lg:col-span-7">
//             <div className="lg:sticky lg:top-24 space-y-4">
//               <div className="relative w-full bg-white overflow-hidden border border-stone-200">
//                 <div className="relative aspect-[3/4] flex items-center justify-center bg-stone-50">
//                   <img
//                     src={productImages[selectedImage]}
//                     alt={product.name}
//                     className="w-full h-full object-contain transition-all duration-500"
//                     onError={(e) => {
//                       e.target.src = FALLBACK_IMAGE;
//                     }}
//                   />
//                   {productImages.length > 1 && (
//                     <>
//                       <button
//                         onClick={() =>
//                           setSelectedImage((prev) =>
//                             prev === 0 ? productImages.length - 1 : prev - 1
//                           )
//                         }
//                         className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 shadow-md hover:bg-white transition"
//                       >
//                         <ChevronLeft className="w-5 h-5 text-stone-700" />
//                       </button>
//                       <button
//                         onClick={() =>
//                           setSelectedImage((prev) =>
//                             prev === productImages.length - 1 ? 0 : prev + 1
//                           )
//                         }
//                         className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 shadow-md hover:bg-white transition"
//                       >
//                         <ChevronRight className="w-5 h-5 text-stone-700" />
//                       </button>
//                     </>
//                   )}
//                   <div className="absolute top-4 left-4 flex flex-col gap-2">
//                     {discount > 0 && (
//                       <span className="bg-stone-800 text-white text-xs font-bold px-3 py-1.5 shadow-lg">
//                         {discount}% OFF
//                       </span>
//                     )}
//                     {isLowStock && (
//                       <span className="bg-stone-700 text-white text-xs font-bold px-3 py-1.5 shadow-lg flex items-center gap-1">
//                         <Zap className="w-3 h-3 fill-white" />
//                         Only {product.stockLeft} left
//                       </span>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => toggleWishlist(product)}
//                     className={`absolute top-4 right-4 p-2.5 shadow-md transition-all hover:scale-110 ${
//                       isInWishlist ? "bg-primary text-white" : "bg-white text-stone-600"
//                     }`}
//                   >
//                     <Heart className={`w-5 h-5 ${isInWishlist ? "fill-white" : ""}`} />
//                   </button>
//                   <div className="absolute bottom-4 right-4 bg-white/90 text-xs font-medium text-stone-600 px-3 py-1.5 rounded-full shadow">
//                     {selectedImage + 1} / {productImages.length}
//                   </div>
//                 </div>
//               </div>
//               {productImages.length > 1 && (
//                 <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
//                   {productImages.map((img, idx) => (
//                     <button
//                       key={idx}
//                       onClick={() => setSelectedImage(idx)}
//                       className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
//                         selectedImage === idx
//                           ? "border-primary"
//                           : "border-stone-200 opacity-70 hover:opacity-100"
//                       }`}
//                     >
//                       <img src={img} alt="" className="w-full h-full object-cover" />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="lg:col-span-5">
//             <span className="text-xs text-primary font-bold uppercase tracking-wider">
//               Premium Collection
//             </span>
//             <h1 className="font-heading text-3xl md:text-4xl text-stone-800 mt-1 mb-3">
//               {product.name}
//             </h1>
//             <div className="flex items-center gap-3 mb-4">
//               <div className="flex items-center gap-1">
//                 <span className="text-sm font-bold text-stone-800">{product.rating}</span>
//                 <div className="flex">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`w-4 h-4 ${
//                         i < Math.floor(product.rating)
//                           ? "fill-yellow-500 text-yellow-500"
//                           : "text-stone-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <span className="text-xs text-stone-400">({product.reviews} reviews)</span>
//               <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
//               <span className="text-xs text-stone-600 flex items-center gap-1">
//                 <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
//                 In Stock
//               </span>
//             </div>
//             <div className="mb-6 pb-4 border-b border-stone-200">
//               <div className="flex items-end gap-3">
//                 <span className="font-heading text-3xl text-stone-800">
//                   ₹{product.price.toLocaleString("en-IN")}
//                 </span>
//                 {originalPrice > product.price && (
//                   <>
//                     <span className="text-lg text-stone-400 line-through mb-1">
//                       ₹{originalPrice.toLocaleString("en-IN")}
//                     </span>
//                     <span className="text-sm text-primary font-bold bg-primary/10 px-2 py-0.5">
//                       Save {discount}%
//                     </span>
//                   </>
//                 )}
//               </div>
//               <p className="text-xs text-stone-400 mt-2">Inclusive of all taxes • Free shipping</p>
//             </div>

//             {product.colors && (
//               <div className="mb-6">
//                 <p className="text-sm font-medium text-stone-700 mb-2">Color:</p>
//                 <div className="flex gap-3">
//                   {product.colors.map((color, idx) => (
//                     <button
//                       key={idx}
//                       onClick={() => setSelectedColor(color)}
//                       className={`w-12 h-12 rounded-full border-2 transition-all ${
//                         selectedColor === color
//                           ? "border-primary scale-110"
//                           : "border-stone-200 hover:scale-105"
//                       }`}
//                       style={{ backgroundColor: color }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="mb-6">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-sm font-medium text-stone-700">Size</p>
//                 <button className="text-xs text-primary hover:underline flex items-center gap-1">
//                   <Maximize2 className="w-3 h-3" />
//                   Size Guide
//                 </button>
//               </div>
//               <div className="grid grid-cols-6 gap-2">
//                 {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
//                   <button
//                     key={size}
//                     onClick={() => setSelectedSize(size)}
//                     className={`py-2.5 border font-medium text-sm transition-all ${
//                       selectedSize === size
//                         ? "border-primary bg-primary/5 text-primary"
//                         : "border-stone-200 text-stone-600 hover:border-primary/50"
//                     }`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-6">
//               <p className="text-sm font-medium text-stone-700 mb-3">Quantity</p>
//               <div className="flex items-center border border-stone-200 w-32 bg-white">
//                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3">
//                   <Minus className="w-4 h-4" />
//                 </button>
//                 <input
//                   type="text"
//                   value={quantity}
//                   readOnly
//                   className="w-full text-center font-medium text-stone-800 bg-transparent outline-none"
//                 />
//                 <button onClick={() => setQuantity(quantity + 1)} className="p-3">
//                   <Plus className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3 mb-8">
//               <button
//                 onClick={() => handleAddToCart()}
//                 className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
//                   addedToCart
//                     ? "bg-green-500 text-white"
//                     : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
//                 }`}
//               >
//                 {addedToCart ? (
//                   <>
//                     <CheckCircle2 className="w-5 h-5" />
//                     Added
//                   </>
//                 ) : (
//                   <>
//                     <ShoppingCart className="w-5 h-5" />
//                     Add to Cart
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={handleBuyNow}
//                 className="flex-1 bg-stone-800 text-white py-4 font-bold text-sm uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2"
//               >
//                 <Zap className="w-5 h-5" />
//                 Buy Now
//               </button>
//             </div>

//             <div className="border border-stone-200 overflow-hidden bg-white">
//               <ExpandableSection title="Product Details" icon={Info} defaultOpen={true}>
//                 <p className="text-sm text-stone-600 mb-4">{product.desc}</p>
//                 <ProductDetails product={product} />
//               </ExpandableSection>
//               <ExpandableSection title="Size Guide" icon={Ruler}>
//                 <SizeGuide />
//               </ExpandableSection>
//               <ExpandableSection title="Fabric & Care" icon={Droplet}>
//                 <FabricCare />
//               </ExpandableSection>
//               <ExpandableSection title="Delivery & Returns" icon={Truck}>
//                 <DeliveryReturns />
//               </ExpandableSection>
//             </div>

//             <div className="mt-6 pt-4 border-t border-stone-200">
//               <button className="flex items-center gap-2 text-sm text-stone-500 hover:text-primary transition">
//                 <Share2 className="w-4 h-4" />
//                 Share this product
//               </button>
//             </div>
//           </div>
//         </div>

//         {similarProducts.length > 0 && (
//           <div className="mt-12">
//             <h2 className="text-xl md:text-2xl font-semibold mb-6">Similar Products</h2>
//             <div className="flex gap-4 overflow-x-auto scrollbar-hide">
//               {similarProducts.map((item) => (
//                 <Link
//                   key={item.id}
//                   to={`/product/${item.slug}`}
//                   className="min-w-[220px] bg-white border border-stone-100 block hover:shadow-lg transition-shadow"
//                 >
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-full h-[280px] object-cover"
//                   />
//                   <div className="p-3">
//                     <p className="text-sm text-black line-clamp-2">{item.name}</p>
//                     <p className="text-sm font-semibold mt-1">
//                       ₹{item.price.toLocaleString()}
//                     </p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )}

//         {recentlyViewed.length > 1 && (
//           <div className="mt-12 border-t border-stone-200 pt-8">
//             <div className="flex items-center justify-between mb-5">
//               <div>
//                 <span className="text-xs text-gray-400 uppercase tracking-widest">History</span>
//                 <h3 className="text-xl font-semibold text-black">Recently Viewed</h3>
//               </div>
//               <button
//                 onClick={() => {
//                   setRecentlyViewed([]);
//                   localStorage.removeItem("llmshop_recently_viewed");
//                 }}
//                 className="text-xs text-gray-400 hover:text-red-500"
//               >
//                 Clear
//               </button>
//             </div>
//             <div className="flex gap-4 overflow-x-auto scrollbar-hide">
//               {recentlyViewed
//                 .filter((p) => p.slug !== product.slug)
//                 .slice(0, 6)
//                 .map((p) => (
//                   <div key={p.id} className="min-w-[200px] flex-shrink-0">
//                     <Link to={`/product/${p.slug || p.id}`}>
//                       <img
//                         src={p.images?.[0] || p.image}
//                         alt={p.name}
//                         className="w-full h-[260px] object-cover"
//                       />
//                     </Link>
//                     <Link to={`/product/${p.slug || p.id}`}>
//                       <p className="text-sm text-black mt-2 line-clamp-2 hover:text-primary transition">
//                         {p.name}
//                       </p>
//                     </Link>
//                     <p className="text-sm font-semibold">₹{p.price.toLocaleString()}</p>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`,
//         }}
//       />
//     </div>
//   );
// };

// export default ProductDetail;
