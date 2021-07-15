import React, { useState, useEffect } from "react";
import { Box, Button, FormHelperText, TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { useAuth } from "../../hooks/AuthContext";

import { auth } from "../../actions/auth";

function Login() {
  const history = useHistory();
  const { dispatch, user } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user) history.push("/");
  }, [user, history]);

  function handleRegister() {
    history.push("/cadastro");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(false);

    try {
      await auth({
        dispatch,
        user: { username, password },
        method: "auth",
      });
      return history.push("/");
    } catch {
      setError(true);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box
        border={1}
        borderColor="grey.500"
        borderRadius={16}
        padding={3}
        display="flex"
        flexDirection="column"
        gridGap={16}
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

        {error ? (
          <FormHelperText error>Usuário ou senha inválidos</FormHelperText>
        ) : null}

        <Box marginTop={2} display="flex" justifyContent="space-between">
          <Button variant="contained" onClick={handleRegister}>
            Cadastrar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Entrar
          </Button>
        </Box>
      </Box>
    </form>
  );
}

export default Login;
