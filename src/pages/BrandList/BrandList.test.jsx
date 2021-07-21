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

import BrandList from "./BrandList";
import BrandService from "../../services/BrandService";
const brandsMock = [
  {
    id: 1,
    name: "Fiat",
  },
];

const getAllSpy = jest.spyOn(BrandService, "getAll");
const deleteSpy = jest.spyOn(BrandService, "delete");

describe("<BrandList />", () => {
  const history = createMemoryHistory();
  const setup = () =>
    render(
      <Router history={history}>
        <BrandList />
      </Router>
    );

  beforeEach(async () => {
    jest.clearAllMocks();
    await act(async () => setup());
  });

  describe("With successful reqs", () => {
    beforeAll(() => {
      getAllSpy.mockResolvedValue(brandsMock);
      deleteSpy.mockResolvedValue();
    });
    it("Should go to the create page when the user clicks on the button to add a new brand", async () => {
      userEvent.click(screen.getByRole("button", { name: "add" }));
      expect(history.location.pathname).toBe("/marca/cadastro");
    });

    it("Should go to the update page when the user clicks on the button to update", async () => {
      const testBrand = brandsMock[0];
      const brandItem = await screen.findByText(testBrand.name);
      userEvent.click(brandItem);
      userEvent.click(screen.getByRole("button", { name: "Alterar" }));

      expect(history.location.pathname).toBe("/marca/" + testBrand.id);
    });

    it("Should delete the item when the user clicks on the button to delete", async () => {
      const testBrand = brandsMock[0];
      const brandItem = await screen.findByText(testBrand.name);
      userEvent.click(brandItem);
      userEvent.click(screen.getByRole("button", { name: "Excluir" }));

      await waitForElementToBeRemoved(() => screen.getByText(testBrand.name));
      expect(screen.queryByText(testBrand.name)).not.toBeInTheDocument();
    });
  });

  describe("With rejected reqs", () => {
    describe("When fetching all brands", () => {
      beforeAll(() => {
        getAllSpy.mockRejectedValue();
      });

      it("should render an error msg after loading brands", () => {
        expect(
          screen.getByText(/houve um erro ao carregar os itens/i)
        ).toBeInTheDocument();
      });
    });

    describe("When trying to delete brand", () => {
      beforeAll(() => {
        getAllSpy.mockResolvedValue(brandsMock);
        deleteSpy.mockRejectedValue();
      });
      it("should render an error msg after trying to delete item", async () => {
        const testBrand = brandsMock[0];
        const brandItem = await screen.findByText(testBrand.name);
        userEvent.click(brandItem);
        userEvent.click(screen.getByRole("button", { name: "Excluir" }));
        const errorMsg = await screen.findByText(
          /houve um erro ao deletar o item/i
        );
        expect(errorMsg).toBeInTheDocument();
      });
    });
  });
});
