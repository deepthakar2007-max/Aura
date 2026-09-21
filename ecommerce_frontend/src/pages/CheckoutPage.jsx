import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { getAddresses } from "../api/addressApi";
import { placeOrder } from "../api/orderApi";
import { createPayment } from "../api/paymentApi";
import AddressList from "../components/address/AddressList";
import CheckoutSteps from "../components/checkout/CheckoutSteps";
import DeliveryOptions from "../components/checkout/DeliveryOptions";
import PaymentForm from "../components/payment/PaymentForm";
import UpiModal from "../components/payment/UpiModal";
import FadeUp from "../components/animations/FadeUp";
import AnimatedButton from "../components/animations/AnimatedButton";

const TAX_RATE = 0.08;

export default function CheckoutPage() {
  const { user } = useAuth();
  const { activeItems, totalPrice, emptyCart } = useCart();
  const { state } = useLocation();
  const navigate = useNavigate();

  const appliedCoupon = state?.coupon || null;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [deliveryTier, setDeliveryTier] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  useEffect(() => {
    getAddresses(user._id)
      .then((res) => {
        setAddresses(res.data);
        if (res.data.length) setSelectedAddressId(res.data[0]._id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user._id]);

  let discount = 0;
  if (appliedCoupon) {
    discount =
      appliedCoupon.discountType === "PERCENTAGE"
        ? (totalPrice * appliedCoupon.discount) / 100
        : appliedCoupon.discount;
  }
  const afterDiscount = Math.max(0, totalPrice - discount);
  const shipping = deliveryTier === "express" ? 150 : 0;
  const taxes = afterDiscount * TAX_RATE;
  const grandTotal = afterDiscount + shipping + taxes;

  const buildOrderItems = () =>
    activeItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      img: item.product.img,
    }));

  const handlePlaceOrder = async () => {
    setError("");
    if (!selectedAddressId) {
      setError("Please select a delivery address");
      return;
    }
    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

    setPlacing(true);
    try {
      const res = await placeOrder({
        orderItems: buildOrderItems(),
        shippingAddress: selectedAddress,
        paymentMethod,
        itemsPrice: totalPrice,
        shippingPrice: shipping,
        totalPrice: grandTotal,
      });
      const order = res.data;

      if (paymentMethod === "COD") {
        await createPayment({
          user: user._id,
          order: order._id,
          amount: grandTotal,
          paymethod: "COD",
        });
        await emptyCart();
        navigate(`/orders/${order._id}`, { replace: true });
      } else {
        setPendingOrder(order);
        setShowUpiModal(true);
        setPlacing(false);
      }
    } catch (err) {
      setError(err.message);
      setPlacing(false);
    }
  };

  const handleUpiSuccess = async () => {
    try {
      await createPayment({
        user: user._id,
        order: pendingOrder._id,
        amount: grandTotal,
        paymethod: "UPI",
      });
      await emptyCart();
      navigate(`/order-success/${pendingOrder._id}`, { replace: true });
    } catch (err) {
      setError(err.message);
      setShowUpiModal(false);
    }
  };

  if (loading) return <p className="text-center py-20 text-ink/50">Loading…</p>;

  if (!activeItems.length) {
    return (
      <FadeUp>
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-3xl text-ink">
            Nothing to checkout
          </h1>
          <p className="text-ink/50 mt-2">Your bag is empty.</p>
          <Link
            to="/shop"
            className="inline-block mt-6 bg-ink text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-ink/80 transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </FadeUp>
    );
  }

  return (
    <FadeUp>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <CheckoutSteps current={4} />

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            <FadeUp delay={0.05}>
              <div className="bg-white border border-ink/10 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 bg-ink text-white rounded-lg flex items-center justify-center">
                      📍
                    </span>
                    <div>
                      <p className="font-medium text-ink">Shipping Address</p>
                      <p className="text-xs text-ink/50">
                        Select a preferred destination or add a new location
                      </p>
                    </div>
                  </div>
                  <Link to="/addresses" className="text-xs text-accent">
                    + Add New
                  </Link>
                </div>

                {addresses.length === 0 ? (
                  <div className="border border-dashed border-ink/20 p-6 text-center">
                    <p className="text-ink/60 text-sm mb-3">
                      You don't have any saved addresses.
                    </p>
                    <Link
                      to="/addresses"
                      className="text-accent underline text-sm"
                    >
                      Add an address
                    </Link>
                  </div>
                ) : (
                  <AddressList
                    addresses={addresses}
                    selectedId={selectedAddressId}
                    onSelect={setSelectedAddressId}
                  />
                )}
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <DeliveryOptions tier={deliveryTier} onChange={setDeliveryTier} />
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="bg-white border border-ink/10 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-9 h-9 bg-ink text-white rounded-lg flex items-center justify-center">
                    💳
                  </span>
                  <div>
                    <p className="font-medium text-ink">Payment Method</p>
                    <p className="text-xs text-ink/50">
                      All transactions are secured and encrypted
                    </p>
                  </div>
                </div>
                <PaymentForm
                  method={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.2}>
            <div className="bg-white border border-ink/10 p-6 h-fit sticky top-24 space-y-4">
              <h3 className="font-display text-xl text-ink">Order Summary</h3>

              {error && (
                <p className="text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {activeItems.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img
                      src={item.product.img}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover flex-shrink-0 bg-cream"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-ink/50">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-ink whitespace-nowrap">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm text-ink/70 pt-3 border-t border-ink/10">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
              </div>

              <motion.div
                key={grandTotal}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex justify-between items-baseline pt-3 border-t border-ink/10"
              >
                <span className="font-medium text-ink">Total</span>
                <span className="font-display text-2xl text-ink">
                  ${grandTotal.toFixed(2)}
                </span>
              </motion.div>

              <AnimatedButton
                onClick={handlePlaceOrder}
                disabled={placing || !selectedAddressId}
                className="w-full bg-ink text-white py-3.5 text-xs tracking-widest uppercase hover:bg-ink/80 transition-colors disabled:opacity-50"
              >
                {placing
                  ? "Placing order…"
                  : `🔒 Place Order & Pay $${grandTotal.toFixed(2)}`}
              </AnimatedButton>

              <p className="text-[10px] text-center text-ink/40">
                By placing your order, you agree to AURA's Terms of Service and
                Privacy Policy.
              </p>
            </div>
          </FadeUp>
        </div>
      </div>

      {showUpiModal && pendingOrder && (
        <UpiModal
          amount={grandTotal}
          onSuccess={handleUpiSuccess}
          onClose={() => setShowUpiModal(false)}
        />
      )}
    </FadeUp>
  );
}
