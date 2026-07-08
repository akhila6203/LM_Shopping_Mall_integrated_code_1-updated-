import { ShoppingCart, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { useShop } from "../ShopContext.jsx";
import { useProtectedActions } from "@/hooks/useProtectedActions";
// import { getProducts } from "@/services/productService";
import { getImageUrl } from "@/api/axiosClient";
import { extractProductSizes } from "@/utils/productHelpers";
import { getProducts, getProductBySlug } from "@/services/productService";

const ProductCard = ({ product, index, isVisible }) => {
  const { wishlist } = useShop();
  const { handleAddToCart, handleToggleWishlist } = useProtectedActions();

  if (!product.slug) return null;

  const image =
    product.thumbnail
      ? getImageUrl(product.thumbnail)
      : product.images?.[0]?.image
      ? getImageUrl(product.images[0].image)
      : "";

  const price = Number(product.offer_price || product.price || 0);
  const originalPrice = Number(product.price || price || 0);
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const discount =
    originalPrice > price && price > 0
      ? Math.round((1 - price / originalPrice) * 100)
      : 0;

  const tag =
    product.is_best_seller
      ? "Bestseller"
      : product.is_new_arrival
      ? "New"
      : product.is_trending
      ? "Trending"
      : product.is_featured
      ? "Featured"
      : null;

      const handleAddToCartClick = async (e) => {
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

  const sizes = [
    ...new Set(
      variants
        .map((v) => v.size)
        .filter(Boolean)
    ),
  ];

  const colors = [
    ...new Set(
      variants
        .map((v) => v.color)
        .filter(Boolean)
    ),
  ];

  const firstVariant = variants[0] || null;
  const firstSize = sizes[0] || firstVariant?.size || "Free Size";

  await handleAddToCart({
    product_id: fullProduct.id || product.id,
    variant_id: firstVariant?.id || null,
    quantity: 1,
    selected_size: firstSize,
    selected_color: firstVariant?.color || fullProduct.color || "",
    item_price: Number(
      firstVariant?.offer_price ||
        firstVariant?.price ||
        fullProduct.offer_price ||
        fullProduct.price ||
        product.offer_price ||
        product.price ||
        0
    ),
    item_data: {
      image,
      slug: fullProduct.slug || product.slug,
      name: fullProduct.name || product.name,
      brand: fullProduct.brand || "",
      fabric: fullProduct.fabric || "",
      material: fullProduct.material || "",
      sizes: sizes.length ? sizes : [firstSize],
      colors,
    },
  });
};
  // const handleAddToCartClick = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   const sizes = extractProductSizes(product);

  //   await handleAddToCart({
  //     product_id: product.id,
  //     variant_id: null,
  //     quantity: 1,
  //     selected_size: sizes[0] || "Free Size",
  //     selected_color: product.color || "",
  //     item_price: Number(product.offer_price || product.price || 0),
  //     item_data: {
  //       image,
  //       slug: product.slug,
  //       name: product.name,
  //       brand: product.brand || "",
  //       fabric: product.fabric || "",
  //       material: product.material || "",
  //       sizes,
  //       colors: product.colors || [],
  //     },
  //   });
  // };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    handleToggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price,
      oldPrice: originalPrice,
      image,
      category: product.category_name || "",
      stock: product.stock || 0,
    });
  };

  return (
    <Link
       to={`/product/${product.slug}`}
      // to={`/product/${product.slug || product.id}`}
      className={`block group relative bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${
        isVisible ? `animate-fade-up stagger-${(index % 5) + 1}` : ""
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          width={512}
          height={640}
          className="w-full h-56 md:h-72 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-500 pointer-events-none" />

        {tag && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 md:px-3 py-1 rounded-full pointer-events-none">
            {tag}
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 md:w-9 md:h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-card hover:scale-110 z-10"
        >
          <Heart
            className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${
              isWishlisted ? "fill-destructive text-destructive" : "text-foreground"
            }`}
          />
        </button>

        <button
          type="button"
          onClick={handleAddToCartClick}
          className="absolute bottom-3 left-3 right-3 bg-primary text-primary-foreground py-2 md:py-2.5 rounded-lg font-medium text-xs md:text-sm flex items-center justify-center gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-primary/90 active:scale-[0.98] z-10"
        >
          <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Add to Cart
        </button>
      </div>

      <div className="p-3 md:p-4">
        <h3 className="font-body text-xs md:text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 md:gap-2 mt-1.5 flex-wrap">
          <span className="text-base md:text-lg font-heading font-semibold text-foreground">
            ₹{price.toLocaleString()}
          </span>

          {originalPrice > price && (
            <span className="text-xs md:text-sm text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}

          {discount > 0 && (
            <span className="text-[10px] md:text-xs font-semibold text-primary">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const ProductGrid = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts({
          status: "active",
          limit: 8,
        });

        setProducts(data || []);
      } catch (error) {
        console.error("Products fetch error:", error);
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  if (!products.length) return null;

  return (
    <section id="products" className="w-full pt-6 pb-2 md:pt-8 md:pb-2" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={`w-full text-center mx-auto mb-6 ${isVisible ? "animate-fade-up" : ""}`}>
          <p className="text-primary text-xs md:text-sm uppercase tracking-widest font-medium mb-1 block">
            Curated for You
          </p>
          <h2 className="text-3xl md:text-4xl font-heading inline-block">
            Our Popular Products
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>

        <div className={`flex justify-center mt-6 ${isVisible ? "animate-fade-up" : ""}`}>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 md:px-8 md:py-3 border-2 border-primary text-primary text-sm md:text-base font-medium rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 active:scale-[0.97]"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;


// import { ShoppingCart, Heart } from "lucide-react";
// import { useScrollAnimation } from "@/hooks/useScrollAnimation";
// import { Link } from "react-router-dom";
// import { useShop } from "../ShopContext.jsx";
// import { popularProducts } from "@/data/staticCatalog";

// const ProductCard = ({ product, index, isVisible }) => {
//   const { addToCart, toggleWishlist, wishlist } = useShop();

//   const price = Number(product.price || 0);
//   const originalPrice = Number(product.oldPrice || product.price || 0);
//   const isWishlisted = wishlist.some((item) => item.id === product.id);
//   const discount =
//     originalPrice > price && price > 0
//       ? Math.round((1 - price / originalPrice) * 100)
//       : 0;
//   const tag = product.badge || null;

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     addToCart({
//       id: product.id,
//       name: product.name,
//       price,
//       image: product.image,
//       category: product.subCategorySlug || "",
//     });
//   };

//   const handleWishlist = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     toggleWishlist({
//       id: product.id,
//       name: product.name,
//       price,
//       image: product.image,
//       category: product.subCategorySlug || "",
//     });
//   };

//   return (
//     <Link
//       to={`/product/${product.slug}`}
//       className={`block group relative bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${
//         isVisible ? `animate-fade-up stagger-${(index % 5) + 1}` : ""
//       }`}
//     >
//       <div className="relative overflow-hidden">
//         <img
//           src={product.image}
//           alt={product.name}
//           loading="lazy"
//           width={512}
//           height={640}
//           className="w-full h-56 md:h-72 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
//         />

//         <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-500 pointer-events-none" />

//         {tag && (
//           <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 md:px-3 py-1 rounded-full pointer-events-none">
//             {tag}
//           </span>
//         )}

//         <button
//           onClick={handleWishlist}
//           className="absolute top-3 right-3 w-8 h-8 md:w-9 md:h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-card hover:scale-110 z-10"
//         >
//           <Heart
//             className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${
//               isWishlisted ? "fill-destructive text-destructive" : "text-foreground"
//             }`}
//           />
//         </button>

//         <button
//           onClick={handleAddToCart}
//           className="absolute bottom-3 left-3 right-3 bg-primary text-primary-foreground py-2 md:py-2.5 rounded-lg font-medium text-xs md:text-sm flex items-center justify-center gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-primary/90 active:scale-[0.98] z-10"
//         >
//           <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
//           Add to Cart
//         </button>
//       </div>

//       <div className="p-3 md:p-4">
//         <h3 className="font-body text-xs md:text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300 cursor-pointer">
//           {product.name}
//         </h3>

//         <div className="flex items-center gap-1.5 md:gap-2 mt-1.5">
//           <span className="text-base md:text-lg font-heading font-semibold text-foreground">
//             ₹{price.toLocaleString()}
//           </span>

//           {originalPrice > price && (
//             <span className="text-xs md:text-sm text-muted-foreground line-through">
//               ₹{originalPrice.toLocaleString()}
//             </span>
//           )}

//           {discount > 0 && (
//             <span className="text-[10px] md:text-xs font-semibold text-primary">
//               {discount}% OFF
//             </span>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// };

// const ProductGrid = () => {
//   const { ref, isVisible } = useScrollAnimation();

//   return (
//     <section id="products" className="w-full pt-6 pb-2 md:pt-8 md:pb-2" ref={ref}>
//       <div className="container mx-auto px-4 md:px-6">
//         <div className={`w-full text-center mx-auto mb-6 ${isVisible ? "animate-fade-up" : ""}`}>
//           <p className="text-primary text-xs md:text-sm uppercase tracking-widest font-medium mb-1 block">
//             Curated for You
//           </p>
//           <h2 className="text-3xl md:text-4xl font-heading inline-block">Our Popular Products</h2>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
//           {popularProducts.map((product, i) => (
//             <ProductCard key={product.id} product={product} index={i} isVisible={isVisible} />
//           ))}
//         </div>

//         <div className={`flex justify-center mt-6 ${isVisible ? "animate-fade-up" : ""}`}>
//           <Link
//             to="/shop"
//             className="inline-block px-6 py-2.5 md:px-8 md:py-3 border-2 border-primary text-primary text-sm md:text-base font-medium rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 active:scale-[0.97]"
//           >
//             View All Products
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductGrid;
