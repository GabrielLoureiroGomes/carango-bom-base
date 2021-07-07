import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import NavBar, { publicLinks, loggedLinks } from "./NavBar";

describe("<Navbox />", () => {
  const setup = (userLogged = false) =>
    render(
      <MemoryRouter>
        <NavBar userLogged={userLogged} />
      </MemoryRouter>
    );

  function checkLinkInDocument(link) {
    expect(screen.getByRole("link", { name: link.label })).toBeInTheDocument();
  }

  function checkLinkNotInDocument(link) {
    expect(
      screen.queryByRole("link", { name: link.label })
    ).not.toBeInTheDocument();
  }

  it("Should render the app's public navigation links", () => {
    setup();

    publicLinks.forEach(checkLinkInDocument);
    loggedLinks.forEach(checkLinkNotInDocument);
  });

  describe("When the user is logged in", () => {
    it("Should render all the app's links", () => {
      setup(true);

      publicLinks.forEach(checkLinkInDocument);
      loggedLinks.forEach(checkLinkInDocument);
    });
  });
});
