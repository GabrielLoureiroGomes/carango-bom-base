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

const brandsMock = [
  {
    id: 0,
    nome: "Fiat",
  },
];

jest.mock("../../services/BrandService", () => ({
  getAll: jest.fn().mockResolvedValue(brandsMock),
  delete: jest.fn().mockResolvedValue(),
}));

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

  it("Should go to the create page when the user clicks on the button to add a new brand", async () => {
    userEvent.click(screen.getByRole("button", { name: "add" }));
    expect(history.location.pathname).toBe("/marca/cadastro");
  });

  it("Should go to the update page when the user clicks on the button to update", async () => {
    const testBrand = brandsMock[0];
    const brandItem = await screen.findByText(testBrand.nome);
    userEvent.click(brandItem);
    userEvent.click(screen.getByRole("button", { name: "Alterar" }));

    expect(history.location.pathname).toBe("/marca/" + testBrand.id);
  });

  it("Should delete the item when the user clicks on the button to delete", async () => {
    const testBrand = brandsMock[0];
    const brandItem = await screen.findByText(testBrand.nome);
    userEvent.click(brandItem);
    userEvent.click(screen.getByRole("button", { name: "Excluir" }));

    await waitForElementToBeRemoved(() => screen.getByText(testBrand.nome));
    expect(screen.queryByText(testBrand.nome)).not.toBeInTheDocument();
  });
});
