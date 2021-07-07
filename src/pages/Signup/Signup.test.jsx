import React from "react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Signup from "./Signup";
import UserService from "../../services/UserService";

const history = createMemoryHistory();
const setup = () => {
  return render(
    <Router history={history}>
      <Signup />
    </Router>
  );
};
const mockUser = {
  username: "teste",
  password: "teste123123",
  confirmPassword: "teste123123",
};

const userServiceSignupSpy = jest.spyOn(UserService, "signup");

describe("<Signup />", () => {
  describe("Cancel", () => {
    it("should redirect me to '/' when I click the 'cancel' button", () => {
      setup();
      userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

      expect(history.location.pathname).toBe("/");
    });
  });
  describe("Register", () => {
    describe("Form validation", () => {
      beforeEach(() => {
        setup();
      });
      it("should show me an error if I don't fill the 'username' field", async () => {
        const username = screen.getByRole("textbox", { name: /usuário/i });
        fireEvent.focus(username);
        fireEvent.blur(username);

        const errorMsg = await screen.findByText(
          /Usuário deve ter ao menos 3 letras./
        );
        expect(errorMsg).toBeInTheDocument();
      });

      it("should show me an error if I don't fill the 'password' field", async () => {
        const password = screen.getByLabelText(/Senha/);
        userEvent.type(password, "123");
        fireEvent.blur(password);

        const errorMsg = await screen.findByText(
          /Senha deve ter ao menos 6 caracteres./
        );
        expect(errorMsg).toBeInTheDocument();
      });

      it("should show me an error if 'confirmPassword' doesn't match 'password'", async () => {
        const password = screen.getByLabelText(/Senha/);
        userEvent.type(password, mockUser.password);
        const confirmPassword = screen.getByLabelText(/confirmação da senha/i);
        userEvent.type(confirmPassword, "12345");
        fireEvent.blur(confirmPassword);
        const errorMsg = await screen.findByText(/As senhas não correspondem./);
        expect(errorMsg).toBeInTheDocument();
      });

      it("should render a disabled 'cadastrar' button if the validation is invalid", () => {
        const password = screen.getByLabelText(/Senha/);
        const confirmPassword = screen.getByLabelText(/confirmação da senha/i);
        userEvent.type(password, mockUser.password);
        userEvent.type(confirmPassword, mockUser.confirmPassword);
        fireEvent.blur(screen.getByRole("textbox", { name: /usuário/i }));
        expect(
          screen.getByRole("button", { name: /cadastrar/i })
        ).toBeDisabled();
      });
    });

    describe("When submits signup form", () => {
      beforeEach(() => {
        setup();
        const username = screen.getByRole("textbox", { name: /usuário/i });
        const password = screen.getByLabelText(/Senha/);
        const confirmPassword = screen.getByLabelText(/confirmação da senha/i);
        const btn = screen.getByRole("button", { name: /cadastrar/i });

        userEvent.type(username, mockUser.username);
        userEvent.type(password, mockUser.password);
        userEvent.type(confirmPassword, mockUser.confirmPassword);
        userEvent.click(btn);
      });
      it("should register user with correct data", () => {
        expect(userServiceSignupSpy).toHaveBeenCalledWith({
          username: mockUser.username,
          password: mockUser.password,
        });
      });
      it("should redirect me to home page after signup", () => {
        expect(history.location.pathname).toBe("/veiculos");
      });

      describe("And something fails", () => {
        beforeAll(() => {
          userServiceSignupSpy.mockRejectedValue({ data: "Usuário já existe" });
        });
        it("should show the error message", async () => {
          const errorMsg = await screen.findByText(/Usuário já existe/i);
          expect(errorMsg).toBeInTheDocument();
        });
      });
    });
  });
});
