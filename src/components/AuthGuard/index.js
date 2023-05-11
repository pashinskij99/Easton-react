import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthGuard = ({ roles, children }) => {
  const auth = useSelector((state) => state.auth);

  if (!auth.user) {
    return null;
  }

  if (!auth.user || !roles.includes(auth.user.role)) {
    return <Navigate to="/not-enough-permission" />;
  }

  return (
    <>
      <Outlet />
      {children}
    </>
  );
};

export default AuthGuard;
