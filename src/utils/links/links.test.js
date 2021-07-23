import { getLocationFromLabel } from "./links";

describe("getLocationFromLabel()", () => {
  test.each([
    [{ pathname: "/" }, "Veículos"],
    [{ pathname: "/marcas" }, "Marcas"],
    [{ pathname: "/teste" }, ""],
    [{ pathname: "/usuarios" }, "Usuários"],
    [{ pathname: "/dashboard" }, "Dashboard"],
    [{ pathname: "/login" }, "Login"],
    [{ pathname: "/sigin" }, ""],
  ])("getLocationFromLabel %s should return %s", (state, expected) => {
    expect(getLocationFromLabel(state)).toStrictEqual(expected);
  });
});
