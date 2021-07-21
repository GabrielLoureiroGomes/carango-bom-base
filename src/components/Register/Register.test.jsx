import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField } from "@material-ui/core";
import Register from "./Register";

const service = {
  update: jest.fn(),
  register: jest.fn(),
  get: jest.fn(),
};

const itensMock = [
  {
    id: 1,
    teste: "Fiat",
  },
];

const delayResolve = (ms, value) =>
  new Promise(
    (res) =>
      setTimeout(() => {
        res(value);
      }),
    ms
  );
const delayReject = (ms) => new Promise((res, rej) => setTimeout(rej, ms));

const component = () => (
  <Register
    service={service}
    redirectTo="/teste"
    initialState={{
      teste: "",
    }}
  >
    {({ state: { teste }, setState }) => {
      return (
        <TextField
          value={teste}
          onChange={(evt) => setState({ teste: evt.target.value })}
          name="teste"
          id="teste"
          label="Teste"
          type="text"
          required
        />
      );
    }}
  </Register>
);

let testLocation;
const setup = (testeId) => {
  const path = testeId ? "/teste/:id" : "/teste/cadastro";
  const entry = testeId ? `/teste/${testeId}` : "/teste/cadastro";

  return render(
    <MemoryRouter initialEntries={["/", entry]} initialIndex={1}>
      <Route path={path}>{component()}</Route>
      <Route
        path="*"
        render={({ location }) => {
          testLocation = location;
          return null;
        }}
      />
    </MemoryRouter>
  );
};

describe("<Register />", () => {
  describe("Register new item page", () => {
    beforeEach(() => {
      setup();
    });

    describe("Registering", () => {
      beforeEach(() => {
        const input = screen.getByRole("textbox", { name: /teste/i });
        userEvent.type(input, "Volvo");
        userEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
      });

      describe("With success", () => {
        beforeAll(() => {
          service.register.mockImplementation(() => delayResolve(1000));
        });

        it("should register the item that is typed into the input", async () => {
          await waitForElementToBeRemoved(() =>
            screen.getByRole("button", { name: /cancelar/i })
          );
          expect(service.register).toHaveBeenCalledWith({
            teste: "Volvo",
          });
        });

        it("should redirect me to the next page", async () => {
          await waitForElementToBeRemoved(() =>
            screen.getByRole("button", { name: /cancelar/i })
          );
          expect(testLocation.pathname).toStrictEqual("/teste");
        });
      });

      describe("With rejected value", () => {
        beforeAll(() => {
          service.register.mockImplementation(() => delayReject(1000));
        });

        it("should display an error msg after register attempt fails", async () => {
          const errorMsg = await screen.findByText(
            /houve um problema ao registrar/i
          );
          expect(errorMsg).toBeInTheDocument();
        });
      });
    });

    describe("Cancel register", () => {
      it("should redirect me to the previous entry", () => {
        userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

        expect(testLocation.pathname).toBe("/");
      });
    });
  });

  describe("Alter old brand", () => {
    const selectedItem = itensMock[0];
    beforeEach(async () => {
      await act(async () => setup(selectedItem.id));
    });

    describe("Load item from param", () => {
      describe("With success", () => {
        beforeAll(() => {
          service.get.mockResolvedValue(selectedItem);
        });

        it("should render the item fetched from the param id", () => {
          const input = screen.getByRole("textbox", { name: /teste/i });
          expect(input.value).toStrictEqual("Fiat");
        });
      });
      describe("With rejected value", () => {
        beforeAll(() => {
          service.get.mockRejectedValue();
        });
        it("should display an error msg after failing to fetch item", async () => {
          const errorMsg = await screen.findByText(
            /Houve um problema ao carregar/i
          );
          expect(errorMsg).toBeInTheDocument();
        });
      });
    });

    describe("Update item page", () => {
      beforeEach(async () => {
        const input = screen.getByRole("textbox", { name: /teste/i });
        userEvent.clear(input);
        userEvent.type(input, "Volvo");

        const btn = screen.getByRole("button", { name: /alterar/i });
        await act(async () => userEvent.click(btn));
      });

      describe("With success", () => {
        beforeAll(() => {
          service.get.mockResolvedValue(selectedItem);
          service.update.mockResolvedValue();
        });

        it("should redirect me back to the next page when I click in 'alterar'", async () => {
          expect(testLocation.pathname).toStrictEqual("/teste");
        });

        it("should call 'Service.update()' with new item name", () => {
          expect(service.update).toBeCalledWith({
            id: selectedItem.id,
            teste: "Volvo",
          });
        });
      });

      describe("With rejected value", () => {
        beforeAll(() => {
          service.get.mockResolvedValue(selectedItem);
          service.update.mockRejectedValue();
        });
        it("should display an error msg after failing to update item", async () => {
          const errorMsg = await screen.findByText(
            /Houve um problema ao alterar/i
          );
          expect(errorMsg).toBeInTheDocument();
        });
      });
    });

    describe("Cancel update", () => {
      it("should redirect me back to the previous page when I click in 'cancelar'", () => {
        const btn = screen.getByRole("button", { name: /cancelar/i });
        userEvent.click(btn);
        expect(testLocation.pathname).toStrictEqual("/");
      });
    });
  });
});
