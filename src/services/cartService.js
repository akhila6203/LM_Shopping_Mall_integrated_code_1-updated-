import axiosClient from "@/api/axiosClient";

export const getCartItems = async () => {
  const res = await axiosClient.get("/cart");
  return res.data?.data || [];
};

export const addCartItem = async (item) => {
  const res = await axiosClient.post("/cart", item);
  return res.data?.data;
};

export const updateCartItemApi = async (cartId, payload) => {
  const res = await axiosClient.put(`/cart/${cartId}`, payload);
  return res.data?.data;
};

export const removeCartItemApi = async (cartId) => {
  const res = await axiosClient.delete(`/cart/${cartId}`);
  return res.data?.data;
};

export const clearCartItemsApi = async () => {
  const res = await axiosClient.delete("/cart");
  return res.data?.data;
};
