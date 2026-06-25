import axiosClient from "@/api/axiosClient";

export const getWishlistItems = async () => {
  const res = await axiosClient.get("/wishlist");
  return res.data?.data || [];
};

export const toggleWishlistApi = async (productId) => {
  const res = await axiosClient.post("/wishlist/toggle", {
    product_id: productId,
  });
  return res.data;
};
