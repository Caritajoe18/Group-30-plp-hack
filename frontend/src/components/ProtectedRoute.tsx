import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode; // ✅ Use React.ReactNode instead of JSX.Element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
