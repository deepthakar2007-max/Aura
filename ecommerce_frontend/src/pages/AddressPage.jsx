import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../api/addressApi";
import AddressForm from "../components/address/AddressForm";
import AddressList from "../components/address/AddressList";
import FadeUp from "../components/animations/FadeUp";
import AnimatedButton from "../components/animations/AnimatedButton";

export default function AddressPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [error, setError] = useState("");

  const loadAddresses = () => {
    setLoading(true);
    getAddresses(user._id)
      .then((res) => setAddresses(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) loadAddresses();
  }, [user]);

  const handleAdd = async (formData) => {
    await addAddress({ ...formData, user: user._id });
    setShowForm(false);
    loadAddresses();
  };

  const handleUpdate = async (formData) => {
    await updateAddress(editingAddress._id, formData);
    setEditingAddress(null);
    loadAddresses();
  };

  const handleEditClick = (addr) => {
    setShowForm(false);
    setEditingAddress(addr);
  };

  const handleDelete = async (id) => {
    await deleteAddress(id);
    loadAddresses();
  };

  return (
    <FadeUp>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-brandDark">
            Your addresses
          </h1>
          {!showForm && !editingAddress && (
            <AnimatedButton
              onClick={() => setShowForm(true)}
              className="text-sm bg-brandDark text-paper px-4 py-2 rounded-lg hover:bg-brand transition-colors"
            >
              + Add new
            </AnimatedButton>
          )}
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <AddressForm
                onSubmit={handleAdd}
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          )}

          {editingAddress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <h2 className="text-sm text-ink/60 mb-2">Editing address</h2>
              <AddressForm
                initialValues={editingAddress}
                onSubmit={handleUpdate}
                onCancel={() => setEditingAddress(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <p className="text-ink/50">Loading…</p>
        ) : (
          <AddressList
            addresses={addresses}
            onDelete={handleDelete}
            onEdit={handleEditClick}
          />
        )}
      </div>
    </FadeUp>
  );
}
