import React, { useState } from "react";
import { useHistory } from "react-router";
import { Button, TextField, Typography } from "@material-ui/core";
import useErrors from "../../hooks/useFormValidation";
import UserService from "../../services/UserService";

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
  const [error, setError] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, validateFields, shouldSubmit] = useErrors(validations, {
    username,
    password,
    confirmPassword,
  });

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
      await UserService.signup({
        username,
        password,
      });
      return history.goBack();
    } catch (e) {
      // TODO: validar qual exatamente vai ser o retorno de um erro
      setError(e);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h3">Cadastro</Typography>
      <TextField
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
        onChange={(e) => setConfirmPassword(e.target.value)}
        onBlur={(e) => validateFields(e)}
        helperText={errors.confirmPassword.text}
        error={!errors.confirmPassword.valid}
        name="confirmPassword"
        id="confirmPassword"
        label="Confirmação da Senha"
        type="password"
        variant="outlined"
        fullWidth
        required
        margin="normal"
      />

      {error ? (
        <div style={{ margin: "15px 0" }}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </div>
      ) : null}

      <div style={{ display: "flex", gridGap: "15px", marginTop: 10 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!shouldSubmit()}
        >
          Cadastrar
        </Button>

        <Button variant="contained" color="secondary" onClick={cancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default Signup;
