import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import ConfirmModal from "../components/ConfirmModal";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../api/bannerApi";

const PER_PAGE = 5;

const positionBadge = {
  hero: "bg-amber-100 text-amber-700",
  promo: "bg-blue-100 text-blue-700",
  featured: "bg-purple-100 text-purple-700",
};

const POSITION_OPTIONS = [
  { value: "left top", label: "↖" },
  { value: "center top", label: "↑" },
  { value: "right top", label: "↗" },
  { value: "left center", label: "←" },
  { value: "center", label: "●" },
  { value: "right center", label: "→" },
  { value: "left bottom", label: "↙" },
  { value: "center bottom", label: "↓" },
  { value: "right bottom", label: "↘" },
];

const initialForm = {
  title: "",
  image: "",
  link: "",
  position: "hero",
  objectPosition: "center",
  order: 0,
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imageSource, setImageSource] = useState("url");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    getBanners()
      .then((res) => setBanners(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be under 8MB");
      return;
    }
    setError("");
    const base64 = await fileToBase64(file);
    setForm({ ...form, image: base64 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.image) {
      setError("Please provide an image URL or upload a file");
      return;
    }
    setBusy(true);
    try {
      await createBanner(form);
      setShowForm(false);
      setForm(initialForm);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = async (b) => {
    await updateBanner(b._id, {
      status: b.status === "active" ? "inactive" : "active",
    });
    load();
  };

  const handleDelete = async () => {
    await deleteBanner(deleteId);
    setDeleteId(null);
    load();
  };

  const filtered = banners
    .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
    .filter((b) => !positionFilter || b.position === positionFilter)
    .filter((b) => !statusFilter || b.status === statusFilter)
    .sort((a, b) => a.order - b.order);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeCount = banners.filter((b) => b.status === "active").length;
  const heroCount = banners.filter((b) => b.position === "hero").length;

  return (
    <AdminLayout>
      <p className="text-xs text-accent uppercase tracking-wide mb-1">
        Storefront Presentation / Content Management
      </p>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
        <h1 className="text-2xl font-semibold text-ink">Banners / CMS</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-ink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink/85 transition-colors whitespace-nowrap"
        >
          + Add Banner
        </button>
      </div>
      <p className="text-sm text-ink/50 mb-6">
        Manage homepage banners and promotional sections.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Total Banners
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {banners.length}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Active Banners
          </p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {activeCount}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Hero Position Count
          </p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">
            {heroCount}
          </p>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-ink/10 rounded-xl p-5 mb-5 max-w-2xl space-y-4"
        >
          {error && (
            <p className="text-sm bg-red-50 text-danger border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <input
            placeholder="Banner title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
          />

          <div>
            <div className="flex bg-cream/60 rounded-lg p-1 mb-3 w-fit">
              <button
                type="button"
                onClick={() => setImageSource("url")}
                className={`px-4 py-1.5 rounded-lg text-sm ${imageSource === "url" ? "bg-white shadow-sm" : "text-ink/50"}`}
              >
                Image URL
              </button>
              <button
                type="button"
                onClick={() => setImageSource("upload")}
                className={`px-4 py-1.5 rounded-lg text-sm ${imageSource === "upload" ? "bg-white shadow-sm" : "text-ink/50"}`}
              >
                Upload from PC
              </button>
            </div>

            {imageSource === "url" ? (
              <input
                placeholder="https://..."
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
              />
            )}
          </div>

          <input
            placeholder="Link URL (optional)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="border border-ink/10 rounded-lg px-3 py-2 text-sm"
            >
              <option value="hero">Hero</option>
              <option value="promo">Promo</option>
              <option value="featured">Featured</option>
            </select>
            <input
              type="number"
              placeholder="Display order"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) })
              }
              className="border border-ink/10 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {form.image && (
            <div>
              <p className="text-sm font-medium text-ink mb-2">
                Image Focus Point
              </p>
              <p className="text-xs text-ink/40 mb-3">
                Choose which part of the image stays visible when cropped on
                different screens.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid grid-cols-3 gap-1 w-32">
                  {POSITION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, objectPosition: opt.value })
                      }
                      className={`aspect-square flex items-center justify-center text-sm rounded-lg border ${
                        form.objectPosition === opt.value
                          ? "bg-ink text-white border-ink"
                          : "border-ink/15 text-ink/40 hover:border-ink/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex-1 aspect-video sm:aspect-auto sm:h-24 rounded-lg overflow-hidden border border-ink/10">
                  <img
                    src={form.image}
                    alt="Preview"
                    style={{ objectPosition: form.objectPosition }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="bg-ink text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
            >
              {busy ? "Saving…" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(initialForm);
                setError("");
              }}
              className="border border-ink/10 px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-3 p-4 border-b border-ink/10">
          <input
            type="text"
            placeholder="Search banners by title…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="flex gap-2">
            <select
              value={positionFilter}
              onChange={(e) => {
                setPositionFilter(e.target.value);
                setPage(1);
              }}
              className="border border-ink/10 rounded-lg px-3 py-2 text-sm flex-1 lg:flex-none"
            >
              <option value="">All Positions</option>
              <option value="hero">Hero</option>
              <option value="promo">Promo</option>
              <option value="featured">Featured</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border border-ink/10 rounded-lg px-3 py-2 text-sm flex-1 lg:flex-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !paginated.length ? (
          <p className="text-center py-16 text-ink/50">
            No banners created yet.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40 uppercase text-xs">
                    <th className="py-3 px-4">Banner Preview</th>
                    <th>Title & Target</th>
                    <th>Position</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th className="pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((b) => (
                    <tr
                      key={b._id}
                      className="border-b border-ink/5 hover:bg-cream/30"
                    >
                      <td className="py-3 px-4">
                        <img
                          src={b.image}
                          alt=""
                          style={{
                            objectPosition: b.objectPosition || "center",
                          }}
                          className="w-24 aspect-video object-cover rounded-lg"
                        />
                      </td>
                      <td>
                        <p className="font-medium text-ink">{b.title}</p>
                        {b.link && (
                          <p className="text-xs text-ink/40">🔗 {b.link}</p>
                        )}
                      </td>
                      <td>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${positionBadge[b.position]}`}
                        >
                          {b.position}
                        </span>
                      </td>
                      <td>{b.order}</td>
                      <td>
                        <button
                          onClick={() => toggleStatus(b)}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${b.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-ink/50"}`}
                        >
                          {b.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="pr-4">
                        <button
                          onClick={() => setDeleteId(b._id)}
                          className="text-danger"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-ink/10">
              <p className="text-sm text-ink/50">
                Showing {(page - 1) * PER_PAGE + 1} to{" "}
                {Math.min(page * PER_PAGE, filtered.length)} of{" "}
                {filtered.length} banners
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-ink/10 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(0, 5)
                  .map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-lg text-sm ${page === n ? "bg-ink text-white" : "border border-ink/10 text-ink/60"}`}
                    >
                      {n}
                    </button>
                  ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-ink/10 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {deleteId && (
        <ConfirmModal
          message="Delete this banner?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </AdminLayout>
  );
}
