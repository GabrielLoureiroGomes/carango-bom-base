import React from "react";
import { useHistory } from "react-router-dom";
import {
  MenuItem,
  IconButton,
  Popper,
  Button,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
} from "@material-ui/core/";
import AccountCircle from "@material-ui/icons/AccountCircle";

import useStyles from "./styles";

const AuthNavigation = ({ auth, logout }) => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevState) => !prevState);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const shouldUseAriaControlName = open ? "menu-list-grow" : undefined;

  return auth ? (
    <div>
      <IconButton
        aria-label="account of current user"
        ref={anchorRef}
        aria-controls={shouldUseAriaControlName}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <AccountCircle />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={() => history.push("/alterar-senha")}>
                    Alterar senha
                  </MenuItem>
                  <MenuItem onClick={logout}>Sair</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  ) : (
    <Button onClick={() => history.push("/login")} className={classes.login}>
      Login
    </Button>
  );
};

export default AuthNavigation;
