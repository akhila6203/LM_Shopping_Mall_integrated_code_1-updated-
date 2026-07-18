import axiosClient from "@/api/axiosClient";

export const getProducts = async (params = {}) => {
  const res = await axiosClient.get("/products", { params });
  return res.data?.data || [];
};

export const getProductById = async (id) => {
  const res = await axiosClient.get(`/products/${id}`);
  return res.data?.data;
};

export const getProductBySlug = async (slug) => {
  const res = await axiosClient.get(`/products/slug/${slug}`);
  return res.data?.data;
};

export const getSimilarProducts = async (product) => {
  const params = {
    status: "active",
    limit: 8,
  };

  if (product?.sub_category_id) params.sub_category_id = product.sub_category_id;
  else if (product?.category_id) params.category_id = product.category_id;

  const products = await getProducts(params);
  return products.filter((item) => item.id !== product.id).slice(0, 4);
};




// import axiosClient from "@/api/axiosClient";

// export const getProducts = async (params = {}) => {
//   const res = await axiosClient.get("/products", { params });
//   return res.data.data || [];
// };

// export const getProductById = async (id) => {
//   const res = await axiosClient.get(`/products/${id}`);
//   return res.data.data;
// };

// export const getProductBySlug = async (slug) => {
//   const res = await axiosClient.get(`/products/slug/${slug}`);
//   return res.data.data;
// };

// export const getFeaturedProducts = async () => {
//   const res = await axiosClient.get("/products", {
//     params: { featured: "true", status: "active", limit: 12 },
//   });
//   return res.data.data || [];
// };

// export const getTrendingProducts = async () => {
//   const res = await axiosClient.get("/products", {
//     params: { trending: "true", status: "active", limit: 12 },
//   });
//   return res.data.data || [];
// };

// export const getBestSellerProducts = async () => {
//   const res = await axiosClient.get("/products", {
//     params: { best_seller: "true", status: "active", limit: 12 },
//   });
//   return res.data.data || [];
// };