describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("displays username input", () => {
    cy.get("#username").should("exist");
  });
  it("displays password input", () => {
    cy.get("#password").should("exist");
  });

  // it("redirects to '/' after login", () => {
  //   cy.login(`teste-${Math.random()}`, "teste123");
  //   cy.location().should((location) => {
  //     expect(location.pathname).to.eq("/");
  //   });
  // });

  // it("set auth token in localStorage after login", () => {
  //   cy.login(`teste-${Math.random()}`, "teste123");
  //   cy.getLocalStorage(item).not.to.be.null;
  // });

  it("redirects to /cadastrar on click in 'cadastrar' button", () => {
    cy.contains("Cadastrar").click();
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/cadastro");
    });
  });
});
