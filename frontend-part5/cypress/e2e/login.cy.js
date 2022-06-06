describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    const user = {
      name: "great dude",
      username: "micas",
      password: "coisa",
    };
    // create user in DB
    cy.request("POST", "http://localhost:3003/api/users/", user);

    cy.visit("http://localhost:3000");
  });

  describe("Login", function () {
    it("Login form is shown", function () {
      cy.contains("Login");
    });

    it("succeeds with correct credentials", function () {
      cy.get("#username").type("micas");
      cy.get("#password").type("coisa");
      cy.get("#login-button").click();

      // contains user full name
      cy.contains("great dude");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("qqe");
      cy.get("#password").type("treta");
      cy.get("#login-button").click();

      // contains text in error notification
      cy.contains("invalid");
    });
    it("Notification with unsuccessful login is red", function () {
      cy.get("#username").type("qqe");
      cy.get("#password").type("treta");
      cy.get("#login-button").click();

      cy.get(".Notification").should("have.css", "color", "rgb(140, 0, 0)");
    });
  });
});
