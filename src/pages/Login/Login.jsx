import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { Auth } from "../../components";
import { login } from "../../actions/auth";
import { useAuth } from "../../hooks/AuthContext";

function Login() {
  const history = useHistory();
  const { user } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) history.push("/");
  }, [user, history]);

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
      user={{
        username,
        password,
      }}
    >
      <TextField
        id="username"
        type="text"
        label="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        variant="outlined"
        required
      />
      <TextField
        id="password"
        type="password"
        label="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="outlined"
        required
      />
    </Auth>
  );
}

export default Login;
