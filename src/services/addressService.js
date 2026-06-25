import axiosClient from "@/api/axiosClient";

export const getAddresses = async () => {
  const res = await axiosClient.get("/storefront/auth/addresses");
  return res.data?.data ?? res.data ?? [];
};

export const createAddress = async (data) => {
  const res = await axiosClient.post("/storefront/auth/addresses", data);
  return res.data?.data ?? res.data;
};

export const updateAddress = async (id, data) => {
  const res = await axiosClient.put(`/storefront/auth/addresses/${id}`, data);
  return res.data?.data ?? res.data;
};

export const deleteAddress = async (id) => {
  const res = await axiosClient.delete(`/storefront/auth/addresses/${id}`);
  return res.data;
};

export const setDefaultAddress = async (id) => {
  const res = await axiosClient.put(`/storefront/auth/addresses/${id}/default`);
  return res.data?.data ?? res.data;
};
