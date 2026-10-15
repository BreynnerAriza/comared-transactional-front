import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}

export default App;
