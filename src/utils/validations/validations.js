export const required = (helperText) => (value) => {
  const isEmptyValue =
    typeof value !== "undefined" && value !== null
      ? !value.toString().trim().length
      : true;

  if (isEmptyValue)
    return { valid: false, text: helperText || "Esse campo é obrigatório" };

  return { valid: true };
};

export const onlyNumbers = (helperText) => (value) => {
  const onlyNumbersRegex = /^[0-9]+$/;
  const onlyHasNumbers = onlyNumbersRegex.test(value);

  if (onlyHasNumbers) return { valid: true };

  return { valid: false, text: helperText || "Insira apenas números" };
};

export const validYear = (helperText) => (value) => {
  const year = Number(value);
  const currentYear = new Date().getFullYear();
  const yearTooOld = year < 1920;
  const yearIntoTheFuture = year > currentYear;

  if (yearTooOld || yearIntoTheFuture) {
    return { valid: false, text: helperText || "Ano inválido" };
  }

  return { valid: true };
};

export const minLength = (minExpected, helperText) => (value) => {
  const parsedMinExpected = Number(minExpected);
  if (Number.isNaN(parsedMinExpected)) {
    throw new Error("O mínimo esperado não é um número válido");
  }

  const hasExpectedLength = value.toString().length >= parsedMinExpected;
  if (hasExpectedLength) return { valid: true };

  return { valid: false, text: helperText || "Muito curto" };
};

export const minValue = (minExpected, helperText) => (value) => {
  const parsedMinExpected = Number(minExpected);
  if (Number.isNaN(parsedMinExpected)) {
    throw new Error("O mínimo esperado não é um número válido");
  }

  const aboveMin = Number(value) >= parsedMinExpected;
  if (aboveMin) return { valid: true };

  return { valid: false, text: helperText || "Valor mínimo não atingido" };
};

export const composeValidators =
  (...validators) =>
  (value) => {
    const validationError = validators.reduce((error, validator) => {
      const validation = validator(value);
      const isValid = validation.valid;
      if (!isValid && !error) return validation;
      return error;
    }, undefined);
    return validationError || { valid: true };
  };
