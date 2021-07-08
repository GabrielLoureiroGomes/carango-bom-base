import React from "react";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import { Container, CssBaseline, makeStyles } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import { ptBR } from "@material-ui/core/locale";

import "./assets/App.css";

import { AuthProvider, useAuth } from "./hooks/AuthContext";
import { BrandRegister, BrandList, Login, Signup } from "./pages";
import { NavBar } from "./components";

const muiTheme = createMuiTheme(
  {
    palette: {
      primary: {
        main: blue[900],
      },
    },
  },
  ptBR
);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

function AppContainer() {
  const { state: user } = useAuth();
  return (
    <Container component="article" maxWidth="md">
      <NavBar userLogged={!!user} />
      <Switch>
        {!!user ? (
          <Switch>
            <Route path="/marca/cadastro">
              <BrandRegister />
            </Route>
            <Route path="/marca/:id">
              <BrandRegister />
            </Route>
            <Route path="/marca">
              <BrandList />
            </Route>
          </Switch>
        ) : null}
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/cadastro">
          <Signup />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Container>
  );
}

function App() {
  const classes = useStyles();

  return (
    <AuthProvider>
      <Router>
        <ThemeProvider theme={muiTheme}>
          <div className={classes.root}>
            <CssBaseline />
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <AppContainer />
            </main>
          </div>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
