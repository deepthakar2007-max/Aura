export default function OrderItem({ item }) {
  return (
    <div className="flex gap-4 py-4">
      <img
        src={item.img}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg bg-paper flex-shrink-0"
      />
      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="font-medium text-ink">{item.name}</p>
          <p className="text-sm text-ink/50">
            Qty: {item.quantity} × ₹{item.price}
          </p>
        </div>
        <p className="font-medium text-brandDark">
          ₹{item.price * item.quantity}
        </p>
      </div>
    </div>
  );
}
