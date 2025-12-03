import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../../services/auth.service";

interface Props {
  children: React.ReactElement;
  /**
   * Allowed role_id.
   * If not provided, only checks if the user is authenticated.
   */
  allowedRoles?: number[];
}

/**
 * Simple route guard that checks if user is authenticated
 * and (optionally) if the user's role is allowed.
 * Backend still enforces privileges; this is just UX.
 */
const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const user = authService.getCurrentUser();

  if (!user) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // role_id comes from the backend as-is in the login response
  const roleId = (user as any).role_id ?? (user as any).roleId;

  if (allowedRoles && !allowedRoles.includes(roleId)) {
    // Authenticated but without a role allowed for this view
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
