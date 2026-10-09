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
  return (
    <div className={token ? "has-bottom-nav" : ""}>
      <Navbar />
      <AppRoutes />
      {token && <Footer />}
      <ScrollToTop />
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <>
      {/* Intro preloader: plays on each full page load, removes itself when done */}
      <Preloader />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Layout />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </>
  );
}
