import { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { updateAdminProfile, changePassword } from "../api/authApi";

export default function Profile() {
  const { admin } = useAdminAuth();
  const [form, setForm] = useState({
    username: admin?.username || "",
    phone: admin?.phone || "",
  });
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "" });
  const [msg, setMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await updateAdminProfile(form);
      setMsg("Profile updated ✅");
    } catch (err) {
      setMsg(err.message);
    }
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwMsg("");
    try {
      await changePassword(pwForm);
      setPwMsg("Password changed ✅");
      setPwForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setPwMsg(err.message);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-5">Admin Profile</h1>
      <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
        <form
          onSubmit={handleProfileSubmit}
          className="bg-white border border-ink/10 rounded p-5 space-y-3"
        >
          <p className="font-medium">Profile Info</p>
          {msg && <p className="text-sm text-green-600">{msg}</p>}
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Username"
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone"
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <p className="text-xs text-ink/40">Email: {admin?.email}</p>
          <button
            type="submit"
            className="bg-ink text-white px-4 py-2 rounded text-sm"
          >
            Save
          </button>
        </form>

        <form
          onSubmit={handlePwSubmit}
          className="bg-white border border-ink/10 rounded p-5 space-y-3"
        >
          <p className="font-medium">Change Password</p>
          {pwMsg && (
            <p
              className={`text-sm ${pwMsg.includes("✅") ? "text-green-600" : "text-danger"}`}
            >
              {pwMsg}
            </p>
          )}
          <input
            type="password"
            required
            value={pwForm.oldPassword}
            onChange={(e) =>
              setPwForm({ ...pwForm, oldPassword: e.target.value })
            }
            placeholder="Old Password"
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            value={pwForm.newPassword}
            onChange={(e) =>
              setPwForm({ ...pwForm, newPassword: e.target.value })
            }
            placeholder="New Password"
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-ink text-white px-4 py-2 rounded text-sm"
          >
            Change Password
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
