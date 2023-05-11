import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../contexts/AuthContext";

const Unauthorized = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={location.state?.from || "/home"} replace />;
  }

  return <Outlet />;
};

export default Unauthorized;
