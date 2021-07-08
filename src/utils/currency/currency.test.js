import { formatCurrency } from "./currency";

describe("formatCurrency", () => {
  it("Should return the value formatted to BRL currency", () => {
    expect(formatCurrency(15000)).toStrictEqual("R$ 15.000,00");
  });
});
