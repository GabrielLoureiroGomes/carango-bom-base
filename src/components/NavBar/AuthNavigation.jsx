import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { MenuItem, IconButton, Menu, Button } from "@material-ui/core/";
import AccountCircle from "@material-ui/icons/AccountCircle";

import useStyles from "./styles";

const AuthNavigation = ({ auth, logout }) => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return auth ? (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={logout}>Sair</MenuItem>
      </Menu>
    </div>
  ) : (
    <Button onClick={() => history.push("/login")} className={classes.login}>
      Login
    </Button>
  );
};

export default AuthNavigation;
