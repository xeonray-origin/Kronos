import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '@/store';

export function PublicRoute() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
