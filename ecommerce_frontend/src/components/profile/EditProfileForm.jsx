import { useState } from "react";
import { updateProfile } from "../../api/authApi";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditProfileForm({ user, onSaved, onCancel }) {
  const [username, setUsername] = useState(user.username);
  const [phone, setPhone] = useState(user.phone || "");
  const [photo, setPhoto] = useState(user.photo || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      return;
    }
    setPhoto(await fileToBase64(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await updateProfile({ username, phone, photo });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-ink/10 p-8 space-y-5"
    >
      {error && (
        <p className="text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-ink text-white flex items-center justify-center text-2xl flex-shrink-0">
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            username?.[0]?.toUpperCase()
          )}
        </div>
        <label className="text-sm text-accent underline cursor-pointer">
          Change photo
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </label>
      </div>

      <div>
        <label className="text-sm text-ink/70">Full name</label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full border border-ink/15 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div>
        <label className="text-sm text-ink/70">Email address</label>
        <input
          type="email"
          disabled
          value={user.email}
          className="mt-1 w-full border border-ink/10 bg-cream/50 px-3 py-2 text-ink/50"
        />
      </div>

      <div>
        <label className="text-sm text-ink/70">Phone number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full border border-ink/15 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="bg-ink text-white px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-ink/80 transition-colors disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-ink/15 text-xs uppercase tracking-widest hover:border-ink/30 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
