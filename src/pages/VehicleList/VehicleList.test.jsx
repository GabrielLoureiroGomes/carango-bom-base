import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import VehicleList from "./VehicleList";

const vehiclesMock = [
  {
    id: 1,
    brand: {
      id: 1,
      name: "Fiat",
    },
    model: "Uno",
    year: 2010,
    price: 15000,
  },
];

jest.mock("../../services/VehicleService", () => ({
  getAll: jest.fn().mockResolvedValue(vehiclesMock),
  delete: jest.fn().mockResolvedValue(),
}));

const history = createMemoryHistory();
const setup = (isAuth) =>
  render(
    <Router history={history}>
      <VehicleList isAuth={isAuth} />
    </Router>
  );

describe("<VehicleList />", () => {
  describe("User isnt authenticated", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      await act(async () => setup(false));
    });

    describe("Doesn't show action buttons", () => {
      it("should not render 'excluir' button", () => {
        expect(
          screen.queryByRole("button", { name: "excluir" })
        ).not.toBeInTheDocument();
      });
      it("should not render 'add' button", () => {
        expect(
          screen.queryByRole("button", { name: "alterar" })
        ).not.toBeInTheDocument();
      });
      it("should not render 'alterar' button", () => {
        expect(
          screen.queryByRole("button", { name: "add" })
        ).not.toBeInTheDocument();
      });
    });
  });
  describe("User is authenticated", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      await act(async () => setup(true));
    });

    describe("When the user clicks on the button to add a new vehicle", () => {
      it("Should go to the create page", async () => {
        userEvent.click(screen.getByRole("button", { name: "add" }));
        expect(history.location.pathname).toBe("/veiculo/cadastro");
      });
    });

    describe("When the user clicks on the button to update", () => {
      it("Should go to the selected vehicle update page", async () => {
        const testVehicle = vehiclesMock[0];
        const vehicleItem = await screen.findByText(testVehicle.model);
        userEvent.click(vehicleItem);
        userEvent.click(screen.getByRole("button", { name: "Alterar" }));

        expect(history.location.pathname).toBe("/veiculo/" + testVehicle.id);
      });
    });

    describe("When the user clicks on the button to delete", () => {
      it("Should delete the selected item from the list", async () => {
        const testVehicle = vehiclesMock[0];
        const vehicleItem = await screen.findByText(testVehicle.model);
        userEvent.click(vehicleItem);
        userEvent.click(screen.getByRole("button", { name: "Excluir" }));

        await waitForElementToBeRemoved(() =>
          screen.getByText(testVehicle.model)
        );
        expect(screen.queryByText(testVehicle.model)).not.toBeInTheDocument();
      });
    });
  });
});
