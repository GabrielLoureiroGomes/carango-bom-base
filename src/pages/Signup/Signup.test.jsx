import React from "react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
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
  password: "123",
  confirmPassword: "123",
};

const userServiceSignupSpy = jest.spyOn(UserService, "signup");
userServiceSignupSpy.mockResolvedValue("some jwt token");

describe("<Signup />", () => {
  beforeEach(() => {
    setup();
  });

  describe("Register", () => {
    describe("Form validation", () => {
      it("should show me an error if I don't fill the 'username' field", async () => {
        const username = screen.getByRole("textbox", { name: "username" });
        fireEvent.focus(username);
        fireEvent.blur(username);

        const errorMsg = await screen.findByText(
          /Usuário deve ter ao menos 3 letras./
        );
        expect(errorMsg).toBeInTheDocument();
      });

      it("should show me an error if I don't fill the 'password' field", async () => {
        const password = screen.getByRole("textbox", { name: "password" });
        userEvent.type(password, "123");
        fireEvent.blur(password);

        const errorMsg = await screen.findByText(
          /Senha deve ter ao menos 6 caracteres./
        );
        expect(errorMsg).toBeInTheDocument();
      });

      it("should show me an error if 'confirmPassword' doesn't match 'password'", async () => {
        const password = screen.getByRole("textbox", { name: "password" });
        userEvent.type(password, mockUser.password);
        const confirmPassword = screen.getByRole("textbox", {
          name: "confirmPassword",
        });
        userEvent.type(confirmPassword, "12345");
        fireEvent.blur(confirmPassword);
        const errorMsg = await screen.findByText(/As senhas não correspondem./);
        expect(errorMsg).toBeInTheDocument();
      });

      it("should render a disabled 'cadastrar' button if the validation is invalid", () => {
        const password = screen.getByRole("textbox", { name: "password" });
        const confirmPassword = screen.getByRole("textbox", {
          name: "confirmPassword",
        });
        userEvent.type(password, mockUser.password);
        userEvent.type(confirmPassword, mockUser.confirmPassword);
        const btn = screen.getByRole("button", { name: /cadastrar/i });

        expect(btn).toBeDisabled();
      });
    });

    describe("When submits signup form", () => {
      beforeAll(() => {
        const username = screen.getByRole("textbox", { name: "username" });
        const password = screen.getByRole("textbox", { name: "password" });
        const confirmPassword = screen.getByRole("textbox", {
          name: "confirmPassword",
        });
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
        expect(history.location.pathname).toBe("/");
      });

      describe("And something fails", () => {
        it("should show the error message", async () => {
          userServiceSignupSpy.mockRejectedValue("Usuário já existe");

          const errorMsg = await screen.findByText(/Usuário já existe/i);
          expect(errorMsg).toBeInTheDocument();
        });
      });
    });
  });
  describe("Cancel", () => {
    it("should redirect me to '/' when I click the 'cancel' button", () => {
      userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

      expect(history.location.pathname).toBe("/");
    });
  });
});
