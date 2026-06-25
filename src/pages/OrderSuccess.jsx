import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2, Sparkles, Package, ArrowRight, Percent, Truck, MapPin,
} from "lucide-react";
import { getMyOrder } from "@/services/orderService";
import { getImageUrl } from "@/api/axiosClient";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [items, setItems] = useState(location.state?.items || []);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    const orderId = location.state?.orderId || location.state?.order?.id;
    if (!orderId) {
      navigate("/shop", { replace: true });
      return;
    }

    if (location.state?.order) {
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        const data = await getMyOrder(orderId);
        setOrder(data);
        setItems(data.items || []);
      } catch (error) {
        console.error("Load order error:", error);
        navigate("/profile?tab=orders", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-stone-200 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-stone-500 text-sm">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const subtotal = Number(order.subtotal || 0);
  const discount = Number(order.discount_amount || 0);
  const shipping = Number(order.shipping_charge || 0);
  const total = Number(order.total_amount || 0);

  return (
    <div className="w-full min-h-[85vh] bg-gradient-to-b from-stone-50 via-white to-stone-50 flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="relative mb-8">
          <div className="w-28 h-28 mx-auto bg-green-100 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </div>
        </div>

        <h1 className="font-heading text-4xl md:text-5xl text-stone-800 mb-4">
          Order Placed Successfully!
        </h1>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <p className="text-stone-600">Thank you for your purchase</p>
          <Sparkles className="w-5 h-5 text-primary" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-6 md:p-8 mb-8 text-left">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Order Number</p>
              <p className="font-mono text-lg font-semibold text-stone-800">#{order.order_number}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Order Status</p>
              <p className="text-sm font-medium text-stone-700 capitalize">{order.order_status || "pending"}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Payment Method</p>
              <p className="text-sm font-medium text-stone-700">
                {order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method || "Online"}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Total Amount</p>
              <p className="text-lg font-bold text-primary">₹{total.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {items.length > 0 && (
            <>
              <div className="border-t border-stone-100 my-6"></div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-3">Items</p>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id || item.product_id} className="flex gap-3 items-center">
                    {item.image && (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.product_name}
                        className="w-12 h-14 object-cover rounded-lg border border-stone-200"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{item.product_name}</p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-stone-800">
                      ₹{Number(item.total_price || item.price * item.quantity || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="border-t border-stone-100 my-6"></div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="flex items-center gap-1">
                  <Percent className="w-3 h-3" /> Discount
                </span>
                <span>-₹{discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3" /> Shipping
              </span>
              <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-stone-800 pt-2 border-t border-stone-100">
              <span>Total</span>
              <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="border-t border-stone-100 my-6"></div>

          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Delivery Address
            </p>
            <p className="text-stone-700 text-sm">
              {order.shipping_name}<br />
              {order.shipping_address}<br />
              {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}<br />
              {order.shipping_country || "India"}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="bg-primary text-white px-8 py-3.5 rounded-full font-body text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={`/track-order?order=${order.order_number}`}
            className="bg-white text-stone-700 px-8 py-3.5 rounded-full font-body text-sm font-medium border border-stone-200 hover:border-primary hover:text-primary transition-all flex items-center gap-2"
          >
            <Package className="w-4 h-4" /> Track Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
