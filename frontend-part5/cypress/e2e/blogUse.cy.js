describe("When logged in", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    const user = {
      name: "great dude",
      username: "micas",
      password: "coisa",
    };
    // create user in DB
    cy.request("POST", "http://localhost:3003/api/users/", user);

    // login
    cy.login({ username: "micas", password: "coisa" });
  });

  it("A blog can be created", function () {
    cy.get("#new-post").click();
    cy.get("#title").type("melhor blog do mundo");
    cy.get("#author").type("Miguel Alerta");
    cy.get("#url").type("www.melhorblog.com");
    cy.get("#button-create").click();
    cy.contains("do mundo");
  });
});
