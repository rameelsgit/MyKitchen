import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;
