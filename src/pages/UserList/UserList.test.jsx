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

import UserService from "../../services/UserService";

import UserList from "./UserList";

const usersMock = [
  {
    id: 1,
    name: "Wagner Lopes",
  },
];

const spyGetAll = jest.spyOn(UserService, "getAll");
spyGetAll.mockResolvedValue(usersMock);

const spyDelete = jest.spyOn(UserService, "delete");
spyDelete.mockResolvedValue();

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

  it("Should render the user list with only the delete button", () => {
    const addButton = screen.queryByRole("button", { name: "add" });
    const updateButton = screen.queryByRole("button", { name: "Alterar" });
    const deleteButton = screen.queryByRole("button", { name: "Excluir" });

    expect(addButton).not.toBeInTheDocument();
    expect(updateButton).not.toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  describe("When the user clicks on the button to delete", () => {
    const testUser = usersMock[0];

    beforeEach(async () => {
      const userItem = await screen.findByText(testUser.name);
      userEvent.click(userItem);
      userEvent.click(screen.getByRole("button", { name: "Excluir" }));

      await waitForElementToBeRemoved(() => screen.getByText(testUser.name));
    });

    it("Should delete the selected user from the list", () => {
      expect(screen.queryByText(testUser.name)).not.toBeInTheDocument();
    });

    it("Should call the service with the right id", () => {
      expect(spyDelete).toHaveBeenLastCalledWith(testUser);
    });
  });
});
