import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRoles }) => {
  // 1. Get user and token from local storage
  const userString = localStorage.getItem("user");
  const token = localStorage.getItem("token"); // Verify the token exists
  const user = userString ? JSON.parse(userString) : null;

  // 2. If no user or no token, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // 3. If the role is not allowed, redirect to a safe page (e.g., unauthorized)
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. If using nested routes in AppRoutes, use <Outlet />.
  // Otherwise, if passing children, return children.
  return <Outlet />;
};

export default RoleRoute;
