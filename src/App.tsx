import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "./features/auth";
import { AppRoutes } from "./routes/AppRoutes";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}
