import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as UserActions from "../../actions/auth";

import Login from "./Login";

const authSpy = jest.spyOn(UserActions, "login");
const dispatchMock = jest.fn();
let testLocation;
const setup = (user) =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Route path="/login">
        <Login dispatch={dispatchMock} user={user} />
      </Route>
      <Route
        path="*"
        render={({ location }) => {
          testLocation = location;
          return null;
        }}
      />
    </MemoryRouter>
  );

describe("<Login />", () => {
  describe("User is authenticated", () => {
    beforeEach(() => {
      setup({
        username: "teste",
      });
    });
    it("should redirect the user to vehicles page", () => {
      expect(testLocation.pathname).toStrictEqual("/");
    });
  });
  describe("User isnt authenticated", () => {
    beforeEach(() => {
      setup();
    });

    it("Should render the login form", () => {
      expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /cadastrar/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /entrar/i })
      ).toBeInTheDocument();
    });

    describe("When the user clicks on the button to register", () => {
      it("Should redirect to the sign up page", () => {
        const registerButton = screen.getByRole("button", {
          name: /cadastrar/i,
        });
        userEvent.click(registerButton);

        expect(testLocation.pathname).toStrictEqual("/cadastro");
      });
    });

    describe("When the user types invalid credentials", () => {
      beforeAll(() => {
        authSpy.mockRejectedValue(new Error("Usuário ou senha inválidos"));
      });
      it("Should show an error message", async () => {
        const testUsername = "test";
        const usernameInput = screen.getByLabelText(/usuário/i);
        userEvent.paste(usernameInput, testUsername);

        const testPassword = "testPassword";
        const passwordInput = screen.getByLabelText(/senha/i);
        userEvent.paste(passwordInput, testPassword);

        const loginButton = screen.getByRole("button", { name: /entrar/i });
        userEvent.click(loginButton);

        expect(authSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            user: { username: testUsername, password: testPassword },
          })
        );
        expect(
          await screen.findByText("Usuário ou senha inválidos")
        ).toBeInTheDocument();
      });
    });

    describe("When the user types valid credentials", () => {
      const testUsername = "test";
      const testPassword = "testPassword";

      beforeEach(async () => {
        authSpy.mockResolvedValue({
          status: 200,
        });

        const usernameInput = screen.getByLabelText(/usuário/i);
        userEvent.paste(usernameInput, testUsername);

        const passwordInput = screen.getByLabelText(/senha/i);
        userEvent.paste(passwordInput, testPassword);

        const loginButton = screen.getByRole("button", { name: /entrar/i });
        await act(async () => userEvent.click(loginButton));
      });

      it("should call the auth action", async () => {
        expect(authSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            user: { username: testUsername, password: testPassword },
          })
        );
      });
      it("should redirect the user to the home page", () => {
        expect(testLocation.pathname).toStrictEqual("/");
      });
    });
  });
});
