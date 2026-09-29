import { Routes, Route, Navigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import ProductList from "../pages/ProductList";
import ProductForm from "../pages/ProductForm";
import CategoryList from "../pages/CategoryList";
import BrandList from "../pages/BrandList";
import InventoryList from "../pages/InventoryList";
import OrderList from "../pages/OrderList";
import OrderDetails from "../pages/OrderDetails";
import CustomerList from "../pages/CustomerList";
import CouponList from "../pages/CouponList";
import PaymentList from "../pages/PaymentList";
import ReturnList from "../pages/ReturnList";
import ReviewList from "../pages/ReviewList";
import Analytics from "../pages/Analytics";
import Reports from "../pages/Reports";
import Notifications from "../pages/Notifications";
import BannerList from "../pages/BannerList";
import AdminUserList from "../pages/AdminUserList";
import ActivityLogs from "../pages/ActivityLogs";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";

function RequireAuth({ children }) {
  const { token, loading } = useAdminAuth();
  if (loading) return <div className="p-10">Loading…</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/products"
        element={
          <RequireAuth>
            <ProductList />
          </RequireAuth>
        }
      />
      <Route
        path="/products/add"
        element={
          <RequireAuth>
            <ProductForm />
          </RequireAuth>
        }
      />
      <Route
        path="/products/:id/edit"
        element={
          <RequireAuth>
            <ProductForm />
          </RequireAuth>
        }
      />
      <Route
        path="/categories"
        element={
          <RequireAuth>
            <CategoryList />
          </RequireAuth>
        }
      />
      <Route
        path="/brands"
        element={
          <RequireAuth>
            <BrandList />
          </RequireAuth>
        }
      />
      <Route
        path="/inventory"
        element={
          <RequireAuth>
            <InventoryList />
          </RequireAuth>
        }
      />
      <Route
        path="/orders"
        element={
          <RequireAuth>
            <OrderList />
          </RequireAuth>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <RequireAuth>
            <OrderDetails />
          </RequireAuth>
        }
      />
      <Route
        path="/customers"
        element={
          <RequireAuth>
            <CustomerList />
          </RequireAuth>
        }
      />
      <Route
        path="/coupons"
        element={
          <RequireAuth>
            <CouponList />
          </RequireAuth>
        }
      />
      <Route
        path="/payments"
        element={
          <RequireAuth>
            <PaymentList />
          </RequireAuth>
        }
      />
      <Route
        path="/returns"
        element={
          <RequireAuth>
            <ReturnList />
          </RequireAuth>
        }
      />
      <Route
        path="/reviews"
        element={
          <RequireAuth>
            <ReviewList />
          </RequireAuth>
        }
      />
      <Route
        path="/analytics"
        element={
          <RequireAuth>
            <Analytics />
          </RequireAuth>
        }
      />
      <Route
        path="/reports"
        element={
          <RequireAuth>
            <Reports />
          </RequireAuth>
        }
      />
      <Route
        path="/notifications"
        element={
          <RequireAuth>
            <Notifications />
          </RequireAuth>
        }
      />
      <Route
        path="/banners"
        element={
          <RequireAuth>
            <BannerList />
          </RequireAuth>
        }
      />
      <Route
        path="/admin-users"
        element={
          <RequireAuth>
            <AdminUserList />
          </RequireAuth>
        }
      />
      <Route
        path="/activity-logs"
        element={
          <RequireAuth>
            <ActivityLogs />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
