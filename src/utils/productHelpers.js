import { categoryHierarchy, staticProducts, subCategoryImages } from "@/data/staticCatalog";

export const getSubCategoryImage = (slug) =>
  subCategoryImages[slug] ||
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

export const getAllProducts = () => staticProducts;

export const getProductBySlug = (slug) =>
  staticProducts.find((p) => p.slug === slug) || null;

export const getProductById = (id) =>
  staticProducts.find((p) => p.id.toString() === id.toString()) || null;

export const findMainCategory = (slug) =>
  categoryHierarchy.find((c) => c.slug === slug);

export const findSubCategory = (slug) => {
  for (const main of categoryHierarchy) {
    const sub = main.sub_categories?.find((s) => s.slug === slug);
    if (sub) return { main, sub };
  }
  return null;
};

export const findChildCategory = (slug) => {
  for (const main of categoryHierarchy) {
    for (const sub of main.sub_categories || []) {
      const child = sub.child_categories?.find((c) => c.slug === slug);
      if (child) return { main, sub, child };
    }
  }
  return null;
};

export const getProductsByMainCategory = (categorySlug) =>
  staticProducts.filter((p) => p.mainCategorySlug === categorySlug);

export const getProductsBySubCategory = (subCategorySlug) =>
  staticProducts.filter((p) => p.subCategorySlug === subCategorySlug);

export const getProductsByChildCategory = (childCategorySlug) =>
  staticProducts.filter((p) => p.childCategorySlug === childCategorySlug);

export const getListingTitle = (type, slug) => {
  if (type === "category") {
    return findMainCategory(slug)?.name || slug;
  }
  if (type === "subcategory") {
    return findSubCategory(slug)?.sub?.name || slug;
  }
  if (type === "childcategory") {
    return findChildCategory(slug)?.child?.name || slug;
  }
  return "Products";
};

export const getSubCategoriesForMain = (mainSlug) => {
  const main = findMainCategory(mainSlug);
  return main?.sub_categories || [];
};

const parseOptionValue = (variant, key) => {
  if (!variant) return "";
  const raw = variant.option_values;
  if (Array.isArray(raw)) {
    const found = raw.find(
      (opt) => String(opt?.name || "").toLowerCase() === key.toLowerCase()
    );
    if (found?.value) return String(found.value).trim();
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const found = parsed.find(
          (opt) => String(opt?.name || "").toLowerCase() === key.toLowerCase()
        );
        if (found?.value) return String(found.value).trim();
      }
    } catch {
      /* ignore */
    }
  }
  return variant[key] ? String(variant[key]).trim() : "";
};

export const extractProductSizes = (product = {}) => {
  const sizes = new Set();

  const addSize = (value) => {
    const size = String(value || "").trim();
    if (size) sizes.add(size);
  };

  [product.sizes, product.available_sizes, product.size_options, product.variant_sizes,].forEach((source) => {
    if (Array.isArray(source)) {
      source.forEach(addSize);
    } else if (typeof source === "string") {
      source.split(",").forEach(addSize);
    }
  });

  // (product.variants || []).forEach((variant) => {
  //   addSize(parseOptionValue(variant, "size") || variant.size);
  // });
    (
    product.variants ||
    product.product_variants ||
    []
  ).forEach((variant) => {
    addSize(
      parseOptionValue(
        variant,
        "size"
      ) ||
      variant.size
    );
  });


  // if (!sizes.size) addSize("Free Size");

  return [...sizes];
};

export const buildNavbarLinks = () => {
  const priority = ["women", "men", "accessories"];

  const sorted = [...categoryHierarchy].sort((a, b) => {
    const aIndex = priority.indexOf(a.slug);
    const bIndex = priority.indexOf(b.slug);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  return sorted.map((mainCat) => {
    const subCategories = mainCat.sub_categories || [];

    const featuredProduct = staticProducts.find(
      (p) => p.mainCategorySlug === mainCat.slug
    );

    return {
      id: mainCat.id,
      slug: mainCat.slug,
      label: mainCat.name,
      path: `/products/category/${mainCat.slug}`,
      hasDropdown: subCategories.length > 0,
      dropdownContent: {
        columns: subCategories.map((subCat) => {
          const childCategories = subCat.child_categories || [];

          return {
            title: subCat.name,
            subPath: `/products/subcategory/${subCat.slug}`,
            links:
              childCategories.length > 0
                ? [
                    {
                      name: `View all ${subCat.name}`,
                      path: `/products/subcategory/${subCat.slug}`,
                    },
                    ...childCategories.map((child) => ({
                      name: child.name,
                      path: `/products/childcategory/${child.slug}`,
                    })),
                  ]
                : [
                    {
                      name: `View all ${subCat.name}`,
                      path: `/products/subcategory/${subCat.slug}`,
                    },
                  ],
          };
        }),
        featuredImage: featuredProduct
          ? {
              url: featuredProduct.image,
              title: featuredProduct.name,
              subtitle: "Latest Product",
              link: `/product/${featuredProduct.slug}`,
            }
          : null,
      },
    };
  });
};



// import { categoryHierarchy, staticProducts, subCategoryImages } from "@/data/staticCatalog";

// export const getSubCategoryImage = (slug) =>
//   subCategoryImages[slug] ||
//   "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop";

// export const getAllProducts = () => staticProducts;

// export const getProductBySlug = (slug) =>
//   staticProducts.find((p) => p.slug === slug) || null;

// export const getProductById = (id) =>
//   staticProducts.find((p) => p.id.toString() === id.toString()) || null;

// export const findMainCategory = (slug) =>
//   categoryHierarchy.find((c) => c.slug === slug);

// export const findSubCategory = (slug) => {
//   for (const main of categoryHierarchy) {
//     const sub = main.sub_categories?.find((s) => s.slug === slug);
//     if (sub) return { main, sub };
//   }
//   return null;
// };

// export const findChildCategory = (slug) => {
//   for (const main of categoryHierarchy) {
//     for (const sub of main.sub_categories || []) {
//       const child = sub.child_categories?.find((c) => c.slug === slug);
//       if (child) return { main, sub, child };
//     }
//   }
//   return null;
// };

// export const getProductsByMainCategory = (categorySlug) =>
//   staticProducts.filter((p) => p.mainCategorySlug === categorySlug);

// export const getProductsBySubCategory = (subCategorySlug) =>
//   staticProducts.filter((p) => p.subCategorySlug === subCategorySlug);

// export const getProductsByChildCategory = (childCategorySlug) =>
//   staticProducts.filter((p) => p.childCategorySlug === childCategorySlug);

// export const getListingTitle = (type, slug) => {
//   if (type === "category") {
//     return findMainCategory(slug)?.name || slug;
//   }
//   if (type === "subcategory") {
//     return findSubCategory(slug)?.sub?.name || slug;
//   }
//   if (type === "childcategory") {
//     return findChildCategory(slug)?.child?.name || slug;
//   }
//   return "Products";
// };

// export const getSubCategoriesForMain = (mainSlug) => {
//   const main = findMainCategory(mainSlug);
//   return main?.sub_categories || [];
// };

// const parseOptionValue = (variant, key) => {
//   if (!variant) return "";
//   const raw = variant.option_values;
//   if (Array.isArray(raw)) {
//     const found = raw.find(
//       (opt) => String(opt?.name || "").toLowerCase() === key.toLowerCase()
//     );
//     if (found?.value) return String(found.value).trim();
//   }
//   if (typeof raw === "string") {
//     try {
//       const parsed = JSON.parse(raw);
//       if (Array.isArray(parsed)) {
//         const found = parsed.find(
//           (opt) => String(opt?.name || "").toLowerCase() === key.toLowerCase()
//         );
//         if (found?.value) return String(found.value).trim();
//       }
//     } catch {
//       /* ignore */
//     }
//   }
//   return variant[key] ? String(variant[key]).trim() : "";
// };

// export const extractProductSizes = (product = {}) => {
//   const sizes = new Set();

//   const addSize = (value) => {
//     const size = String(value || "").trim();
//     if (size) sizes.add(size);
//   };

//   [product.sizes, product.available_sizes, product.size_options].forEach((source) => {
//     if (Array.isArray(source)) {
//       source.forEach(addSize);
//     } else if (typeof source === "string") {
//       source.split(",").forEach(addSize);
//     }
//   });

//   (product.variants || []).forEach((variant) => {
//     addSize(parseOptionValue(variant, "size") || variant.size);
//   });

//   if (!sizes.size) addSize("Free Size");

//   return [...sizes];
// };

// export const buildNavbarLinks = () => {
//   const priority = ["women", "men", "accessories"];

//   const sorted = [...categoryHierarchy].sort((a, b) => {
//     const aIndex = priority.indexOf(a.slug);
//     const bIndex = priority.indexOf(b.slug);
//     if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
//     if (aIndex !== -1) return -1;
//     if (bIndex !== -1) return 1;
//     return 0;
//   });

//   return sorted.map((mainCat) => {
//     const subCategories = mainCat.sub_categories || [];

//     const featuredProduct = staticProducts.find(
//       (p) => p.mainCategorySlug === mainCat.slug
//     );

//     return {
//       id: mainCat.id,
//       slug: mainCat.slug,
//       label: mainCat.name,
//       path: `/products/category/${mainCat.slug}`,
//       hasDropdown: subCategories.length > 0,
//       dropdownContent: {
//         columns: subCategories.map((subCat) => {
//           const childCategories = subCat.child_categories || [];

//           return {
//             title: subCat.name,
//             subPath: `/products/subcategory/${subCat.slug}`,
//             links:
//               childCategories.length > 0
//                 ? [
//                     {
//                       name: `View all ${subCat.name}`,
//                       path: `/products/subcategory/${subCat.slug}`,
//                     },
//                     ...childCategories.map((child) => ({
//                       name: child.name,
//                       path: `/products/childcategory/${child.slug}`,
//                     })),
//                   ]
//                 : [
//                     {
//                       name: `View all ${subCat.name}`,
//                       path: `/products/subcategory/${subCat.slug}`,
//                     },
//                   ],
//           };
//         }),
//         featuredImage: featuredProduct
//           ? {
//               url: featuredProduct.image,
//               title: featuredProduct.name,
//               subtitle: "Latest Product",
//               link: `/product/${featuredProduct.slug}`,
//             }
//           : null,
//       },
//     };
//   });
// };
