import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { getOrder, updateOrderStatus } from "../api/orderApi";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => getOrder(id).then((res) => setOrder(res.data));

  useEffect(() => {
    load();
  }, [id]);

  const handleStatusChange = async (status) => {
    setBusy(true);
    await updateOrderStatus(id, status);
    await load();
    setBusy(false);
  };

  if (!order)
    return (
      <AdminLayout>
        <p>Loading…</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <Link to="/orders" className="text-sm text-ink/50">
        ← Back
      </Link>
      <h1 className="text-xl font-semibold text-ink mt-2 mb-5">
        Order #{order._id.slice(-6).toUpperCase()}
      </h1>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white border border-ink/10 rounded p-5">
            <p className="font-medium mb-3">Items</p>
            {order.orderItems.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-sm py-2 border-b border-ink/5"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between font-medium mt-3 pt-3 border-t border-ink/10">
              <span>Total</span>
              <span>₹{order.totalPrice}</span>
            </div>
          </div>

          <div className="bg-white border border-ink/10 rounded p-5">
            <p className="font-medium mb-3">Shipping Address</p>
            <p className="text-sm text-ink/70">
              {order.shippingAddress?.fullname}
            </p>
            <p className="text-sm text-ink/70">
              {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
            <p className="text-sm text-ink/70">
              Mobile: {order.shippingAddress?.mobile}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-ink/10 rounded p-5">
            <p className="font-medium mb-3">Customer</p>
            <p className="text-sm">{order.user?.username}</p>
            <p className="text-sm text-ink/60">{order.user?.email}</p>
          </div>

          <div className="bg-white border border-ink/10 rounded p-5">
            <p className="font-medium mb-3">Order Status</p>
            <select
              disabled={busy}
              value={order.orderstatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <p className="text-xs text-ink/40 mt-2">
              Payment: {order.paymentMethod}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
