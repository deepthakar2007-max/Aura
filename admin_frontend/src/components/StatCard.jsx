export default function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-ink/10 rounded p-5">
      <p className="text-xs text-ink/50">{label}</p>
      <p className="text-2xl font-semibold text-ink mt-1">{value}</p>
      {sub && <p className="text-xs text-ink/40 mt-1">{sub}</p>}
    </div>
  );
}
