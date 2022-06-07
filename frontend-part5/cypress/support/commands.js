Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3000/", {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem("loggedUser", JSON.stringify(body));
    cy.visit("http://localhost:3000");
  });
});

Cypress.Commands.add("createBlog", ({ title, author, url }) => {
  cy.get("#new-post").click();
  cy.get("#title").type(title);
  cy.get("#author").type(author);
  cy.get("#url").type(url);
  cy.get("#button-create").click();
});
