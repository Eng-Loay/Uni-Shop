/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const AuthGuard = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  // Show nothing while checking authentication status
  if (loading) {
    return null;
  }

  // If user is not authenticated and this route requires authentication
  if (!isAuthenticated && allowedRoles.length > 0) {
    // Redirect to login page, but save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have the required role
  if (
    isAuthenticated &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(userRole)
  ) {
    // Redirect to home page or unauthorized page
    return <Navigate to="/" replace />;
  }

  // If everything is fine, render the children
  return children;
};

export const NoAuthGuard = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  // Special case: If we're on the login pages, don't redirect
  // This allows the success overlay to be shown even after authentication
  if (location.pathname === "/loginlibrary" || location.pathname === "/login") {
    return children;
  }

  // If the user is already authenticated, redirect based on their role
  if (isAuthenticated) {
    switch (userRole) {
      case "library":
        return <Navigate to="/minidrawer/home" replace />;
      case "admin":
        return <Navigate to="/adminedrawer/adminDashboard" replace />;
      case "student":
        return <Navigate to="/productshome" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // If not authenticated, render the children (login/signup pages)
  return children;
};

export const RoleBasedGuard = ({
  children,
  requiredRole,
  redirectPath = "/",
}) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  // Show nothing while checking authentication status
  if (loading) {
    return null;
  }

  // If not authenticated or doesn't have required role
  if (!isAuthenticated || userRole !== requiredRole) {
    return <Navigate to={redirectPath} replace />;
  }

  // If authorized, render the children
  return children;
};
