import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useParams } from "react-router";
import { Button, TextField } from "@material-ui/core";

import useErrors from "../../hooks/useFormValidation";

import BrandService from "../../services/BrandService";

const validations = {
  brand: (value) => {
    if (value && value.length >= 3) {
      return { valid: true };
    }

    return { valid: false, text: "Marca deve ter ao menos 3 letras." };
  },
};

function BrandRegister() {
  const { id } = useParams();
  const history = useHistory();

  const [brand, setBrand] = useState("");

  const [errors, validateFields, shouldSubmit] = useErrors(validations);

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
        await BrandService.update({ id, nome: brand });
        return history.goBack();
      }
      await BrandService.register({ nome: brand });
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
        setBrand(updatedBrand.nome);
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
        label="Brand"
        type="text"
        variant="outlined"
        fullWidth
        required
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={!shouldSubmit()}
      >
        {id ? "Alterar" : "Cadastrar"}
      </Button>

      <Button variant="contained" color="secondary" onClick={cancel}>
        Cancelar
      </Button>
    </form>
  );
}

export default BrandRegister;
