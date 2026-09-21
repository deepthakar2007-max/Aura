import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../api/orderApi";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data))
      .catch(() => {});
  }, [id]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="mx-auto w-24 h-24 mb-6">
          <svg viewBox="0 0 52 52" className="w-full h-full">
            <circle
              cx="26"
              cy="26"
              r="24"
              className="fill-none stroke-green-500"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                strokeDasharray: 166,
                strokeDashoffset: 166,
                animation: "circleDraw 0.6s ease-out forwards",
              }}
            />
            <path
              d="M14 27l7 7 16-16"
              className="fill-none stroke-green-500"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 48,
                strokeDashoffset: 48,
                animation: "checkDraw 0.4s 0.5s ease-out forwards",
              }}
            />
          </svg>
        </div>

        <h1 className="font-display text-3xl text-brandDark">
          Payment successful
        </h1>
        <p className="text-ink/60 mt-2">
          {order
            ? `Order #${order._id.slice(-8).toUpperCase()} has been placed.`
            : "Your order has been placed."}
        </p>

        <div className="flex flex-col gap-3 mt-8">
          <button
            onClick={() => navigate(`/orders/${id}`)}
            className="bg-brandDark text-paper py-3 rounded-lg hover:bg-brand transition-colors"
          >
            View order details
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-ink/60 text-sm underline"
          >
            Continue shopping
          </button>
        </div>
      </div>

      <style>{`
        @keyframes circleDraw { to { stroke-dashoffset: 0; } }
        @keyframes checkDraw { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}
