import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const hasToken = !!localStorage.getItem("token");

  console.log(
    "ProtectedRoute check - Context:",
    isAuthenticated,
    "Token in storage:",
    hasToken,
  );

  console.log("ProtectedRoute:", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
