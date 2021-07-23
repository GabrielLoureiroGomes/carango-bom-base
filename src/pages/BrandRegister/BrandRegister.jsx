import React from "react";
import { TextField, CircularProgress, InputAdornment } from "@material-ui/core";

import { Register } from "../../components";
import BrandService from "../../services/BrandService";
import { minLength } from "../../utils/validations/validations";

const validations = {
  name: (value) => {
    return minLength(3, "Marca deve ter ao menos 3 letras.")(value);
  },
};

function BrandRegister({ dispatch }) {
  return (
    <Register
      service={BrandService}
      validations={validations}
      redirectTo="/marcas"
      initialState={{
        name: "",
      }}
      dispatch={dispatch}
    >
      {({ state: { name }, setState, validateFields, errors, status }) => {
        return (
          <TextField
            value={name}
            onChange={(evt) => setState({ name: evt.target.value })}
            onBlur={validateFields}
            helperText={errors.name.text}
            error={!errors.name.valid}
            name="name"
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
                  {status === "loading" ? (
                    <CircularProgress size={14} />
                  ) : (
                    <></>
                  )}
                </InputAdornment>
              ),
            }}
          />
        );
      }}
    </Register>
  );
}

export default BrandRegister;
