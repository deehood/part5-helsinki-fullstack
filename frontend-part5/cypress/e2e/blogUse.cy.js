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

  it("User that created blog can also delete it ", function () {
    cy.createBlog({
      title: "melhor blog do mundo",
      author: "Miguel Alerta",
      url: "www.melhorblog.com",
    });
    cy.get("#button-toggleView").click();
    cy.get("#button-remove").click();
    cy.contains("mundo -").should("not.exist");
  });

  it("User that didnt create blog cant delete it ", function () {
    cy.createBlog({
      title: "melhor blog do mundo",
      author: "Miguel Alerta",
      url: "www.melhorblog.com",
    });

    // create another user
    const user2 = {
      name: "that guy",
      username: "tries",
      password: "tries",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user2);

    // login with user2

    cy.login({ username: "tries", password: "tries" });

    cy.get("#button-toggleView").click();
    cy.contains("#button-remove").should("not.exist");
  });
});
