import { Navigate, Outlet, Route, Routes } from "react-router";
import { LoginPage, useAuth } from "../features/auth";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";

function ProtectedRoute() {
  const { session } = useAuth();
  return session ? <Outlet /> : <Navigate to="/login" replace />;
}

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
