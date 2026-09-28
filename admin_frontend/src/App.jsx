import { AdminAuthProvider } from "./context/AdminAuthContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <AdminAuthProvider>
      <AppRoutes />
    </AdminAuthProvider>
  );
}
