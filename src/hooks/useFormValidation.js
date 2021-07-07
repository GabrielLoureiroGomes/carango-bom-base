import { useState } from "react";

function useFormValidations(validations, formState) {
  const initialState = createInitialState(validations);
  const [errors, setErrors] = useState(initialState);

  function validateFields(event) {
    const { name, value } = event.target;
    setErrors({
      ...errors,
      [name]: validations[name](value, formState),
    });
  }

  function shouldSubmit() {
    for (let field in errors) {
      if (!errors[field].valid) {
        return false;
      }
    }

    return true;
  }

  return [errors, validateFields, shouldSubmit];
}

function createInitialState(validations) {
  const initialState = {};
  for (let field in validations) {
    initialState[field] = { valid: true, text: "" };
  }

  return initialState;
}

export default useFormValidations;
