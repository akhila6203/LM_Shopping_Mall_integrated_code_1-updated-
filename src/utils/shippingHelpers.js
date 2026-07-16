const toBoolean = (value) =>
  value === true ||
  value === 1 ||
  value === "1" ||
  String(value).toLowerCase() === "true";

const toAmount = (value, fallback = 0) => {
  const amount = Number(value);

  return Number.isFinite(amount) && amount >= 0
    ? amount
    : fallback;
};

export const normalizeShippingSettings = (
  shipping = {}
) => ({
  shipping_enabled: toBoolean(
    shipping.shipping_enabled
  ),

  shipping_charge: toAmount(
    shipping.shipping_charge,
    0
  ),

  free_shipping_enabled: toBoolean(
    shipping.free_shipping_enabled
  ),

  free_shipping_above: toAmount(
    shipping.free_shipping_above,
    0
  ),

  shipping_label:
    shipping.shipping_label ||
    "Standard Delivery",

  estimated_delivery_days:
    shipping.estimated_delivery_days ||
    "5-7 Days",
});

export const calculateShippingCharge = (
  subtotal,
  settings
) => {
  const orderSubtotal = toAmount(subtotal, 0);

  const config =
    normalizeShippingSettings(settings);

  if (orderSubtotal <= 0) {
    return 0;
  }

  // Admin shipping OFF = free shipping
  if (!config.shipping_enabled) {
    return 0;
  }

  // Admin free shipping ON and threshold reached
  if (
    config.free_shipping_enabled &&
    config.free_shipping_above > 0 &&
    orderSubtotal >=
      config.free_shipping_above
  ) {
    return 0;
  }

  // Shipping ON and threshold not reached
  return config.shipping_charge;
};