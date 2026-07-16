const roundMoney = (value) =>
  Math.round(
    (Number(value || 0) + Number.EPSILON) * 100
  ) / 100;

export const calculateInclusiveGst = (
  amount,
  gstPercent
) => {
  const grossAmount = Number(amount || 0);
  const rate = Number(gstPercent || 0);

  if (grossAmount <= 0 || rate <= 0) {
    return 0;
  }

  return roundMoney(
    grossAmount * rate / (100 + rate)
  );
};

/**
 * Coupon discount is proportionally allocated
 * across all cart products.
 */
export const calculateCartIncludedGst = ({
  cart = [],
  subtotal = 0,
  discount = 0,
}) => {
  const cartSubtotal = Number(subtotal || 0);
  const discountAmount = Number(discount || 0);

  if (
    !Array.isArray(cart) ||
    !cart.length ||
    cartSubtotal <= 0
  ) {
    return 0;
  }

  const discountedProductsTotal = Math.max(
    0,
    cartSubtotal - discountAmount
  );

  const discountRatio =
    discountedProductsTotal / cartSubtotal;

  const totalGst = cart.reduce(
    (sum, item) => {
      const quantity = Number(
        item.qty || item.quantity || 1
      );

      const price = Number(
        item.price || 0
      );

      const gstPercent = Number(
        item.gst_percent || 0
      );

      if (gstPercent <= 0) {
        return sum;
      }

      const discountedLineAmount =
        price *
        quantity *
        discountRatio;

      return (
        sum +
        calculateInclusiveGst(
          discountedLineAmount,
          gstPercent
        )
      );
    },
    0
  );

  return roundMoney(totalGst);
};