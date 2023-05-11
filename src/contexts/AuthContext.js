import React, { createContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { login, signup } from "../store/auth";
import { removeAccessToken, removeUserId } from "../utils/cookie";

export const AuthContext = createContext(null);

export default function useAuth() {
  return React.useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleLogin = async (payload) => {
    dispatch(login(payload));
  };

  const handleSignUp = async (payload) => {
    dispatch(signup(payload));
  };

  const handleLogout = () => {
    removeAccessToken();
    removeUserId();
    window.location.href = "/login";
  };

  const value = {
    isAuthenticated: !!auth.user,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onSignUp: handleSignUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
