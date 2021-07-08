import React, { useState } from "react";
import { useHistory } from "react-router";
import {
  Button,
  TextField,
  Typography,
  FormHelperText,
  Box,
} from "@material-ui/core";
import useFormValidations from "../../hooks/useFormValidations";
import { useAuth } from "../../hooks/AuthContext";
import { signup } from "../../actions/auth";

const validations = {
  username: (value) => {
    if (value && value.length >= 3) {
      return { valid: true };
    }

    return { valid: false, text: "Usuário deve ter ao menos 3 letras." };
  },
  password: (value) => {
    if (value && value.length >= 6) {
      return { valid: true };
    }

    return { valid: false, text: "Senha deve ter ao menos 6 caracteres." };
  },
  confirmPassword: (value, formState) => {
    if (value === formState.password) {
      return { valid: true };
    }
    return { valid: false, text: "As senhas não correspondem." };
  },
};

const Signup = () => {
  const history = useHistory();
  const { dispatch } = useAuth();
  const [error, setError] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, validateFields, shouldSubmit] = useFormValidations(
    validations,
    {
      username,
      password,
      confirmPassword,
    }
  );

  function cancel() {
    history.goBack();
  }

  function handleSubmit(event) {
    setError();
    event.preventDefault();
    if (shouldSubmit()) {
      submitUser();
    }
  }

  async function submitUser() {
    try {
      await signup({
        user: {
          username,
          password,
        },
        dispatch,
      });
      return history.push("/");
    } catch (e) {
      // TODO: validar qual exatamente vai ser o retorno de um erro
      setError(e.data);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h3">Cadastro</Typography>
      <Box
        border={1}
        borderColor="grey.500"
        borderRadius={16}
        padding={3}
        marginTop={2}
        display="flex"
        flexDirection="column"
        gridGap={16}
      >
        <TextField
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={validateFields}
          helperText={errors.username.text}
          error={!errors.username.valid}
          name="username"
          id="username"
          label="Usuário"
          type="text"
          variant="outlined"
          fullWidth
          required
          margin="normal"
        />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={validateFields}
          helperText={errors.password.text}
          error={!errors.password.valid}
          name="password"
          id="password"
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          required
          margin="normal"
        />
        <TextField
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={(e) => validateFields(e)}
          helperText={errors.confirmPassword.text}
          error={!errors.confirmPassword.valid}
          name="confirmPassword"
          id="confirmPassword"
          label="Confirmação da senha"
          type="password"
          variant="outlined"
          fullWidth
          required
          margin="normal"
        />

        {error ? <FormHelperText error>{error}</FormHelperText> : null}

        <Box marginTop={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={cancel}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={!shouldSubmit()}
          >
            Cadastrar
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default Signup;
