import React from "react";
import {
  FormControl,
  InputLabel,
  NativeSelect,
  FormHelperText,
} from "@material-ui/core";

const Select = ({
  label,
  value,
  onChange,
  options,
  name,
  id,
  error,
  onBlur,
  helperText,
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel shrink htmlFor={id}>
        {label}
      </InputLabel>
      <NativeSelect
        value={value}
        onChange={onChange}
        inputProps={{
          name,
          id,
        }}
        error={error}
        required
      >
        <option aria-label="None" value="" />
        {options.map(({ nome: name, id }) => {
          return (
            <option value={id} key={id}>
              {name}
            </option>
          );
        })}
      </NativeSelect>
      {error ? <FormHelperText error>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default Select;
