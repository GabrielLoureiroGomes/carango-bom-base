import React from "react";
import { MemoryRouter, Route, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { screen, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BrandRegister from "./BrandRegister";
import BrandService from "../../services/BrandService";

const history = createMemoryHistory();
const setup = (brandId) => {
  const path = brandId ? "/alteracao-marca/:id" : "/cadastro-marca";
  const entry = brandId ? `/alteracao-marca/${brandId}` : "/cadastro-marca";
  return render(
    <Router history={history}>
      <MemoryRouter initialEntries={[entry]}>
        <Route path={path}>
          <BrandRegister />
        </Route>
      </MemoryRouter>
    </Router>
  );
};

const brandsMock = [
  {
    id: 1,
    nome: "Fiat",
  },
];

const brandServiceSpy = jest.spyOn(BrandService, "register");
jest.mock("../../services/BrandService", () => ({
  get: jest.fn().mockResolvedValue(brandsMock[0]),
  register: jest.fn(),
}));

describe("<BrandRegister />", () => {
  describe("Register new brand", () => {
    beforeEach(() => {
      setup();
    });
    afterAll(() => {
      jest.clearAllMocks();
    });
    describe("Input", () => {
      it("should show an error when the user leaves focus without typing", async () => {
        const input = screen.getByRole("textbox", { name: /brand/i });

        fireEvent.focus(input);
        fireEvent.blur(input);

        const errorMsg = await screen.findByText(
          /Marca deve ter ao menos 3 letras./
        );
        expect(errorMsg).toBeInTheDocument();
      });
    });

    describe("Register", () => {
      it("should register the brand that is typed into the input", () => {
        const input = screen.getByRole("textbox", { name: /brand/i });

        userEvent.type(input, "Volvo");
        userEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

        expect(brandServiceSpy).toHaveBeenCalledWith({ nome: "Volvo" });
      });

      it("should redirect me to the brand listing page", () => {
        const input = screen.getByRole("textbox", { name: /brand/i });

        userEvent.type(input, "Volvo");
        userEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

        expect(history.location.pathname).toBe("/");
      });
    });

    describe("When I click in the 'cancelar' button", () => {
      it("should redirect me to the brand listing page", () => {
        userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

        expect(history.location.pathname).toBe("/");
      });
    });
  });

  describe("Alter old brand", () => {
    beforeEach(() => {
      setup(1);
    });
    afterAll(() => {
      jest.clearAllMocks();
    });
    describe("Load brand from param", () => {
      it("should render the brand name fetched from the param id", () => {
        const input = screen.getByRole("textbox", { name: /brand/i });
        expect(input.value).toStrictEqual("Fiat");
      });
    });
  });
});
