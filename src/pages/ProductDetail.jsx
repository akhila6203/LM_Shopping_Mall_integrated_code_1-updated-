import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
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
  // Maximize2,
  Shield,
  Share2,
  Ruler,
} from "lucide-react";
import { useShop } from "../ShopContext.jsx";
import { useProtectedActions } from "@/hooks/useProtectedActions";

import {
  recordRecentlyViewed,
  getRecentlyViewedProducts,
  clearRecentlyViewedProducts,
} from "@/services/recentlyViewedService";
import {
  getProductBySlug,
  getProductById,
  getProducts,
} from "@/services/productService";
// import { getProductBySlug, getProducts } from "@/services/productService";
import { getImageUrl } from "@/api/axiosClient";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

// let recentViewedMemory = [];

const safeJsonParse = (value, fallback = []) => {
  try {
    if (!value) return fallback;
    if (typeof value === "object") return value;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const getOptionValue = (variant, key) => {
  const options = safeJsonParse(variant?.option_values, []);
  const found = options.find(
    (opt) => String(opt.name || "").toLowerCase() === key.toLowerCase()
  );
  return found?.value || variant?.[key] || "";
};

const unique = (arr) => [...new Set(arr.filter(Boolean).map((v) => String(v).trim()))];

const resolveImageUrl = (img) => {
  if (!img) return "";
  if (typeof img === "string") return getImageUrl(img);
  return getImageUrl(img.image || img.image_url || img.url || img.path || "");
};

const normalizeVariantImages = (variant) => {
  const imgs = [];

  if (Array.isArray(variant?.images)) {
    variant.images.forEach((img) => {
      const url = resolveImageUrl(img);
      if (url) imgs.push(url);
    });
  }

  if (Array.isArray(variant?.variant_images)) {
    variant.variant_images.forEach((img) => {
      const url = resolveImageUrl(img);
      if (url) imgs.push(url);
    });
  }

  if (variant?.image) {
    const url = resolveImageUrl(variant.image);
    if (url) imgs.push(url);
  }

  return unique(imgs);
};


const normalizeSaleMode = (
  value
) => {
  const mode =
    String(
      value || "piece"
    )
      .trim()
      .toLowerCase();

  return [
    "piece",
    "size",
    "meter",
  ].includes(mode)
    ? mode
    : "piece";
};

const roundQuantity = (
  value
) =>
  Math.round(
    (
      Number(value || 0) +
      Number.EPSILON
    ) * 100
  ) / 100;

const groupVariantsByColor = (product) => {
  const variants = product?.variants || product?.product_variants || [];
  const groupsMap = {};

  variants.forEach((variant) => {
    const color = getOptionValue(variant, "color") || variant.color || "Default";
    if (!groupsMap[color]) {
      groupsMap[color] = {
        color,
        variants: [],
        images: [],
        sizes: [],
        sizeSet: new Set(),
      };
    }

    const group = groupsMap[color];
    group.variants.push(variant);
    normalizeVariantImages(variant).forEach((img) => group.images.push(img));

    const size = getOptionValue(variant, "size") || variant.size;
    if (size && !group.sizeSet.has(size)) {
      group.sizeSet.add(size);
      group.sizes.push(size);
    }
  });

  return Object.values(groupsMap)
    .map((g) => ({
      color: g.color,
      variants: g.variants,
      images: unique(g.images),
      sizes: g.sizes,
      fabric: g.variants[0]?.fabric || product?.fabric || "",
      material:
        g.variants[0]?.material ||
        product?.material ||
        product?.material_name ||
        product?.product_type ||
        "",
      brand: product?.brand || product?.brand_name || "",
      price: Number(
        g.variants[0]?.offer_price ||
          g.variants[0]?.price ||
          product?.offer_price ||
          product?.price ||
          0
      ),
      stock: g.variants.reduce((sum, v) => sum + Number(v.stock || 0), 0),
    }))
    .filter((g) => g.images.length > 0);
};

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
            <td className="py-2 px-3 text-stone-500">{["32", "34", "36", "38", "40", "42"][idx]}</td>
            <td className="py-2 px-3 text-stone-500">{["26", "28", "30", "32", "34", "36"][idx]}</td>
            <td className="py-2 px-3 text-stone-500">{["34", "36", "38", "40", "42", "44"][idx]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ProductDetailsInfo = ({ product }) => (
  <div className="space-y-3">
    {[
      { label: "Fabric", value: product.fabric || "-" },
      { label: "Brand", value: product.brand || "-" },
      { label: "Material", value: product.material || product.product_type || product.fabric || "-" },
      { label: "Color", value: product.colorText || "-" },
    ].map((item, idx) => (
      <div key={idx} className="flex justify-between items-center pb-2 border-b border-stone-100">
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
  // const { slug } = useParams();
  const {
  slug,
  productId,
} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
const cartSelection = location.state || {};

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [colorGroups, setColorGroups] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedColorGroup, setSelectedColorGroup] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [
  recentlyViewedLoading,
  setRecentlyViewedLoading,
] = useState(false);
  const [loading, setLoading] = useState(false);

  const { wishlist = [], cart = [], fetchCart } = useShop();
  const { handleAddToCart: protectedAddToCart, handleBuyNow: protectedBuyNow, handleToggleWishlist: protectedToggleWishlist } = useProtectedActions();

  

  
  const normalizeImage = (img) => {
    if (!img) return FALLBACK_IMAGE;
    if (typeof img === "string") return getImageUrl(img);
    return getImageUrl(img.image || img.url || img.path || img.thumbnail || "");
  };

  const getProductBaseImages = (data) => {
    const imgs = [];

    if (Array.isArray(data.images) && data.images.length > 0) {
      data.images.forEach((img) => imgs.push(normalizeImage(img)));
    }

    if (data.thumbnail) imgs.unshift(getImageUrl(data.thumbnail));

    return unique(imgs).length ? unique(imgs) : [FALLBACK_IMAGE];
  };

  const handleToggleWishlist = async () => {
    await protectedToggleWishlist({
      id: product.id,
      product_id: product.id,
    });
  };

  const normalizeProduct = (data) => {
    const baseImages = getProductBaseImages(data);
    const variants = Array.isArray(data.variants)
      ? data.variants
      : Array.isArray(data.product_variants)
      ? data.product_variants
      : [];

    const colors = unique(
      variants.map((variant) => getOptionValue(variant, "color") || variant.color)
    );

    const sizes = unique(
      variants.map((variant) => getOptionValue(variant, "size") || variant.size)
    );

    const price = Number(data.offer_price || data.price || 0);
    const oldPrice = Number(data.price || data.offer_price || 0);

    return {
      ...data,
      variants,
      images: baseImages,
      image: baseImages[0],
      price,
      oldPrice,
      originalPrice: oldPrice,
      stockLeft: Number(data.stock || 0),
      rating: Number(data.avg_rating || data.rating || 4.5),
      reviews: Number(data.review_count || data.reviews || 0),
      desc: data.short_description || data.long_description || data.description || "",
      fabric: data.fabric || "",
      brand: data.brand || data.brand_name || "",
      material: data.material || data.material_name || data.product_type || "",
      sizes,
      colors,
      colorText: colors[0] || data.color || data.color_name || "",
      categoryText:
        data.child_category_name || data.sub_category_name || data.category_name || "",
      collectionText:
        data.child_category_name ||
        data.sub_category_name ||
        data.category_name ||
        "Premium Collection",

        sale_mode:
  normalizeSaleMode(
    data.sale_mode
  ),

unit_name:
  data.unit_name ||
  (
    data.sale_mode === "meter"
      ? "meter"
      : "piece"
  ),

minimum_quantity:
  Number(
    data.minimum_quantity ||
      1
  ),

quantity_step:
  Number(
    data.quantity_step ||
      (
        data.sale_mode ===
        "meter"
          ? 0.5
          : 1
      )
  ),
    };
  };


  const loadRecentlyViewed = async (currentProductId) => {
  try {
    setRecentlyViewedLoading(true);

    const rows = await getRecentlyViewedProducts({
      limit: 8,
      excludeProductId: currentProductId,
    });

    console.log(
      "RECENTLY VIEWED API DATA:",
      rows
    );

    const normalizedRows = (Array.isArray(rows) ? rows : [])
      .filter(
        (item) =>
          item?.id &&
          item?.slug &&
          Number(item.id) !== Number(currentProductId)
      )
      .map(normalizeProduct);

    setRecentlyViewed(normalizedRows);
  } catch (error) {
    console.error(
      "Recently viewed fetch error:",
      error?.response?.data || error
    );

    setRecentlyViewed([]);
  } finally {
    setRecentlyViewedLoading(false);
  }
};

  const productImages = selectedColorGroup?.images || [];


  const saleMode =
  product?.sale_mode ||
  "piece";

const isMeterProduct =
  saleMode === "meter";

const availableSizes =
  selectedColorGroup?.sizes?.length
    ? selectedColorGroup.sizes
    : Array.isArray(
        product?.sizes
      )
    ? product.sizes.filter(
        Boolean
      )
    : [];

const hasSizes =
  saleMode === "size" &&
  availableSizes.length > 0;

const minimumQuantity =
  isMeterProduct
    ? Number(
        product?.minimum_quantity ||
        1
      )
    : 1;

const quantityStep =
  isMeterProduct
    ? Number(
        product?.quantity_step ||
        0.5
      )
    : 1;


  const findVariantForColorSize = (group, size) => {
    if (!group) return null;
    return (
      group.variants.find((variant) => {
        const vSize = getOptionValue(variant, "size") || variant.size;
        return vSize === size;
      }) ||
      group.variants[0] ||
      null
    );
  };

  const selectColor = (group) => {
    if (!group) return;
    const firstSize = group.sizes[0] || "";
    setSelectedColor(group.color);
    setSelectedColorGroup(group);
    setSelectedSize(firstSize);
    setCurrentImageIndex(0);
    setSelectedVariant(findVariantForColorSize(group, firstSize));
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setSelectedVariant(findVariantForColorSize(selectedColorGroup, size));
  };


useEffect(() => {
  let cancelled = false;

  const loadProduct = async () => {
    try {
      setLoading(true);

      setProduct(null);
      setSimilarProducts([]);
      setColorGroups([]);
      setSelectedColor("");
      setSelectedColorGroup(null);
      setSelectedSize("");
      setSelectedVariant(null);
      setCurrentImageIndex(0);
      setAddedToCart(false);
      setShowToast(null);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      // const data =
      //   await getProductBySlug(slug);
      const data = productId
  ? await getProductById(
      productId
    )
  : await getProductBySlug(
      decodeURIComponent(
        String(slug || "").trim()
      )
    );

      if (cancelled) return;

      if (!data) {
        setProduct(null);
        return;
      }

      const normalized =
        normalizeProduct(data);

      setProduct(normalized);

      const groups =
        groupVariantsByColor(data);

      setColorGroups(groups);

      if (groups.length > 0) {
        const targetGroup =
          groups.find(
            (group) =>
              String(group.color) ===
              String(
                cartSelection.selectedColor
              )
          ) || groups[0];

        let targetSize =
          cartSelection.selectedSize ||
          targetGroup.sizes[0] ||
          "";

        const targetVariant =
          targetGroup.variants.find(
            (variant) =>
              String(variant.id) ===
              String(
                cartSelection.selectedVariantId
              )
          ) ||
          findVariantForColorSize(
            targetGroup,
            targetSize
          );

        if (targetVariant) {
          targetSize =
            getOptionValue(
              targetVariant,
              "size"
            ) ||
            targetVariant.size ||
            targetSize;
        }

        setSelectedColor(
          targetGroup.color
        );

        setSelectedColorGroup(
          targetGroup
        );

        setSelectedSize(
          targetSize
        );

        setSelectedVariant(
          targetVariant
        );
      }

      setCurrentImageIndex(0);
      setQuantity(1);
      setAddedToCart(false);

     try {
  const recorded = await recordRecentlyViewed(
    normalized.id
  );

  console.log(
    "RECENT PRODUCT RECORDED:",
    recorded,
    normalized.id
  );
} catch (recentError) {
  console.error(
    "Record recently viewed error:",
    recentError?.response?.data ||
      recentError
  );
}


if (!cancelled) {
  await loadRecentlyViewed(
    normalized.id
  );
}


      const similarParams = {
        status: "active",
        page: 1,
        limit: 50,
        sort: "created_at",
        order: "DESC",
        _t: Date.now(),
      };

      if (data.child_category_id) {
        similarParams.child_category_id =
          data.child_category_id;
      } else if (
        data.sub_category_id
      ) {
        similarParams.sub_category_id =
          data.sub_category_id;
      } else if (
        data.category_id
      ) {
        similarParams.category_id =
          data.category_id;
      }

      const related =
        await getProducts(
          similarParams
        );

      if (cancelled) return;


      const relatedProducts = Array.isArray(related)
  ? related
  : Array.isArray(related?.data)
  ? related.data
  : [];

const latestRelatedProducts = relatedProducts
  .filter(
    (item) =>
      item?.slug &&
      Number(item.id) !== Number(data.id)
  )
  .sort((a, b) => {
    const aDate = new Date(
      a.created_at || a.updated_at || 0
    ).getTime();

    const bDate = new Date(
      b.created_at || b.updated_at || 0
    ).getTime();

    if (bDate !== aDate) {
      return bDate - aDate;
    }

    return Number(b.id || 0) - Number(a.id || 0);
  })
  .slice(0, 8)
  .map(normalizeProduct);

setSimilarProducts(latestRelatedProducts);
    } catch (error) {
      if (!cancelled) {
        console.error(
          "Product details fetch error:",
          error
        );

        setProduct(null);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  loadProduct();

  return () => {
    cancelled = true;
  };
  }, [slug, productId]);
// }, [slug]);

useEffect(() => {
  fetchCart();
}, [fetchCart]);


  useEffect(() => {
  if (!product) return;

  const initialQuantity =
    product.sale_mode ===
    "meter"
      ? Number(
          product.minimum_quantity ||
            1
        )
      : 1;

  setQuantity(
    initialQuantity
  );
}, [
  product?.id,
  product?.sale_mode,
  product?.minimum_quantity,
]);

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




const roundQuantity = (
  value
) =>
  Math.round(
    (
      Number(value || 0) +
      Number.EPSILON
    ) * 100
  ) / 100;

const decreaseQuantity = () => {
  setQuantity((current) =>
    Math.max(
      minimumQuantity,
      roundQuantity(
        Number(current) -
        quantityStep
      )
    )
  );
};

const increaseQuantity = () => {
  setQuantity((current) => {
    const next =
      roundQuantity(
        Number(current) +
        quantityStep
      );

    return next <=
      Number(
        selectedVariant?.stock ||
        selectedColorGroup?.stock ||
        product?.stock ||
        0
      )
      ? next
      : Number(current);
  });
};

  const currentPrice = Number(
    selectedVariant?.offer_price ||
      selectedVariant?.price ||
      product.offer_price ||
      product.price ||
      0
  );

  const originalPrice = Number(selectedVariant?.price || product.oldPrice || product.originalPrice || 0);

  const discount =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const currentFabric =
    selectedColorGroup?.fabric ||
    getOptionValue(selectedVariant, "fabric") ||
    selectedVariant?.fabric ||
    product.fabric ||
    "";

  const currentMaterial =
    selectedColorGroup?.material ||
    product.material ||
    product.product_type ||
    currentFabric ||
    "";

  const currentStock = Number(selectedVariant?.stock ?? product.stockLeft ?? 0);
  const isLowStock = currentStock <= 3 && currentStock > 0;

  const categoryLabel = product.categoryText || "Products";
  const categoryLink = product.sub_category_id
    ? `/products/subcategory/${product.sub_category_id}`
    : product.category_id
    ? `/shop?category_id=${product.category_id}`
    : "/shop";

    const isInWishlist = wishlist.some(
  (item) => Number(item.product_id || item.id) === Number(product.id)
);
  // const isInWishlist = wishlist.some((item) => Number(item.id) === Number(product.id));

  const isInCart =
    addedToCart ||
    cart.some(
      (item) =>
        Number(item.product_id || item.id) === Number(product.id) &&
        Number(item.variant_id || 0) === Number(selectedVariant?.id || 0)
    );

  const productForDetails = {
    ...product,
    price: currentPrice,
    oldPrice: originalPrice,
    fabric: currentFabric,
    material: currentMaterial,
    colorText: selectedColor,
  };

  const handleAddToCart = async () => {
    if (
  saleMode === "size" &&
  hasSizes &&
  !selectedSize
) {
  setShowToast(
    "Please select a size"
  );

  setTimeout(
    () =>
      setShowToast(null),
    2000
  );

  return false;
}

    if (isInCart) {
      navigate("/cart");
      return true;
    }

    const qty =
  isMeterProduct
    ? roundQuantity(
        Number(quantity) ||
          minimumQuantity
      )
    : Math.max(
        1,
        Math.floor(
          Number(quantity) || 1
        )
      );

const productPayload = {
  product_id:
    product.id,

  variant_id:
    selectedVariant?.id ||
    null,

  quantity:
    qty,

  selected_size:
    saleMode === "size"
      ? selectedSize
      : "",

  selected_color:
    selectedColor ||
    "",

  item_price: Number(
    selectedVariant?.offer_price ||
      selectedVariant?.price ||
      selectedColorGroup?.price ||
      product.offer_price ||
      product.price ||
      0
  ),

  sale_mode:
    saleMode,

  unit_name:
    product.unit_name ||
    (
      isMeterProduct
        ? "meter"
        : "piece"
    ),

  minimum_quantity:
    minimumQuantity,

  quantity_step:
    quantityStep,

  item_data: {
    image:
      productImages[
        currentImageIndex
      ] ||
      productImages[0] ||
      "",

    name:
      product.name,

    slug:
      product.slug,

    brand:
      product.brand,

    fabric:
      currentFabric,

    material:
      currentMaterial,

    gst_percent:
      Number(
        product.gst_percent ||
          0
      ),

    sale_mode:
      saleMode,

    unit_name:
      product.unit_name ||
      (
        isMeterProduct
          ? "meter"
          : "piece"
      ),

    minimum_quantity:
      minimumQuantity,

    quantity_step:
      quantityStep,

    sizes:
      availableSizes ||
      [],

    colors:
      colorGroups.map(
        (group) =>
          group.color
      ),

    variants:
      product.variants.map(
        (variant) => ({
          id:
            variant.id,

          size:
            getOptionValue(
              variant,
              "size"
            ) ||
            variant.size ||
            "",

          color:
            getOptionValue(
              variant,
              "color"
            ) ||
            variant.color ||
            "",

          stock:
            Number(
              variant.stock ||
                0
            ),

          price:
            Number(
              variant.price ||
                0
            ),

          offer_price:
            Number(
              variant.offer_price ||
                variant.price ||
                0
            ),
        })
      ),
  },
};

    const success = await protectedAddToCart(productPayload);

    if (success) {
      setAddedToCart(true);
      setShowToast(
  isMeterProduct
    ? `${qty} ${
        product.unit_name ||
        "meter"
      } added to cart!`
    : `${qty} item(s) added to cart!`
);
      // setShowToast(`${qty} item(s) added to cart!`);
      setTimeout(() => setShowToast(null), 2000);
    }

    return success;
  };

  const handleBuyNow = async () => {
    if (isInCart) {
      navigate("/cart");
      return;
    }

    const qty = Number(quantity) || 1;
    const productPayload = {
      product_id: product.id,
      variant_id: selectedVariant?.id || null,
      quantity: qty,
      selected_size: selectedSize || "Free Size",
      selected_color: selectedColor || "",
      item_price: Number(
        selectedVariant?.offer_price ||
          selectedVariant?.price ||
          selectedColorGroup?.price ||
          product.offer_price ||
          product.price ||
          0
      ),
      item_data: {
  image:
    productImages[currentImageIndex] ||
    productImages[0] ||
    "",
  name: product.name,
  slug: product.slug,
  brand: product.brand,
  fabric: currentFabric,
  material: currentMaterial,

  gst_percent: Number(
  product.gst_percent || 0
),

  sizes: availableSizes?.length ? availableSizes : [selectedSize || "Free Size"],
  colors: colorGroups.map((g) => g.color),
  variants: product.variants.map((v) => ({
    id: v.id,
    size: getOptionValue(v, "size") || v.size,
    color: getOptionValue(v, "color") || v.color,
    price: Number(v.price || 0),
    offer_price: Number(v.offer_price || v.price || 0),
  })),
},
    };

    await protectedBuyNow(productPayload);
  };

  
const MiniCard = ({ item }) => {
  const itemId = Number(
    item?.product_id ||
      item?.id
  );

  if (
    !Number.isInteger(itemId) ||
    itemId <= 0
  ) {
    return null;
  }

  return (
    <Link
      to={`/product/id/${itemId}`}
      className="min-w-[220px] flex-shrink-0 bg-white border border-stone-100 block text-left hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });
      }}
    >
      <img
        src={
          item.image ||
          FALLBACK_IMAGE
        }
        alt={
          item.name ||
          "Product"
        }
        className="w-full h-[280px] object-cover"
        onError={(event) => {
          event.currentTarget.src =
            FALLBACK_IMAGE;
        }}
      />

      <div className="p-3">
        <p className="text-xs text-stone-400 uppercase tracking-wider line-clamp-1">
          {item.colorText ||
            item.categoryText ||
            ""}
        </p>

        <p className="text-sm text-black line-clamp-2">
          {item.name}
        </p>

        <p className="text-sm font-semibold mt-1">
          ₹
          {Number(
            item.price || 0
          ).toLocaleString(
            "en-IN"
          )}
        </p>
      </div>
    </Link>
  );
};


  const handleShareProduct = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this product: ${product.name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowToast("Product link copied to clipboard!");
        setTimeout(() => setShowToast(null), 2000);
      }
    } catch (err) {
      console.log("Share cancelled", err);
    }
  };


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
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={categoryLink} className="hover:text-primary transition">{categoryLabel}</Link>
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
                  {productImages.length > 0 ? (
                  <img
                    src={productImages[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-contain transition-all duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  ) : (
                    <p className="text-sm text-stone-400">No variant image</p>
                  )}

                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === 0 ? productImages.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 shadow-md hover:bg-white transition"
                      >
                        <ChevronLeft className="w-5 h-5 text-stone-700" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
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
                        Only {currentStock} left
                      </span>
                    )}
                  </div>

                  <button
                   onClick={handleToggleWishlist}
                    className={`absolute top-4 right-4 p-2.5 shadow-md transition-all hover:scale-110 ${
                      isInWishlist ? "bg-primary text-white" : "bg-white text-stone-600"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? "fill-white" : ""}`} />
                  </button>

                  <div className="absolute bottom-4 right-4 bg-white/90 text-xs font-medium text-stone-600 px-3 py-1.5 rounded-full shadow">
                    {productImages.length > 0
                      ? `${currentImageIndex + 1} / ${productImages.length}`
                      : "0 / 0"}
                  </div>
                </div>
              </div>

              {colorGroups.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {colorGroups.map((group) => (
                    <button
                      key={group.color}
                      type="button"
                      onClick={() => selectColor(group)}
                      className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedColor === group.color
                          ? "border-primary"
                          : "border-stone-200 opacity-70 hover:opacity-100"
                      }`}
                      title={group.color}
                    >
                      <img
                        src={group.images[0]}
                        alt={group.color}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </button>
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
                  ₹{currentPrice.toLocaleString("en-IN")}
                </span>
                {originalPrice > currentPrice && (
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
              {Number(product.gst_percent || 0) > 0 && (
                <p className="text-xs text-stone-400 mt-2">
                  Inclusive of {Number(
                    product.gst_percent
                  )}% GST
                </p>
              )}
              {/* <p className="text-xs text-stone-400 mt-2">Inclusive of all taxes • Free shipping</p> */}
            </div>

            {colorGroups.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-stone-700 mb-2">
                  Color: <span className="text-stone-900">{selectedColor}</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {colorGroups.map((group) => (
                    <button
                      key={group.color}
                      onClick={() => selectColor(group)}
                      className={`px-4 py-2 border text-sm transition-all ${
                        selectedColor === group.color
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-stone-200 text-stone-600 hover:border-primary/50"
                      }`}
                    >
                      {group.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-stone-700">Size</p>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
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
              </div>
            )}

            <div className="mb-6">
              <p className="text-sm font-medium text-stone-700 mb-3">
                {isMeterProduct
                  ? `Length (${
                      product.unit_name ||
                      "meter"
                    })`
                  : "Quantity"}
              </p>
              {/* <p className="text-sm font-medium text-stone-700 mb-3">Quantity</p> */}
              <div className="flex items-center border border-stone-200 w-32 bg-white">
                <button
                    onClick={
                      decreaseQuantity
                    }
                  // onClick={() => setQuantity((q) => Math.max(1, Number(q) - 1))}
                  className="p-3"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
  type="number"
  value={quantity}
  min={minimumQuantity}
  step={quantityStep}
  onChange={(event) => {
    const value =
      Number(
        event.target.value
      );

    if (
      !Number.isFinite(value)
    ) {
      return;
    }

    setQuantity(
      isMeterProduct
        ? roundQuantity(
            value
          )
        : Math.max(
            1,
            Math.floor(value)
          )
    );
  }}
  className="w-full text-center font-medium text-stone-800 bg-transparent outline-none"
/>
               
                <button
                    onClick={
                      increaseQuantity
                    }
                  // onClick={() => setQuantity((q) => Number(q) + 1)}
                  className="p-3"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isInCart
                    ? "bg-green-500 text-white"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {isInCart ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Go to Cart
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
                <ProductDetailsInfo product={productForDetails} />
              </ExpandableSection>

              <ExpandableSection title="Size Guide" icon={Ruler}>
                <SizeGuide />
              </ExpandableSection>

              <ExpandableSection title="Delivery & Returns" icon={Truck}>
                <DeliveryReturns />
              </ExpandableSection>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200">
              <button
                  onClick={handleShareProduct}
                  className="flex items-center gap-2 text-sm text-stone-500 hover:text-primary transition"
                >
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

{recentlyViewedLoading ? (
  <div className="mt-12 border-t border-stone-200 pt-8">
    <div className="flex items-center justify-between mb-5">
      <div>
        <span className="text-xs text-gray-400 uppercase tracking-widest">
          History
        </span>

        <h3 className="text-xl font-semibold text-black">
          Recently Viewed
        </h3>
      </div>
    </div>

    <p className="text-sm text-stone-400">
      Loading history...
    </p>
  </div>
) : recentlyViewed.length > 0 ? (
  <div className="mt-12 border-t border-stone-200 pt-8">
    <div className="flex items-center justify-between mb-5">
      <div>
        <span className="text-xs text-gray-400 uppercase tracking-widest">
          History
        </span>

        <h3 className="text-xl font-semibold text-black">
          Recently Viewed
        </h3>
      </div>

      <button
        type="button"
        onClick={async () => {
          try {
            const cleared =
              await clearRecentlyViewedProducts();

            if (!cleared) {
              throw new Error(
                "Unable to clear recently viewed history"
              );
            }

            setRecentlyViewed([]);

            setShowToast(
              "Recently viewed history cleared"
            );

            setTimeout(() => {
              setShowToast(null);
            }, 2000);
          } catch (error) {
            console.error(
              "Clear recently viewed error:",
              error?.response?.data ||
                error
            );

            setShowToast(
              "Unable to clear history"
            );

            setTimeout(() => {
              setShowToast(null);
            }, 2000);
          }
        }}
        className="text-xs text-gray-400 hover:text-red-500 transition"
      >
        Clear
      </button>
    </div>

    <div className="flex gap-4 overflow-x-auto scrollbar-hide">
      {recentlyViewed
        .slice(0, 8)
        .map((item) => (
          <MiniCard
            key={item.id}
            item={item}
          />
        ))}
    </div>
  </div>
) : null}
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




