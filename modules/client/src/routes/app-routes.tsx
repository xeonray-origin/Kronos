import { Route, Routes } from 'react-router';
import { ProtectedRoute, PublicRoute, SessionGuard } from '@/components/session';
import { AppLayout, AuthLayout } from '@/layouts';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<SessionGuard />}>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<AuthLayout />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<AppLayout />} />
        </Route>
      </Route>
    </Routes>
  );
}
