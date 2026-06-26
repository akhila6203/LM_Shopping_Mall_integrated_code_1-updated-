import axiosClient from "@/api/axiosClient";

export const createPayment = async (payload) => {
  const res = await axiosClient.post("/storefront/payments/create", payload);
  return res.data?.data ?? res.data;
};

export const verifyPayment = async (payload) => {
  const res = await axiosClient.post("/storefront/payments/verify", payload);
  return res.data?.data ?? res.data;
};
