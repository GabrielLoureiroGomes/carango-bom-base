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

import UserList from "./UserList";

const usersMock = [
  {
    id: 1,
    name: "Wagner Lopes",
  },
];

jest.mock("../../services/UserService", () => ({
  getAll: jest.fn().mockResolvedValue(usersMock),
  delete: jest.fn().mockResolvedValue(),
}));

describe("<UserList />", () => {
  const history = createMemoryHistory();
  const setup = () =>
    render(
      <Router history={history}>
        <UserList />
      </Router>
    );

  beforeEach(async () => {
    jest.clearAllMocks();
    await act(async () => setup());
  });

  it("Should go to the create page when the user clicks on the button to add a new user", async () => {
    userEvent.click(screen.getByRole("button", { name: "add" }));
    expect(history.location.pathname).toBe("/usuario/cadastro");
  });

  it("Should go to the update page when the user clicks on the button to update", async () => {
    const testUser = usersMock[0];
    const userItem = await screen.findByText(testUser.name);
    userEvent.click(userItem);
    userEvent.click(screen.getByRole("button", { name: "Alterar" }));

    expect(history.location.pathname).toBe("/usuario/" + testUser.id);
  });

  it("Should delete the item when the user clicks on the button to delete", async () => {
    const testUser = usersMock[0];
    const userItem = await screen.findByText(testUser.name);
    userEvent.click(userItem);
    userEvent.click(screen.getByRole("button", { name: "Excluir" }));

    await waitForElementToBeRemoved(() => screen.getByText(testUser.name));
    expect(screen.queryByText(testUser.name)).not.toBeInTheDocument();
  });
});
