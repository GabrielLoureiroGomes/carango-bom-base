import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useParams } from "react-router";
import {
  Button,
  TextField,
  Box,
  FormHelperText,
  CircularProgress,
  InputAdornment,
} from "@material-ui/core";

import useFormValidations from "../../hooks/useFormValidations";
import BrandService from "../../services/BrandService";
import { minLength } from "../../utils/validations/validations";

const validations = {
  brand: (value) => {
    return minLength(3, "Marca deve ter ao menos 3 letras.")(value);
  },
};

function BrandRegister() {
  const { id } = useParams();
  const history = useHistory();

  const buttonText = id ? "Alterar" : "Cadastrar";
  const [brand, setBrand] = useState("");
  const [{ status, error }, setStatus] = useState({
    status: "idle",
    error: null,
  });
  const [errors, validateFields, shouldSubmit] =
    useFormValidations(validations);

  function cancel() {
    history.goBack();
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (shouldSubmit()) {
      submitBrand();
    }
  }

  async function submitBrand() {
    try {
      setStatus({ status: "submitting" });
      if (id) {
        await BrandService.update({ id, brandName: brand });
        setStatus({ status: "fulfilled" });
        return history.push("/marcas");
      }
      await BrandService.register({ brandName: brand });
      setBrand("");
      setStatus({ status: "fulfilled" });
      return history.push("/marcas");
    } catch (e) {
      setStatus({
        status: "rejected",
        error: `Houve um problema ao ${id ? "alterar" : "registrar"} a marca`,
      });
      console.log(e);
    }
  }

  const loadBrandFromId = useCallback(async () => {
    if (id) {
      try {
        setStatus({ status: "loading" });
        const updatedBrand = await BrandService.get(id);
        setBrand(updatedBrand.name);
        setStatus({ status: "fulfilled" });
      } catch (e) {
        setStatus({
          status: "rejected",
          error: "Houve um problema ao buscar a marca",
        });
        console.log(e);
      }
    }
  }, [id]);

  useEffect(() => {
    loadBrandFromId();
  }, [loadBrandFromId]);

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        value={brand}
        onChange={(evt) => setBrand(evt.target.value)}
        onBlur={validateFields}
        helperText={errors.brand.text}
        error={!errors.brand.valid}
        name="brand"
        id="brand"
        label="Marca"
        type="text"
        variant="outlined"
        fullWidth
        required
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {status === "loading" ? <CircularProgress size={14} /> : <></>}
            </InputAdornment>
          ),
        }}
      />

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
}

export default BrandRegister;
