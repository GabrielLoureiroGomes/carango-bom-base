import React from "react";
import { NavLink } from "react-router-dom";
import { Paper, MenuItem, MenuList } from "@material-ui/core/";

import { useStyles } from "./styles";

export const publicLinks = [
  { label: "Entrar", to: "/" },
  { label: "Veículos", to: "/veiculos" },
];

export const loggedLinks = [
  { label: "Marcas", to: "/marcas" },
  { label: "Usuários", to: "/usuarios" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Sair", to: "#" },
];

function NavBar({ userLogged }) {
  const classes = useStyles();

  const renderLink = (link) => (
    <MenuItem key={link.label} className={classes.item}>
      <NavLink
        to={link.to}
        className={classes.link}
        activeClassName={classes.linkActive}
      >
        {link.label}
      </NavLink>
    </MenuItem>
  );

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
