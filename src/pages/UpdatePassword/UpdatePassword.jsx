import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  FormHelperText,
  Box,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import UserService from "../../services/UserService";

import { useAuth } from "../../hooks/AuthContext";
import useFormValidations from "../../hooks/useFormValidations";

const validations = {
  pastPassword: (value) => {
    if (value && value.length >= 6) {
      return { valid: true };
    }

    return { valid: false, text: "Senha deve ter ao menos 6 caracteres." };
  },
  newPassword: (value) => {
    if (value && value.length >= 6) {
      return { valid: true };
    }

    return { valid: false, text: "Senha deve ter ao menos 6 caracteres." };
  },
  confirmPassword: (value, formState) => {
    if (value === formState.newPassword) {
      return { valid: true };
    }
    return { valid: false, text: "As senhas não correspondem." };
  },
};

function UpdatePassword() {
  const { user } = useAuth();
  const history = useHistory();

  const [pastPassword, setPastPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState();

  const [errors, validateFields, shouldSubmit] = useFormValidations(
    validations,
    {
      pastPassword,
      newPassword,
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
      await UserService.updatePassword({
        id: user.id,
        pastPassword,
        newPassword,
      });
      return history.push("/");
    } catch (e) {
      // TODO: validar qual exatamente vai ser o retorno de um erro
      setError(e.data);
    }
  }

  return (
    <form>
      <Typography variant="h3">Alterar senha de usuário</Typography>
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
          value={pastPassword}
          onChange={(e) => setPastPassword(e.target.value)}
          onBlur={validateFields}
          helperText={errors.pastPassword.text}
          error={!errors.pastPassword.valid}
          name="pastPassword"
          id="pastPassword"
          label="Senha atual"
          type="password"
          variant="outlined"
          fullWidth
          required
          margin="normal"
        />
        <TextField
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onBlur={validateFields}
          helperText={errors.newPassword.text}
          error={!errors.newPassword.valid}
          name="newPassword"
          id="newPassword"
          label="Nova senha"
          type="password"
          variant="outlined"
          fullWidth
          required
          margin="normal"
        />
        <TextField
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={validateFields}
          helperText={errors.confirmPassword.text}
          error={!errors.confirmPassword.valid}
          name="confirmPassword"
          id="confirmPassword"
          label="Confirmação da nova senha"
          type="password"
          variant="outlined"
          fullWidth
          required
          margin="normal"
        />

        <FormHelperText error>{error}</FormHelperText>

        <Box marginTop={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={cancel}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={!shouldSubmit()}
            onClick={handleSubmit}
          >
            Enviar
          </Button>
        </Box>
      </Box>
    </form>
  );
}

export default UpdatePassword;
