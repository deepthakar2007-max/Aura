import { useState } from "react";

const initialForm = {
  fullname: "",
  mobile: "",
  pincode: "",
  address: "",
  state: "",
  city: "",
  landmark: "",
  addresstype: "Home",
};

export default function AddressForm({ onSubmit, onCancel, initialValues }) {
  const [form, setForm] = useState(initialValues || initialForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-ink/10 rounded-2xl p-6 space-y-4"
    >
      {error && (
        <p className="text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-ink/70">Full name</label>
          <input
            name="fullname"
            required
            value={form.fullname}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Mobile number</label>
          <input
            name="mobile"
            type="tel"
            required
            value={form.mobile}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-ink/70">Address</label>
        <input
          name="address"
          required
          value={form.address}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-ink/70">City</label>
          <input
            name="city"
            required
            value={form.city}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">State</label>
          <input
            name="state"
            required
            value={form.state}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Pincode</label>
          <input
            name="pincode"
            required
            maxLength={6}
            value={form.pincode}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-ink/70">Landmark (optional)</label>
          <input
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Address type</label>
          <select
            name="addresstype"
            value={form.addresstype}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option>Home</option>
            <option>Work</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="bg-brandDark text-paper px-6 py-2.5 rounded-lg hover:bg-brand transition-colors disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save address"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg border border-ink/15 hover:border-ink/30 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
