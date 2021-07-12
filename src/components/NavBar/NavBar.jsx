import React from "react";
import { NavLink } from "react-router-dom";
import { Paper, MenuItem, MenuList } from "@material-ui/core/";
import { useAuth } from "../../hooks/AuthContext";

import { useStyles } from "./styles";

function NavBar({ userLogged }) {
  const { dispatch } = useAuth();

  const publicLinks = [
    { label: "Login", to: "/login", hide: userLogged },
    { label: "Veículos", to: "/" },
  ];

  const loggedLinks = [
    { label: "Marcas", to: "/marcas" },
    { label: "Usuários", to: "/usuarios" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Alterar senha", to: "/alterar-senha" },
    {
      label: "Sair",
      to: "/",
      onClick: () => dispatch({ type: "logout" }),
    },
  ];
  const classes = useStyles();

  const renderLink = (link) => {
    return link.hide ? null : (
      <MenuItem key={link.label} className={classes.item}>
        <NavLink
          to={link.to}
          className={classes.link}
          activeClassName={classes.linkActive}
          onClick={link.onClick}
        >
          {link.label}
        </NavLink>
      </MenuItem>
    );
  };

  return (
    <Paper className={classes.container}>
      <MenuList>
        {publicLinks.map(renderLink)}
        {userLogged ? loggedLinks.map(renderLink) : null}
      </MenuList>
    </Paper>
  );
}

export default NavBar;
