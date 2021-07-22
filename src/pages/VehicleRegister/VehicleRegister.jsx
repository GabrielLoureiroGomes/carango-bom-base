import React, { useEffect, useState, useCallback } from "react";
import { TextField, CircularProgress, InputAdornment } from "@material-ui/core";

import BrandService from "../../services/BrandService";
import VehicleService from "../../services/VehicleService";

import {
  composeValidators,
  validYear,
  required,
  onlyNumbers,
  minValue,
  minLength,
} from "../../utils/validations/validations";

import { Select, Register } from "../../components";

const validations = {
  model: (value) => {
    return minLength(2, "Modelo deve ter ao menos 2 letras.")(value);
  },
  year: (value) => {
    return composeValidators(required(), onlyNumbers(), validYear())(value);
  },
  price: (value) => {
    return composeValidators(required(), onlyNumbers(), minValue(1))(value);
  },
  brand: (value) => {
    return required("Selecione uma marca")(value);
  },
};

function VehicleRegister() {
  const [brands, setBrands] = useState([]);

  const loadBrands = useCallback(async () => {
    try {
      const data = await BrandService.getAll();
      return setBrands(data);
    } catch (e) {
      console.log(e.data);
    }
  }, [setBrands]);

  useEffect(loadBrands, [loadBrands]);

  const loadingInput = (status) => ({
    endAdornment: (
      <InputAdornment position="end">
        {status === "loading" ? <CircularProgress size={14} /> : <></>}
      </InputAdornment>
    ),
  });

  return (
    <Register
      service={VehicleService}
      validations={validations}
      redirectTo="/"
      initialState={{
        brandId: "",
        model: "",
        year: "",
        price: "",
      }}
    >
      {({
        state: { brandId, model, year, price },
        setState,
        validateFields,
        errors,
        status,
      }) => {
        return (
          <>
            <Select
              value={brandId}
              options={brands}
              name="brand"
              id="brand"
              label="Marca"
              onChange={(evt) => {
                validateFields(evt);
                const value = evt.target.value;
                setState((prevState) => ({
                  ...prevState,
                  brandId: value ? Number(value) : value,
                }));
              }}
              helperText={errors.brand.text}
              error={!errors.brand.valid}
            />
            <TextField
              value={model}
              onChange={(evt) =>
                setState((prevState) => ({
                  ...prevState,
                  model: evt.target.value,
                }))
              }
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
              InputProps={loadingInput(status)}
            />
            <TextField
              value={year}
              onChange={(evt) =>
                setState((prevState) => ({
                  ...prevState,
                  year: evt.target.value,
                }))
              }
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
              InputProps={loadingInput(status)}
            />
            <TextField
              value={price}
              onChange={(evt) =>
                setState((prevState) => ({
                  ...prevState,
                  price: Number(evt.target.value),
                }))
              }
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
              InputProps={loadingInput(status)}
            />
          </>
        );
      }}
    </Register>
  );
}

export default VehicleRegister;
