import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import MobileBottomNav from "./components/common/MobileBottomNav";
import Preloader from "./components/common/Preloader";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./hooks/useAuth";

function Layout() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`bg-[#09090b] min-h-screen text-white ${token ? "has-bottom-nav" : ""}`}
    >
      {/* Luxury Preloader Overlay */}
      {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

      {/* Main Layout Content with Smooth Fade-in */}
      <div
        className={`transition-opacity duration-700 ${isLoading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <Navbar />
        <AppRoutes />
        {token && <Footer />}
        <ScrollToTop />
        <MobileBottomNav />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Layout />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
