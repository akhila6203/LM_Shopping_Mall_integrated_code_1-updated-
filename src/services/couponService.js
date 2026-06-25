import axiosClient from "@/api/axiosClient";

export const calculateCouponDiscount = (coupon, subtotal) => {
  const amount = Number(subtotal) || 0;
  if (!coupon || amount <= 0) return 0;

  const type = coupon.type || coupon.discount_type;
  const value = Number(coupon.value || coupon.discount_value || 0);
  const maxDiscount = Number(coupon.maximum_discount || coupon.max_discount || 0);

  let discount = 0;
  if (type === "flat" || type === "fixed") {
    discount = value;
  } else {
    discount = Math.round((amount * value) / 100);
  }

  if (maxDiscount > 0) {
    discount = Math.min(discount, maxDiscount);
  }

  return Math.min(discount, amount);
};

export const parseCouponValidation = (response, subtotal) => {
  const payload = response?.data ?? response;
  const inner = payload?.data ?? payload;
  const coupon = inner?.coupon ?? inner;

  const discountAmount =
    inner?.discount_amount != null
      ? Number(inner.discount_amount)
      : calculateCouponDiscount(coupon, subtotal);

  const finalAmount =
    inner?.final_amount != null
      ? Number(inner.final_amount)
      : Math.max(0, subtotal - discountAmount);

  return {
    coupon_id: coupon?.id ?? null,
    coupon_code: coupon?.code ?? "",
    coupon_type: coupon?.type || coupon?.discount_type || "percentage",
    coupon_value: Number(coupon?.value || coupon?.discount_value || 0),
    discount_amount: discountAmount,
    final_amount: finalAmount,
    message: payload?.message || "Coupon applied successfully!",
  };
};

export const validateCoupon = async ({ code, order_amount }) => {
  const res = await axiosClient.post("/coupons/validate", {
    code: String(code).trim().toUpperCase(),
    order_amount,
  });
  return parseCouponValidation(res.data, order_amount);
};
