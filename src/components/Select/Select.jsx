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
        {options.map(({ name: optionName, id: optionId }) => {
          return (
            <option value={optionId} key={optionId}>
              {optionName}
            </option>
          );
        })}
      </NativeSelect>
      {error ? <FormHelperText error>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default Select;
