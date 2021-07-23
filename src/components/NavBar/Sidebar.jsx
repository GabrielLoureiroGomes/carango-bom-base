import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import links from "../../utils/links";
import useStyles from "./styles";

const Sidebar = ({ auth }) => {
  const [isOpen, toggle] = useState(false);
  const classes = useStyles();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    toggle(open);
  };

  const item = ({ Icon, label, to }) => (
    <NavLink
      to={to}
      exact
      className={classes.link}
      activeClassName={classes.linkActive}
      key={label}
    >
      <ListItem button>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        {label}
      </ListItem>
    </NavLink>
  );

  return (
    <>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {links.map(({ isPublic, ...link }) => {
              const component = item(link);
              return isPublic ? component : auth && component;
            })}
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default Sidebar;
