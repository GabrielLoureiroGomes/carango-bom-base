import React from "react";
import { useLocation } from "react-router-dom";
import { AppBar, Toolbar, Box, Typography } from "@material-ui/core/";

import AuthNavigation from "./AuthNavigation";
import Sidebar from "./Sidebar";
import { useAuth } from "../../hooks/AuthContext";
import { getLocationLabel } from "../../utils/links";

function NavBar() {
  const { dispatch, user } = useAuth();
  const location = useLocation();
  const auth = Boolean(user);

  return (
    <AppBar position="relative">
      <Toolbar>
        <Box display="flex" justifyContent="space-between" flexGrow="1">
          <Box display="flex" alignItems="center">
            <Sidebar auth={auth} />
            <Typography variant="h6" component="h1">
              {getLocationLabel(location)}
            </Typography>
          </Box>
          <AuthNavigation
            auth={auth}
            logout={() => dispatch({ type: "logout" })}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
