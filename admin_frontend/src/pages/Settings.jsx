import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getSettings, updateSettings } from "../api/settingsApi";

export default function Settings() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getSettings().then((res) => setForm(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await updateSettings(form);
      setMsg("Settings saved ✅");
    } catch (err) {
      setMsg(err.message);
    }
  };

  if (!form)
    return (
      <AdminLayout>
        <p>Loading…</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-5">Website Settings</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-ink/10 rounded p-6 max-w-lg space-y-4"
      >
        {msg && <p className="text-sm text-green-600">{msg}</p>}
        <div>
          <label className="text-sm text-ink/70">Store Name</label>
          <input
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Store Email</label>
          <input
            value={form.storeEmail}
            onChange={(e) => setForm({ ...form, storeEmail: e.target.value })}
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Store Phone</label>
          <input
            value={form.storePhone}
            onChange={(e) => setForm({ ...form, storePhone: e.target.value })}
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Store Address</label>
          <textarea
            value={form.storeAddress}
            onChange={(e) => setForm({ ...form, storeAddress: e.target.value })}
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Currency</label>
          <input
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Tax Rate (%)</label>
          <input
            type="number"
            value={form.taxRate}
            onChange={(e) =>
              setForm({ ...form, taxRate: Number(e.target.value) })
            }
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-ink text-white px-6 py-2.5 rounded text-sm"
        >
          Save Settings
        </button>
      </form>
    </AdminLayout>
  );
}
