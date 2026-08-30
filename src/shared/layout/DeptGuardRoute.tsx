import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { UserRole } from '@/features/auth/types';

interface DeptGuardRouteProps {
  allowedRoles?: UserRole[]; // omit to allow any authenticated user
  excludeRoles?: UserRole[]; // roles explicitly denied even if allowedRoles would otherwise permit them
}

export function DeptGuardRoute({ allowedRoles, excludeRoles }: DeptGuardRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (excludeRoles && excludeRoles.includes(user.role)) {
    return <Navigate to="/approvals" replace />;
  }

  return <Outlet />;
}
