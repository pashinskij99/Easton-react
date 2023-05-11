import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Nav from "../navbar";
import { getUserInfo } from "../../store/auth";
import { getAccessToken } from "../../utils/cookie";

function Layout() {
  const dispatch = useDispatch();
  const token = getAccessToken();

  useEffect(() => {
    if (token) {
      dispatch(getUserInfo());
    }
  }, []);
  return (
    <Box>
      <Nav />
      <Box flexGrow={1} p="8px">
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
