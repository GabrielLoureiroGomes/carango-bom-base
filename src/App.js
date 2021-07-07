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

function App() {
  const classes = useStyles();

  return (
    <Router>
      <ThemeProvider theme={muiTheme}>
        <div className={classes.root}>
          <CssBaseline />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Container component="article" maxWidth="md">
              <NavBar />
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
                <Route exact path="/">
                  <Login />
                </Route>
                <Route exact path="/cadastro">
                  <Signup />
                </Route>
                <Redirect to="/" />
              </Switch>
            </Container>
          </main>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
