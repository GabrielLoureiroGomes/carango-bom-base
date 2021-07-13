import {
  required,
  onlyNumbers,
  validYear,
  composeValidators,
  minValue,
  minLength,
} from "./validations";

describe("Validations", () => {
  const valid = { valid: true };
  describe("required", () => {
    const invalid = { valid: false, text: "Esse campo é obrigatório" };
    test.each([
      ["", invalid],
      [" ", invalid],
      [null, invalid],
      [undefined, invalid],
      [0, valid],
      ["teste", valid],
    ])("required %s should return %s", (state, expected) => {
      expect(required()(state)).toStrictEqual(expected);
    });

    it("should return a custom error message", () => {
      const errorMsg = "O preenchimento desse campo é obrigatório";
      expect(required(errorMsg)("")).toStrictEqual({
        valid: false,
        text: errorMsg,
      });
    });
  });
  describe("onlyNumbers", () => {
    const invalid = { valid: false, text: "Insira apenas números" };
    test.each([
      ["", invalid],
      [" ", invalid],
      [null, invalid],
      [undefined, invalid],
      [0, valid],
      ["teste", invalid],
      [203, valid],
      ["55", valid],
    ])("onlyNumbers %s should return %s", (state, expected) => {
      expect(onlyNumbers()(state)).toStrictEqual(expected);
    });

    it("should return a custom error message", () => {
      const errorMsg = "Preencha apenas números";
      expect(onlyNumbers(errorMsg)("teste")).toStrictEqual({
        valid: false,
        text: errorMsg,
      });
    });
  });
  describe("validYear", () => {
    const invalid = { valid: false, text: "Ano inválido" };
    test.each([
      ["", invalid],
      [" ", invalid],
      [null, invalid],
      [0, invalid],
      [203, invalid],
      ["55", invalid],
      ["2035", invalid],
      [2132, invalid],
      ["2021", valid],
      [2005, valid],
      [1920, valid],
      ["1910", invalid],
    ])("validYear %s should return %s", (state, expected) => {
      expect(validYear()(state)).toStrictEqual(expected);
    });

    it("should return a custom error message", () => {
      const errorMsg = "Esse ano não é válido";
      expect(validYear(errorMsg)(1910)).toStrictEqual({
        valid: false,
        text: errorMsg,
      });
    });
  });
  describe("minValue", () => {
    const invalid = { valid: false, text: "Valor mínimo não atingido" };
    test.each([
      [5, "", invalid],
      [1, " ", invalid],
      [10, null, invalid],
      [9, undefined, invalid],
      [1, 0, invalid],
      ["40", "20", invalid],
      [2, "5", valid],
      [5, 10, valid],
    ])("minValue with %s and %s should return %s", (min, state, expected) => {
      expect(minValue(min)(state)).toStrictEqual(expected);
    });

    it("should throw an error if expected min isn't a number", () => {
      expect(() => minValue("teste")(10)).toThrowError(
        "O mínimo esperado não é um número válido"
      );
    });

    it("should return a custom error message", () => {
      const errorMsg = "O valor mínimo não foi atingido";
      expect(minValue(2, errorMsg)(1)).toStrictEqual({
        valid: false,
        text: errorMsg,
      });
    });
  });
  describe("minLength", () => {
    const invalid = { valid: false, text: "Muito curto" };
    test.each([
      [5, "", invalid],
      [1, " ", valid],
      [1, 0, valid],
      ["40", "20", invalid],
      [2, "55", valid],
      [5, "teste123", valid],
    ])("minLength with %s and %s should return %s", (min, state, expected) => {
      expect(minLength(min)(state)).toStrictEqual(expected);
    });

    it("should throw an error if expected min isn't a number", () => {
      expect(() => minLength("teste")(10)).toThrowError(
        "O mínimo esperado não é um número válido"
      );
    });

    it("should return a custom error message", () => {
      const errorMsg = "Modelo deve ter ao menos 2 letras.";
      expect(minLength(2, errorMsg)(1)).toStrictEqual({
        valid: false,
        text: errorMsg,
      });
    });
  });
  describe("composeValidators", () => {
    test.each([
      [
        [required(), onlyNumbers()],
        "test",
        { valid: false, text: "Insira apenas números" },
      ],
      [[required()], " ", { valid: false, text: "Esse campo é obrigatório" }],
      [
        [required(), onlyNumbers(), validYear()],
        "2025!",
        { valid: false, text: "Insira apenas números" },
      ],
      [
        [required(), onlyNumbers()],
        " ",
        { valid: false, text: "Esse campo é obrigatório" },
      ],
      [
        [onlyNumbers(), required(), minValue(1, "Valor inválido")],
        0,
        { valid: false, text: "Valor inválido" },
      ],
      [
        [onlyNumbers(), required(), minValue(1, "Valor inválido")],
        5,
        { valid: true },
      ],
      [
        [validYear(), onlyNumbers(), required()],
        "2132",
        { valid: false, text: "Ano inválido" },
      ],
    ])(
      "composeValidators %s with input %s should return %o",
      (validators, input, expected) => {
        expect(composeValidators(...validators)(input)).toStrictEqual(expected);
      }
    );
  });
});
