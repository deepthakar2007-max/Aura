import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getOrderById, cancelOrder } from "../api/orderApi";
import OrderSummary from "../components/order/OrderSummary";
import OrderItem from "../components/order/OrderItem";
import FadeUp from "../components/animations/FadeUp";
import AnimatedButton from "../components/animations/AnimatedButton";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const loadOrder = () => {
    setLoading(true);
    getOrderById(id)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelOrder(id);
      loadOrder();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading)
    return <p className="text-center py-20 text-ink/50">Loading order…</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;
  if (!order) return null;

  const address = order.shippingAddress;
  const canCancel = ["Pending", "Processing"].includes(order.orderstatus);

  return (
    <FadeUp>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/orders" className="text-sm text-ink/50 hover:text-brandDark">
          ← Back to orders
        </Link>

        <div className="bg-white border border-ink/10 rounded-2xl p-6 mt-4">
          <OrderSummary order={order} />

          <div className="grid sm:grid-cols-2 gap-6 py-6 border-b border-ink/10">
            <div>
              <h3 className="text-sm font-medium text-ink/50 mb-2">
                Delivery address
              </h3>
              <p className="text-sm text-ink">{address?.fullname}</p>
              <p className="text-sm text-ink/70">
                {address?.address}, {address?.city}, {address?.state} -{" "}
                {address?.pincode}
              </p>
              <p className="text-sm text-ink/70">Mobile: {address?.mobile}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-ink/50 mb-2">Payment</h3>
              <p className="text-sm text-ink">{order.paymentMethod}</p>
            </div>
          </div>

          <div className="py-4 divide-y divide-ink/10">
            {order.orderItems.map((item, idx) => (
              <OrderItem key={idx} item={item} />
            ))}
          </div>

          <div className="pt-4 border-t border-ink/10 space-y-2 text-sm text-ink/70">
            <div className="flex justify-between">
              <span>Items total</span>
              <span>₹{order.itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{order.shippingPrice}</span>
            </div>
            <div className="flex justify-between font-medium text-lg text-ink pt-2 border-t border-ink/10">
              <span>Total</span>
              <span className="text-brandDark">₹{order.totalPrice}</span>
            </div>
          </div>

          {canCancel && (
            <AnimatedButton
              onClick={handleCancel}
              disabled={cancelling}
              className="mt-6 text-sm text-red-500 border border-red-200 rounded-lg px-4 py-2 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {cancelling ? "Cancelling…" : "Cancel order"}
            </AnimatedButton>
          )}
        </div>
      </div>
    </FadeUp>
  );
}
