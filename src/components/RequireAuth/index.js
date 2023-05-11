import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo, selectIsAuthLoading, selectUser } from "../../store/auth";
import { CircularProgress, Center } from "@chakra-ui/react";
import { getAccessToken } from "../../utils/cookie";

const RequireAuth = () => {
  const token = getAccessToken();

  const dispatch = useDispatch();
  const isAuthLoading = useSelector(selectIsAuthLoading);
  const user = useSelector(selectUser);
  const location = useLocation();

  useEffect(() => {
    if (token) {
      dispatch(getUserInfo());
    }
  }, []);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isAuthLoading || !user) {
    return (
      <Center>
        <CircularProgress isIndeterminate />
      </Center>
    );
  }

  return <Outlet />;
};

export default RequireAuth;
