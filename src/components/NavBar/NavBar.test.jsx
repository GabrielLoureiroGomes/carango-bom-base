import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import { AuthProvider } from "../../hooks/AuthContext";
import NavBar from "./NavBar";

const publicLabels = [/veículos/i];
const privateLabels = [/marcas/i, /usuários/i, /dashboard/i, /sair/i];
const setup = (userLogged = false) =>
  render(
    <AuthProvider>
      <MemoryRouter>
        <NavBar userLogged={userLogged} />
      </MemoryRouter>
    </AuthProvider>
  );

describe("<Navbox />", () => {
  function checkLinkInDocument(link) {
    expect(screen.getByRole("link", { name: link })).toBeInTheDocument();
  }

  function checkLinkNotInDocument(link) {
    expect(screen.queryByRole("link", { name: link })).not.toBeInTheDocument();
  }
  describe("When the user isn't logged in", () => {
    beforeEach(() => {
      setup();
    });
    it("Should render the app's public navigation links", () => {
      publicLabels.forEach(checkLinkInDocument);
      privateLabels.forEach(checkLinkNotInDocument);
    });
  });

  describe("When the user is logged in", () => {
    beforeEach(() => {
      setup(true);
    });
    it("shouldn't render login link", () => {
      expect(
        screen.queryByRole("link", { name: /login/i })
      ).not.toBeInTheDocument();
    });
    it("Should render the rest of the app's links", () => {
      publicLabels.forEach(checkLinkInDocument);
      privateLabels.forEach(checkLinkInDocument);
    });
  });
});
