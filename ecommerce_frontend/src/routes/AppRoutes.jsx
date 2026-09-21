import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Home from "../pages/Home";
import ProductPage from "../pages/ProductPage";
import ProductPageDetail from "../pages/ProductPageDetail";
import CategoryPage from "../pages/CategoryPage";
import CartPage from "../pages/CartPage";
import WishlistPage from "../pages/WishlistPage";
import AddressPage from "../pages/AddressPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center text-ink/50 font-display italic">
      loading…
    </div>
  );
}

function RequireAuth({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function RedirectIfAuth({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (token) return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfAuth>
            <Login />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfAuth>
            <Register />
          </RedirectIfAuth>
        }
      />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route
        path="/shop"
        element={
          <RequireAuth>
            <ProductPage />
          </RequireAuth>
        }
      />
      <Route
        path="/categories"
        element={
          <RequireAuth>
            <CategoryPage />
          </RequireAuth>
        }
      />
      <Route
        path="/product/:id"
        element={
          <RequireAuth>
            <ProductPageDetail />
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
      <Route
        path="/cart"
        element={
          <RequireAuth>
            <CartPage />
          </RequireAuth>
        }
      />
      <Route
        path="/wishlist"
        element={
          <RequireAuth>
            <WishlistPage />
          </RequireAuth>
        }
      />
      <Route
        path="/addresses"
        element={
          <RequireAuth>
            <AddressPage />
          </RequireAuth>
        }
      />
      <Route
        path="/checkout"
        element={
          <RequireAuth>
            <CheckoutPage />
          </RequireAuth>
        }
      />
      <Route
        path="/orders"
        element={
          <RequireAuth>
            <OrderHistoryPage />
          </RequireAuth>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <RequireAuth>
            <OrderDetailsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/order-success/:id"
        element={
          <RequireAuth>
            <OrderSuccessPage />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
