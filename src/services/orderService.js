import axiosClient from "@/api/axiosClient";

export const checkoutOrder = async (payload) => {
  const res = await axiosClient.post("/storefront/orders/checkout", payload);
  return res.data?.data ?? res.data;
};

export const getMyOrders = async (params = {}) => {
  const res = await axiosClient.get("/storefront/orders", { params });
  const payload = res.data?.data ?? res.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const getMyOrder = async (id) => {
  const res = await axiosClient.get(`/storefront/orders/${id}`);
  return res.data?.data ?? res.data;
};

export const getOrderByNumber = async (orderNumber) => {
  const orders = await getMyOrders({ limit: 100 });
  const list = Array.isArray(orders) ? orders : [];
  return list.find(
    (order) =>
      String(order.order_number).toUpperCase() === String(orderNumber).toUpperCase()
  );
};
