import { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getOrders } from "../api/orderApi";
import { getProducts } from "../api/productApi";
import { getCustomers } from "../api/customerApi";

const REPORTS = [
  { id: "sales", label: "Sales Report" },
  { id: "orders", label: "Order Report" },
  { id: "products", label: "Product Report" },
  { id: "customers", label: "Customer Report" },
];

function toCSV(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  rows.forEach((r) => lines.push(headers.map((h) => `"${r[h]}"`).join(",")));
  return lines.join("\n");
}

function download(filename, content) {
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [busy, setBusy] = useState("");

  const handleExport = async (type) => {
    setBusy(type);
    try {
      let rows = [];
      if (type === "orders" || type === "sales") {
        const res = await getOrders();
        rows = res.data.map((o) => ({
          OrderID: o._id,
          Customer: o.user?.username,
          Amount: o.totalPrice,
          Status: o.orderstatus,
          Date: o.createdAt,
        }));
      } else if (type === "products") {
        const res = await getProducts();
        rows = res.data.map((p) => ({
          Name: p.name,
          Category: p.category,
          Price: p.price,
          Stock: p.stock,
        }));
      } else if (type === "customers") {
        const res = await getCustomers();
        rows = res.data.map((c) => ({
          Username: c.username,
          Email: c.email,
          Joined: c.createdAt,
        }));
      }
      download(`${type}_report.csv`, toCSV(rows));
    } finally {
      setBusy("");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-5">Reports</h1>
      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
        {REPORTS.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-ink/10 rounded p-5 flex justify-between items-center"
          >
            <span className="text-sm font-medium">{r.label}</span>
            <button
              onClick={() => handleExport(r.id)}
              disabled={busy === r.id}
              className="bg-ink text-white px-3 py-1.5 rounded text-xs"
            >
              {busy === r.id ? "Exporting…" : "Export CSV"}
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
