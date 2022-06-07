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

    // calls login in commands.js
    cy.login({ username: "micas", password: "coisa" });
  });

  it("A blog can be created", function () {
    //calls createBlog in commands.js
    cy.createBlog({
      title: "melhor blog do mundo",
      author: "Miguel Alerta",
      url: "www.melhorblog.com",
    });

    cy.contains("mundo -");
  });

  it("User can like a blog", function () {
    cy.createBlog({
      title: "melhor blog do mundo",
      author: "Miguel Alerta",
      url: "www.melhorblog.com",
    });

    cy.get("#button-toggleView").click();
    cy.get("#button-like").click();
    cy.contains("1");
  });
});
