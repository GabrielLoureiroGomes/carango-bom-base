import React from "react";
import { useHistory } from "react-router";
import { TextField } from "@material-ui/core";

import { Auth } from "../../components";
import { signup } from "../../actions/auth";
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

  function cancel() {
    history.goBack();
  }

  return (
    <Auth
      auth={signup}
      primaryButtonText="Cadastrar"
      secondaryButton={{
        onClick: cancel,
        name: "Cancelar",
      }}
      redirectTo="/login"
      validations={validations}
      initialState={{
        password: "",
        username: "",
        confirmPassword: "",
      }}
    >
      {({
        validateFields,
        errors,
        state: { username, password, confirmPassword },
        setState,
      }) => {
        return (
          <>
            <TextField
              value={username}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  username: e.target.value,
                }))
              }
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
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
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
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  confirmPassword: e.target.value,
                }))
              }
              onBlur={validateFields}
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
          </>
        );
      }}
    </Auth>
  );
};

export default Signup;
