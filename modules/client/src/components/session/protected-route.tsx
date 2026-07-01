import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '@/store';

export function ProtectedRoute() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
}
