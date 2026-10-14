import { Navigate, Outlet, Route, Routes } from "react-router";
import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import { useAuth } from "../shared/hooks/useAuth";

/** Solo para usuarios autenticados; si no hay sesión envía al login. */
function ProtectedRoute() {
  const { session } = useAuth();
  return session ? <Outlet /> : <Navigate to="/login" replace />;
}

/** Solo para visitantes; si ya hay sesión envía al dashboard. */
function PublicOnlyRoute() {
  const { session } = useAuth();
  return session ? <Navigate to="/" replace /> : <Outlet />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
