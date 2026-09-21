import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { getOrders } from "../api/orderApi";
import OrderSummary from "../components/order/OrderSummary";
import FadeUp from "../components/animations/FadeUp";
import StaggerContainer, {
  staggerItemVariants,
} from "../components/animations/StaggerContainer";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center py-20 text-ink/50">Loading orders…</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  if (!orders.length) {
    return (
      <FadeUp>
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-3xl text-brandDark">
            No orders yet
          </h1>
          <p className="text-ink/50 mt-2">
            Your placed orders will show up here.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-6 bg-brandDark text-paper px-6 py-2.5 rounded-lg hover:bg-brand transition-colors"
          >
            Start shopping
          </Link>
        </div>
      </FadeUp>
    );
  }

  return (
    <FadeUp>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-brandDark mb-8">
          Your orders
        </h1>
        <StaggerContainer className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              variants={staggerItemVariants}
              whileHover={{ y: -3 }}
            >
              <Link
                to={`/orders/${order._id}`}
                className="block bg-white border border-ink/10 rounded-2xl p-6 hover:border-brand/40 transition-colors"
              >
                <OrderSummary order={order} />
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-ink/60">
                    {order.orderItems.length} item(s)
                  </p>
                  <p className="font-medium text-brandDark">
                    ₹{order.totalPrice}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </FadeUp>
  );
}
