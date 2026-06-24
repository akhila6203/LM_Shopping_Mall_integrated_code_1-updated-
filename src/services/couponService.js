import axiosClient from "@/api/axiosClient";
export const validateCoupon = async ({ code, order_amount }) => {
  const res = await axiosClient.post("/coupons/validate", {
    code,
    order_amount,
  });
  return res.data.data;
};
