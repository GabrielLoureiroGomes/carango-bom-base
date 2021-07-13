import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useParams } from "react-router";
import { Button, TextField, Box, FormHelperText } from "@material-ui/core";
import { Select } from "../../components";
import useFormValidations from "../../hooks/useFormValidations";
import VehicleService from "../../services/VehicleService";
import BrandService from "../../services/BrandService";

const validations = {
  model: (value) => {
    if (value && value.length >= 2) {
      return { valid: true };
    }

    return { valid: false, text: "Modelo deve ter ao menos 2 letras." };
  },
  year: (value) => {
    const onlyNumbers = /^[0-9]+$/;
    if (!onlyNumbers.test(value)) {
      return { valid: false, text: "Insira apenas números" };
    }

    const emptyValue = !value || value === "";
    if (emptyValue) {
      return { valid: false, text: "Valor inválido" };
    }

    const currentYear = new Date().getFullYear();
    const invalidYears = value < 1920 || value > currentYear;
    if (invalidYears || value.length !== 4) {
      return { valid: false, text: "Ano inválido" };
    }

    return { valid: true };
  },
  price: (value) => {
    if (value <= 0 || !value || value === "") {
      return { valid: false, text: "Valor inválido" };
    }

    const onlyNumbers = /^[0-9]+$/;
    if (!onlyNumbers.test(value)) {
      return { valid: false, text: "Insira apenas números" };
    }

    return { valid: true };
  },
  brand: (value) => {
    if (value) return { valid: true };
    return { valid: false, text: "Selecione uma marca" };
  },
};

function VehicleRegister() {
  const { id } = useParams();
  const history = useHistory();

  const [brandId, setBrandId] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");
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
      setError("");
      if (id) {
        await VehicleService.update({
          id,
          model,
          year,
          price,
          brandId,
        });
        return history.push("/");
      }
      await VehicleService.register({
        model,
        year,
        price,
        brandId,
      });
      return history.push("/");
    } catch (e) {
      console.log(e);
      setError(e.data);
    }
  }

  const loadVehicleFromId = useCallback(async () => {
    if (id) {
      try {
        const {
          data: {
            model,
            year,
            price,
            brand: { id: brandId },
          },
        } = await VehicleService.get(id);
        setModel(model);
        setYear(year);
        setPrice(price);
        setBrandId(brandId);
      } catch (e) {
        setError(e.data);
        console.log(e);
      }
    }
  }, [id]);

  useEffect(() => {
    loadVehicleFromId();
  }, [loadVehicleFromId]);

  const loadBrands = useCallback(async () => {
    try {
      const brands = await BrandService.getAll();
      return setBrands(brands);
    } catch (e) {
      console.log(e);
      setError(e.data);
    }
  }, [setBrands]);

  useEffect(loadBrands, [loadBrands]);

  return (
    <form onSubmit={handleSubmit}>
      <Select
        value={brandId}
        options={brands}
        name="brand"
        id="brand"
        label="Marca"
        onChange={(evt) => {
          validateFields(evt);
          setBrandId(evt.target.value);
        }}
        helperText={errors.brand.text}
        error={!errors.brand.valid}
      />
      <TextField
        value={model}
        onChange={(evt) => setModel(evt.target.value)}
        onBlur={validateFields}
        helperText={errors.model.text}
        error={!errors.model.valid}
        name="model"
        id="model"
        label="Modelo"
        type="text"
        variant="outlined"
        fullWidth
        required
        margin="normal"
      />
      <TextField
        value={year}
        onChange={(evt) => setYear(evt.target.value)}
        onBlur={validateFields}
        helperText={errors.year.text}
        error={!errors.year.valid}
        name="year"
        id="year"
        label="Ano"
        type="number"
        variant="outlined"
        fullWidth
        required
        margin="normal"
      />
      <TextField
        value={price}
        onChange={(evt) => setPrice(evt.target.value)}
        onBlur={validateFields}
        helperText={errors.price.text}
        error={!errors.price.valid}
        name="price"
        id="price"
        label="Valor"
        type="number"
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
          {id ? "Alterar" : "Cadastrar"}
        </Button>
      </Box>
    </form>
  );
}

export default VehicleRegister;
