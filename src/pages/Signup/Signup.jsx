import React, { useState } from "react";
import { useHistory } from "react-router";
import { Button, TextField, FormHelperText, Box } from "@material-ui/core";
import useFormValidations from "../../hooks/useFormValidations";
import { useAuth } from "../../hooks/AuthContext";
import { auth } from "../../actions/auth";
import { minLength } from "../../utils/validations/validations";

const validations = {
  username: (value) => {
    return minLength(3, "Usuário deve ter ao menos 3 letras.")(value);
  },
  password: (value) => {
    return minLength(6, "Senha deve ter ao menos 6 caracteres.")(value);
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
      await auth({
        user: {
          username,
          password,
        },
        dispatch,
        method: "signup",
      });
      return history.push("/");
    } catch (e) {
      // TODO: validar qual exatamente vai ser o retorno de um erro
      setError(e.data);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
