import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as Auth from "../../hooks/AuthContext";
import * as AuthActions from "../../actions/auth";
import NavBar from "./NavBar";

const publicLabels = [/veículos/i];
const privateLabels = [/marcas/i, /usuários/i, /dashboard/i];
const setup = (userLogged = false) =>
  render(
    <Auth.AuthProvider>
      <MemoryRouter>
        <NavBar userLogged={userLogged} />
      </MemoryRouter>
    </Auth.AuthProvider>
  );

const useAuthSpy = jest.spyOn(Auth, "useAuth");
const logoutActionSpy = jest.spyOn(AuthActions, "logout");

describe("<NavBar />", () => {
  function checkLinkInDocument(link) {
    expect(screen.getByRole("link", { name: link })).toBeInTheDocument();
  }

  function checkLinkNotInDocument(link) {
    expect(screen.queryByRole("link", { name: link })).not.toBeInTheDocument();
  }

  describe("When the user isn't logged in", () => {
    beforeEach(() => {
      useAuthSpy.mockReturnValue({
        dispatch: jest.fn(),
        user: null,
      });
      setup();
    });
    it("should render a login button", () => {
      expect(
        screen.getByRole("button", { name: /login/i })
      ).toBeInTheDocument();
    });
    describe("Sidebar menu", () => {
      it("should render a menu button", () => {
        expect(
          screen.getByRole("button", { name: /menu/i })
        ).toBeInTheDocument();
      });
      it("should render public links", () => {
        userEvent.click(screen.getByRole("button", { name: /menu/i }));
        publicLabels.forEach(checkLinkInDocument);
      });
      it("should not render private links", () => {
        userEvent.click(screen.getByRole("button", { name: /menu/i }));
        privateLabels.forEach(checkLinkNotInDocument);
      });
    });
  });

  describe("When the user is logged in", () => {
    beforeEach(() => {
      useAuthSpy.mockReturnValue({
        dispatch: jest.fn(),
        user: {
          name: "teste",
        },
      });
      setup();
    });
    describe("Auth buttons", () => {
      it("should not render a login button", () => {
        expect(
          screen.queryByRole("button", { name: /login/i })
        ).not.toBeInTheDocument();
      });
      it("should render a user button", () => {
        expect(
          screen.getByRole("button", { name: /account of current user/i })
        ).toBeInTheDocument();
      });
      describe("Logout", () => {
        beforeEach(() => {
          userEvent.click(
            screen.getByRole("button", { name: /account of current user/i })
          );
        });
        it("should render a 'sair' item inside the menu", () => {
          expect(screen.getByText(/sair/i)).toBeInTheDocument();
        });
        it("should call the logout action on click 'sair'", () => {
          userEvent.click(screen.getByText(/sair/i));
          expect(logoutActionSpy).toHaveBeenCalled();
        });
      });
    });
    describe("Sidebar menu", () => {
      beforeEach(() => {
        userEvent.click(screen.getByRole("button", { name: /menu/i }));
      });
      it("should render public links", () => {
        publicLabels.forEach(checkLinkInDocument);
      });
      it("should render private links", () => {
        privateLabels.forEach(checkLinkInDocument);
      });
    });
  });
});
