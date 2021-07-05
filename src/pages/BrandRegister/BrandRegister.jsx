import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, TextField } from "@material-ui/core";

import useErrors from "../../hooks/useErrors";

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

  function submitBrand() {
    if (id) {
      BrandService.update({ id, nome: brand }).then(history.goBack);
      return;
    }

    BrandService.register({ nome: brand }).then(() => {
      setBrand("");
      history.goBack();
    });
  }

  useEffect(() => {
    if (id) {
      BrandService.get(id).then((brand) => setBrand(brand.nome));
    }
  }, [id]);

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
