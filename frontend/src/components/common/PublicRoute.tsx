import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../../services/auth.service";

interface Props {
    children: React.ReactElement;
}

/**
 * Route guard for public routes (login, register).
 * If the user is already authenticated, redirects to dashboard.
 */
const PublicRoute: React.FC<Props> = ({ children }) => {
    const user = authService.getCurrentUser();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;