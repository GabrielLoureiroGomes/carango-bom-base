import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UserService from "../../services/UserService";

import * as AuthContext from "../../hooks/AuthContext";

import UpdatePassword from "./UpdatePassword";

const mockUser = {
  username: "teste",
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};
jest.spyOn(AuthContext, "useAuth").mockReturnValue({ user: mockUser });
const spyServiceUpdatePassword = jest.spyOn(UserService, "updatePassword");

const pastPassword = "pastPassword";
const newPassword = "newPassword";

describe("<UpdatePassword />", () => {
  const { AuthProvider } = AuthContext;
  const history = createMemoryHistory();
  const setup = () =>
    render(
      <AuthProvider>
        <Router history={history}>
          <UpdatePassword />
        </Router>
      </AuthProvider>
    );

  beforeEach(setup);

  it("Should render the update form properly", () => {
    const pastPasswordInput = screen.getByLabelText(/Senha atual/);
    const newPasswordInput = screen.getByLabelText(/Nova senha/);
    const confirmPasswordInput = screen.getByLabelText(
      /Confirmação da nova senha/
    );

    expect(pastPasswordInput).toBeInTheDocument();
    expect(newPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /Cancelar/ });
    const submitButton = screen.getByRole("button", { name: /Enviar/ });

    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  describe("When the user clicks on the cancel button", () => {
    const spyHistoryGoBack = jest.spyOn(history, "goBack");

    beforeEach(() => {
      const cancelButton = screen.getByRole("button", { name: /Cancelar/i });
      userEvent.click(cancelButton);
    });

    it("Should go back to the last history entry", () => {
      expect(spyHistoryGoBack).toHaveBeenCalled();
    });
  });

  describe("Form validation", () => {
    it("should show me an error if I don't fill the 'username' field", async () => {
      const pastPasswordInput = screen.getByLabelText(/Senha atual/);
      fireEvent.focus(pastPasswordInput);
      fireEvent.blur(pastPasswordInput);

      const errorMsg = await screen.findByText(
        /Senha deve ter ao menos 6 caracteres./
      );
      expect(errorMsg).toBeInTheDocument();
    });

    it("should show me an error if I don't fill the 'password' field", async () => {
      const newPasswordInput = screen.getByLabelText(/Nova senha/);
      userEvent.type(newPasswordInput, "123");
      fireEvent.blur(newPasswordInput);

      const errorMsg = await screen.findByText(
        /Senha deve ter ao menos 6 caracteres./
      );
      expect(errorMsg).toBeInTheDocument();
    });

    it("should show me an error if 'confirmPassword' doesn't match 'password'", async () => {
      const newPasswordInput = screen.getByLabelText(/Nova senha/);
      userEvent.type(newPasswordInput, newPassword);
      const confirmPasswordInput = screen.getByLabelText(
        /Confirmação da nova senha/
      );
      userEvent.type(confirmPasswordInput, `invalid${newPassword}`);
      fireEvent.blur(confirmPasswordInput);
      const errorMsg = await screen.findByText(/As senhas não correspondem./);
      expect(errorMsg).toBeInTheDocument();
    });
  });

  describe("When the user submits valid information", () => {
    beforeEach(async () => {
      userEvent.type(screen.getByLabelText(/Senha atual/), pastPassword);
      userEvent.type(screen.getByLabelText(/Nova senha/), newPassword);
      userEvent.type(
        screen.getByLabelText(/Confirmação da nova senha/),
        newPassword
      );

      const submitButton = screen.getByRole("button", { name: /Enviar/i });
      await act(async () => userEvent.click(submitButton));
    });

    it("Should redirect the user to home page", () => {
      expect(history.location.pathname).toStrictEqual("/");
    });

    it("Should send the correct data to the service", () => {
      expect(spyServiceUpdatePassword).toHaveBeenCalledWith({
        id: mockUser.id,
        pastPassword,
        newPassword,
      });
    });
  });
});
