import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getSettings, updateSettings } from "../api/settingsApi";

const SECTIONS = [
  { id: "identity", label: "Store Identity" },
  { id: "currency", label: "Currency & Taxes" },
  { id: "preferences", label: "Store Preferences" },
];

export default function Settings() {
  const [form, setForm] = useState(null);
  const [original, setOriginal] = useState(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getSettings().then((res) => {
      setForm(res.data);
      setOriginal(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      const res = await updateSettings(form);
      setForm(res.data);
      setOriginal(res.data);
      setMsg("Settings saved ✅");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDiscard = () => setForm(original);

  const scrollTo = (id) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (!form)
    return (
      <AdminLayout>
        <p className="text-ink/50">Loading settings…</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <p className="text-xs text-accent uppercase tracking-wide mb-1">
        Configuration / Store Settings
      </p>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
        <h1 className="text-2xl font-semibold text-ink">General Settings</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDiscard}
            className="border border-ink/10 px-4 py-2 rounded-lg text-sm"
          >
            Discard
          </button>
          <button
            type="submit"
            form="settings-form"
            disabled={busy}
            className="bg-accent text-ink px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
      <p className="text-sm text-ink/50 mb-6">
        Manage your store's core identity, regional preferences, and tax
        compliance.
      </p>

      {msg && (
        <p
          className={`text-sm rounded-lg px-3 py-2 mb-5 max-w-3xl ${msg.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-danger border border-red-200"}`}
        >
          {msg}
        </p>
      )}

      <div className="grid lg:grid-cols-[260px_1fr] gap-5">
        <div className="space-y-5">
          <div className="bg-white border border-ink/10 rounded-xl p-5">
            <p className="font-medium text-ink mb-3">Quick Navigation</p>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink/70 hover:bg-cream/50 transition-colors"
              >
                {s.label} <span>›</span>
              </button>
            ))}
          </div>
          <div className="bg-cream/40 border border-ink/10 rounded-xl p-5">
            <p className="font-medium text-ink mb-2">💡 Pro Tip on Taxes</p>
            <p className="text-sm text-ink/60">
              Tax rate is applied globally at checkout to the cart subtotal
              before shipping.
            </p>
          </div>
        </div>

        <form
          id="settings-form"
          onSubmit={handleSubmit}
          className="bg-white border border-ink/10 rounded-xl p-6 space-y-8"
        >
          <div id="identity">
            <p className="font-medium text-ink text-lg mb-4">
              🏬 Store Identity
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-ink">
                  Store Name
                </label>
                <input
                  value={form.storeName}
                  onChange={(e) =>
                    setForm({ ...form, storeName: e.target.value })
                  }
                  className="mt-1.5 w-full bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                />
                <p className="text-xs text-ink/40 mt-1">
                  The name displayed on invoices, emails, and your storefront
                  header.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-ink">
                    Support Email
                  </label>
                  <input
                    value={form.storeEmail}
                    onChange={(e) =>
                      setForm({ ...form, storeEmail: e.target.value })
                    }
                    className="mt-1.5 w-full bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink">
                    Phone Number
                  </label>
                  <input
                    value={form.storePhone}
                    onChange={(e) =>
                      setForm({ ...form, storePhone: e.target.value })
                    }
                    className="mt-1.5 w-full bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-ink">
                  Physical Address
                </label>
                <textarea
                  rows={3}
                  value={form.storeAddress}
                  onChange={(e) =>
                    setForm({ ...form, storeAddress: e.target.value })
                  }
                  className="mt-1.5 w-full bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                />
                <p className="text-xs text-ink/40 mt-1">
                  Used for shipping origin and tax jurisdiction.
                </p>
              </div>
            </div>
          </div>

          <div id="currency" className="border-t border-ink/10 pt-6">
            <p className="font-medium text-ink text-lg mb-4">
              💱 Currency & Taxes
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-ink">
                  Default Currency
                </label>
                <select
                  value={form.currency}
                  onChange={(e) =>
                    setForm({ ...form, currency: e.target.value })
                  }
                  className="mt-1.5 w-full bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                >
                  <option value="INR">INR (₹) — Indian Rupee</option>
                  <option value="USD">USD ($) — US Dollar</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-ink">
                  Tax Rate Percentage
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.taxRate}
                  onChange={(e) =>
                    setForm({ ...form, taxRate: Number(e.target.value) })
                  }
                  className="mt-1.5 w-full bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                />
                <p className="text-xs text-ink/40 mt-1">
                  Standard checkout rate applied across all items.
                </p>
              </div>
            </div>
          </div>

          <div id="preferences" className="border-t border-ink/10 pt-6">
            <p className="font-medium text-ink text-lg mb-4">
              ⚙ Store Preferences
            </p>
            <div className="space-y-4">
              <label className="flex gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autoTaxCalculation}
                  onChange={(e) =>
                    setForm({ ...form, autoTaxCalculation: e.target.checked })
                  }
                  className="mt-1 accent-accent w-4 h-4"
                />
                <div>
                  <p className="text-sm font-medium text-ink">
                    Enable Automatic Tax Calculation
                  </p>
                  <p className="text-xs text-ink/50">
                    Calculate taxes dynamically at checkout based on cart
                    subtotal.
                  </p>
                </div>
              </label>
              <label className="flex gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.lowStockAlerts}
                  onChange={(e) =>
                    setForm({ ...form, lowStockAlerts: e.target.checked })
                  }
                  className="mt-1 accent-accent w-4 h-4"
                />
                <div>
                  <p className="text-sm font-medium text-ink">
                    Low Stock Inventory Alerts
                  </p>
                  <p className="text-xs text-ink/50">
                    Flag products as "Low Stock" when quantity drops to 5 or
                    below.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-ink/10 pt-5">
            <button
              type="button"
              onClick={handleDiscard}
              className="border border-ink/10 px-5 py-2.5 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="bg-accent text-ink px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
