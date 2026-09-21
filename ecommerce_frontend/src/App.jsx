import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./hooks/useAuth";

function Layout() {
  const { token } = useAuth();
  return (
    <>
      <Navbar />
      <AppRoutes />
      {token && <Footer />}
      <ScrollToTop />
    </>
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
