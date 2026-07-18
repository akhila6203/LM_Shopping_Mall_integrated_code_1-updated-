import axiosClient from "@/api/axiosClient";

const unwrapData = (response) => {
  const payload = response?.data;

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
};

export const recordRecentlyViewed = async (productId) => {
  const parsedProductId = Number(productId);

  if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
    return false;
  }

  const response = await axiosClient.post(
    "/storefront/recently-viewed",
    {
      product_id: parsedProductId,
    }
  );

  return response?.data?.success === true;
};

export const getRecentlyViewedProducts = async ({
  limit = 8,
  excludeProductId = null,
} = {}) => {
  const params = {
    limit,
    /*
     * Browser/proxy old empty response cache cheyyakunda.
     */
    _t: Date.now(),
  };

  if (excludeProductId) {
    params.exclude_product_id = Number(excludeProductId);
  }

  const response = await axiosClient.get(
  "/storefront/recently-viewed",
  {
    params,
  }
);

  return unwrapData(response);
};

export const clearRecentlyViewedProducts = async () => {
  const response = await axiosClient.delete(
    "/storefront/recently-viewed"
  );

  return response?.data?.success === true;
};