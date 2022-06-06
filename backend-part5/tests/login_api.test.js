const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const { initDB, saltThePassword } = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await initDB();
});

describe("LOGIN POST", () => {
  const exampleLogin = {
    username: "micas",
    password: "coisa",
  };

  test("Status should be 201", async () => {
    // hash password and put it in DB

    await User.findOneAndUpdate(
      { username: exampleLogin.username },
      { passwordHash: await saltThePassword(exampleLogin.password) },
      { new: "true" }
    );

    const result = await api.post("/").send(exampleLogin);
    expect(result.status).toBe(201);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
