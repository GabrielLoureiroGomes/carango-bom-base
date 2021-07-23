import React from "react";
import { TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { Auth } from "../../components";
import { login } from "../../actions/auth";

function Login({ user, dispatch }) {
  const history = useHistory();

  function handleRegister() {
    history.push("/cadastro");
  }

  return (
    <Auth
      auth={login}
      primaryButtonText="Entrar"
      secondaryButton={{
        onClick: handleRegister,
        name: "Cadastrar",
      }}
      redirectTo="/"
      dispatch={dispatch}
      initialState={{
        username: "",
        password: "",
      }}
      user={user}
    >
      {({ state: { username, password }, setState }) => {
        return (
          <>
            <TextField
              id="username"
              type="text"
              label="Usuário"
              value={username}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  username: e.target.value,
                }))
              }
              variant="outlined"
              required
            />
            <TextField
              id="password"
              type="password"
              label="Senha"
              value={password}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
              variant="outlined"
              required
            />
          </>
        );
      }}
    </Auth>
  );
}

export default Login;
