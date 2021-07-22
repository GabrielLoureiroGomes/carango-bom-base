import React, { useState } from "react";
import { useHistory } from "react-router";
import { TextField } from "@material-ui/core";

import { Auth } from "../../components";
import { signup } from "../../actions/auth";
import { minLength } from "../../utils/validations/validations";
import useFormValidations from "../../hooks/useFormValidations";

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

  return (
    <Auth
      auth={signup}
      user={{
        username,
        password,
      }}
      primaryButtonText="Cadastrar"
      secondaryButton={{
        onClick: cancel,
        name: "Cancelar",
      }}
      redirectTo="/login"
      shouldSubmit={shouldSubmit}
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
    </Auth>
  );
};

export default Signup;
