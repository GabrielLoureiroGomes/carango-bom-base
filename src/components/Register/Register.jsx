import React, { useState, useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import {
  Button,
  Box,
  FormHelperText,
  CircularProgress,
} from "@material-ui/core";

import useFormValidations from "../../hooks/useFormValidations";

const Register = ({
  children,
  validations,
  service,
  redirectTo,
  initialState,
}) => {
  const { id } = useParams();
  const history = useHistory();

  const [{ status, error }, setStatus] = useState({
    status: "idle",
    error: null,
  });
  const [state, setState] = useState(initialState);

  const [errors, validateFields, shouldSubmit] =
    useFormValidations(validations);
  const buttonText = id ? "Alterar" : "Cadastrar";

  function cancel() {
    history.goBack();
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (shouldSubmit()) {
      submitItem();
    }
  }

  async function submitItem() {
    try {
      setStatus({ status: "submitting" });
      if (id) {
        await service.update({ id: Number(id), ...state });
        setStatus({ status: "fulfilled" });
        return history.push(redirectTo);
      }
      await service.register(state);
      setStatus({ status: "fulfilled" });
      return history.push(redirectTo);
    } catch (e) {
      setStatus({
        status: "rejected",
        error: `Houve um problema ao ${id ? "alterar" : "registrar"}`,
      });
      console.log(e);
    }
  }

  const loadItemFromId = useCallback(async () => {
    if (id) {
      try {
        setStatus({ status: "loading" });
        const {
          id: dataId,
          createAt,
          updatedAt,
          ...data
        } = await service.get(id);
        setState(data);
        setStatus({ status: "fulfilled" });
      } catch (e) {
        setStatus({
          status: "rejected",
          error: "Houve um problema ao carregar",
        });
        console.log(e);
      }
    }
  }, [id, service]);

  useEffect(() => {
    loadItemFromId();
  }, [loadItemFromId]);

  return (
    <form onSubmit={handleSubmit}>
      {children({
        state,
        setState,
        errors,
        status,
        validateFields,
      })}

      {status === "rejected" ? (
        <FormHelperText error>{error}</FormHelperText>
      ) : null}

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
          {status === "submitting" ? (
            <CircularProgress size={14} />
          ) : (
            buttonText
          )}
        </Button>
      </Box>
    </form>
  );
};

export default Register;
