import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getOrders } from "../api/orderApi";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import EditProfileForm from "../components/profile/EditProfileForm";
import DeleteAccountModal from "../components/profile/DeleteAccountModal";
import FadeUp from "../components/animations/FadeUp";
import StaggerContainer, {
  staggerItemVariants,
} from "../components/animations/StaggerContainer";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    getOrders()
      .then((res) => setRecentOrders(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (!user) return null;

  const handleSaved = async () => {
    await refreshUser();
    setEditing(false);
  };

  const handleDeleted = () => {
    logout();
    navigate("/login");
  };

  return (
    <FadeUp>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <p className="text-xs tracking-widest uppercase text-accent mb-1">
          Member Portal
        </p>
        <h1 className="font-display text-4xl text-ink mb-8">
          Account Dashboard
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <ProfileSidebar />

          <div className="flex-1 space-y-6">
            <AnimatePresence mode="wait">
              {editing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <EditProfileForm
                    user={user}
                    onSaved={handleSaved}
                    onCancel={() => setEditing(false)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-ink/10 p-8"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-ink text-white flex items-center justify-center text-2xl">
                        {user.photo ? (
                          <img
                            src={user.photo}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.username?.[0]?.toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-display text-xl text-ink">
                          {user.username}
                        </p>
                        <p className="text-xs text-ink/40">
                          Client ID: #{user._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setEditing(true)}
                      className="bg-ink text-white text-xs uppercase tracking-widest px-4 py-2.5 hover:bg-ink/80 transition-colors"
                    >
                      ✎ Edit Profile
                    </motion.button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-ink/40 mb-1">Full name</p>
                      <p className="text-sm text-ink">{user.username}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink/40 mb-1">Email address</p>
                      <p className="text-sm text-ink">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink/40 mb-1">Phone number</p>
                      <p className="text-sm text-ink">
                        {user.phone || "Not added"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-ink/40 mb-1">Account type</p>
                      <p className="text-sm text-ink capitalize">{user.role}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white border border-ink/10 p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-ink">
                  Recent Activity
                </h2>
                <button
                  onClick={() => navigate("/orders")}
                  className="text-xs text-accent"
                >
                  View All Orders
                </button>
              </div>
              {recentOrders.length === 0 ? (
                <p className="text-sm text-ink/50">No orders yet.</p>
              ) : (
                <StaggerContainer className="space-y-3">
                  {recentOrders.map((order) => (
                    <motion.div
                      key={order._id}
                      variants={staggerItemVariants}
                      className="flex items-center justify-between bg-cream/50 p-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={order.orderItems[0]?.img}
                          alt=""
                          className="w-12 h-12 object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink truncate">
                            {order.orderItems[0]?.name}
                          </p>
                          <p className="text-xs text-ink/40">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-ink">
                          ${order.totalPrice}
                        </p>
                        <p className="text-xs text-ink/40">
                          {order.orderstatus}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </StaggerContainer>
              )}
            </div>

            <div className="border border-red-200 p-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600">Delete account</p>
                <p className="text-sm text-ink/50 mt-0.5">
                  Permanently remove your account and data
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-sm border border-red-200 text-red-600 px-4 py-2 hover:bg-red-50 transition-colors"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <DeleteAccountModal
            onClose={() => setShowDeleteModal(false)}
            onDeleted={handleDeleted}
          />
        )}
      </div>
    </FadeUp>
  );
}
