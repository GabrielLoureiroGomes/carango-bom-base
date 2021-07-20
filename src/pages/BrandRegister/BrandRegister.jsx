import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useParams } from "react-router";
import { Button, TextField, Box } from "@material-ui/core";

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

  const [brand, setBrand] = useState("");

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
      if (id) {
        await BrandService.update({ id, brandName: brand });
        return history.goBack();
      }
      await BrandService.register({ brandName: brand });
      setBrand("");
      return history.goBack();
    } catch (e) {
      console.log(e);
    }
  }

  const loadBrandFromId = useCallback(async () => {
    if (id) {
      try {
        const updatedBrand = await BrandService.get(id);
        setBrand(updatedBrand.name);
      } catch (e) {
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
      />
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
          {id ? "Alterar" : "Cadastrar"}
        </Button>
      </Box>
    </form>
  );
}

export default BrandRegister;
