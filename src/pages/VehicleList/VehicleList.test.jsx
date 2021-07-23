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

import BrandService from "../../services/BrandService";

import VehicleList from "./VehicleList";

const brands = [
  { id: 1, name: "FIAT" },
  { id: 2, name: "CHEVROLET" },
  { id: 3, name: "VOLKS" },
];

const getAllBrandsSpy = jest.spyOn(BrandService, "getAll");
getAllBrandsSpy.mockResolvedValue(brands);

const vehiclesMock = [
  {
    id: 1,
    brandId: 1,
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
  describe("When rendering items on the list", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      await act(async () => setup(false));
    });

    it("Should fetch the brands and render the brand name in the list", () => {
      const vehicleBrand = brands.find(
        (brand) => brand.id === vehiclesMock[0].brandId
      );
      expect(screen.getByText(vehicleBrand.name)).toBeInTheDocument();
    });
  });

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
