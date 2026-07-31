import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

export default function ProtectedRoute() {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
