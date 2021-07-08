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

describe("<VehicleList />", () => {
  const history = createMemoryHistory();
  const setup = () =>
    render(
      <Router history={history}>
        <VehicleList />
      </Router>
    );

  beforeEach(async () => {
    jest.clearAllMocks();
    await act(async () => setup());
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
