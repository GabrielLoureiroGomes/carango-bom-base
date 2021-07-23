import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import {
  screen,
  fireEvent,
  render,
  act,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BrandRegister from "./BrandRegister";
import BrandService from "../../services/BrandService";
import { AuthProvider } from "../../hooks/AuthContext";

const delayResolve = (ms, value) =>
  new Promise(
    (res) =>
      setTimeout(() => {
        res(value);
      }),
    ms
  );
const delayReject = (ms) =>
  new Promise((res, rej) => setTimeout(() => rej(new Error("500")), ms));

let testLocation;
const setup = (brandId) => {
  const path = brandId ? "/marca/:id" : "/marca/cadastro";
  const entry = brandId ? `/marca/${brandId}` : "/marca/cadastro";
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/marcas", entry]} initialIndex={1}>
        <Route path={path}>
          <BrandRegister />
        </Route>
        <Route
          path="*"
          render={({ location }) => {
            testLocation = location;
            return null;
          }}
        />
      </MemoryRouter>
    </AuthProvider>
  );
};

const brandsMock = [
  {
    id: 1,
    name: "Fiat",
  },
];

const brandServiceRegisterSpy = jest.spyOn(BrandService, "register");
const brandServiceUpdateSpy = jest.spyOn(BrandService, "update");
const brandServiceGetSpy = jest.spyOn(BrandService, "get");

describe("<BrandRegister />", () => {
  describe("Register new brand", () => {
    beforeEach(() => {
      setup();
    });

    describe("Input", () => {
      it("should show an error when the user leaves focus without typing", async () => {
        const input = screen.getByRole("textbox", { name: /marca/i });

        fireEvent.focus(input);
        fireEvent.blur(input);

        const errorMsg = await screen.findByText(
          /Marca deve ter ao menos 3 letras./
        );
        expect(errorMsg).toBeInTheDocument();
      });
    });

    describe("Register", () => {
      beforeEach(() => {
        const input = screen.getByRole("textbox", { name: /marca/i });
        userEvent.type(input, "Volvo");
        userEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
      });

      describe("With success", () => {
        beforeAll(() => {
          brandServiceRegisterSpy.mockImplementation(() => delayResolve(1000));
        });

        it("should register the brand that is typed into the input", async () => {
          await waitForElementToBeRemoved(() =>
            screen.getByRole("button", { name: /cancelar/i })
          );
          expect(brandServiceRegisterSpy).toHaveBeenCalledWith({
            name: "Volvo",
          });
        });

        it("should redirect me to the brand listing page", async () => {
          await waitForElementToBeRemoved(() =>
            screen.getByRole("button", { name: /cancelar/i })
          );
          expect(testLocation.pathname).toStrictEqual("/marcas");
        });
      });

      describe("With rejected value", () => {
        beforeAll(() => {
          brandServiceRegisterSpy.mockImplementation(() => delayReject(1000));
        });

        it("should display an error msg after register attempt fails", async () => {
          const errorMsg = await screen.findByText(
            /houve um problema ao registrar/i
          );
          expect(errorMsg).toBeInTheDocument();
        });
      });
    });

    describe("When I click in the 'cancelar' button", () => {
      it("should redirect me to the brand listing page", () => {
        userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

        expect(testLocation.pathname).toBe("/marcas");
      });
    });
  });

  describe("Alter old brand", () => {
    const selectedBrand = brandsMock[0];
    beforeEach(async () => {
      await act(async () => setup(selectedBrand.id));
    });

    describe("Load brand from param", () => {
      describe("With success", () => {
        beforeAll(() => {
          brandServiceGetSpy.mockResolvedValue(selectedBrand);
        });

        it("should render the brand name fetched from the param id", () => {
          const input = screen.getByRole("textbox", { name: /marca/i });
          expect(input.value).toStrictEqual("Fiat");
        });
      });
      describe("With rejected value", () => {
        beforeAll(() => {
          brandServiceGetSpy.mockRejectedValue(new Error("500"));
        });
        it("should display an error msg after failing to fetch brand", async () => {
          const errorMsg = await screen.findByText(
            /Houve um problema ao carregar/i
          );
          expect(errorMsg).toBeInTheDocument();
        });
      });
    });

    describe("Update brand name", () => {
      beforeEach(async () => {
        const input = screen.getByRole("textbox", { name: /marca/i });
        userEvent.clear(input);
        userEvent.type(input, "Volvo");

        const btn = screen.getByRole("button", { name: /alterar/i });
        await act(async () => userEvent.click(btn));
      });

      describe("With success", () => {
        beforeAll(() => {
          brandServiceGetSpy.mockResolvedValue(selectedBrand);
          brandServiceUpdateSpy.mockResolvedValue();
        });
        it("should redirect me back to the brand listing page when I click in 'alterar'", async () => {
          expect(testLocation.pathname).toStrictEqual("/marcas");
        });

        it("should call 'BrandService.update()' with new brand name", () => {
          expect(brandServiceUpdateSpy).toBeCalledWith({
            id: selectedBrand.id,
            name: "Volvo",
          });
        });
      });

      describe("With rejected value", () => {
        beforeAll(() => {
          brandServiceGetSpy.mockResolvedValue(selectedBrand);
          brandServiceUpdateSpy.mockRejectedValue(new Error("500"));
        });
        it("should display an error msg after failing to update brand name", async () => {
          const errorMsg = await screen.findByText(
            /Houve um problema ao alterar/i
          );
          expect(errorMsg).toBeInTheDocument();
        });
      });
    });

    describe("Cancel update", () => {
      it("should redirect me back to the brand listing page when I click in 'cancelar'", () => {
        const btn = screen.getByRole("button", { name: /cancelar/i });
        userEvent.click(btn);
        expect(testLocation.pathname).toStrictEqual("/marcas");
      });
    });
  });
});
