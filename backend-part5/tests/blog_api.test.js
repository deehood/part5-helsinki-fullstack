const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const { initDB } = require("./test_helper");
const jwt = require("jsonwebtoken");

const api = supertest(app);

const createToken = async () => {
  const user = await User.find({ username: "micas" });
  const idForMicas = user[0]._id;

  const userForToken = {
    username: "micas",
    id: idForMicas,
  };
  return jwt.sign(userForToken, process.env.SECRET);
};

beforeEach(async () => {
  await initDB();
});

describe("Blog API tests", () => {
  describe("check GET HTTP", () => {
    test("blogs are returned as json", async () => {
      const tokenUser = await createToken();

      await api
        .get("/api/blogs")
        .set({ Authorization: `Bearer ${tokenUser}` })
        .expect(200)
        .expect("Content-Type", /application\/json/);
    }, 100000);

    test("there are 6 initial  blogs", async () => {
      const tokenUser = await createToken();
      const response = await api
        .get("/api/blogs")
        .set({ Authorization: `Bearer ${tokenUser}` });

      expect(response.body).toHaveLength(6);
    });

    test("Check if 'id' exists", async () => {
      const tokenUser = await createToken();
      const response = await api
        .get("/api/blogs")
        .set({ Authorization: `Bearer ${tokenUser}` });
      const data = response.body;
      for (let i = 0; i < data.length; i++) {
        expect(data[i].id).toBeDefined();
      }
    });
  });
  describe("check HTTP PUT ", () => {
    test("check for 200 code and updated blog", async () => {
      const exampleBlog = {
        title: "just the HTTP PUT test",
        author: "Some Dev",
        url: "https://idontknow.com/",
        likes: 4,
      };
      const tokenUser = await createToken();

      const blogs = await api
        .get("/api/blogs")
        .set({ Authorization: `Bearer ${tokenUser}` });
      const index = 1;
      const id = blogs.body[index].id;

      const response = await api
        .put(`/api/blogs/${id}`)
        .set({ Authorization: `Bearer ${tokenUser}` })
        .send(exampleBlog);

      expect(response.status).toBe(204);

      const response2 = await api
        .get(`/api/blogs/${id}`)
        .set({ Authorization: `Bearer ${tokenUser}` });

      expect(response2.body.likes).toBe(exampleBlog.likes);
    });
  });

  describe("check HTTP DELETE", () => {
    test("Deletes 1 blog, 204, and 1 less blog", async () => {
      const tokenUser = await createToken();
      let blogs = await api
        .get("/api/blogs")
        .set({ Authorization: `Bearer ${tokenUser}` });

      const beforeFileSize = blogs.body.length;

      const id = blogs.body[1].id;

      const response = await api
        .delete(`/api/blogs/${id}`)
        .set({ Authorization: `Bearer ${tokenUser}` });
      expect(response.status).toBe(204);

      blogs = await api
        .get("/api/blogs")
        .set({ Authorization: `Bearer ${tokenUser}` });
      const afterFileSize = blogs.body.length;

      expect(afterFileSize).toBe(beforeFileSize - 1);
    });
  });

  describe("check HTTP POST", () => {
    let exampleBlog = {
      title: "this is a generic test",
      author: "Some Dev",
      url: "https://idontknow.com/",
      likes: 3,
    };

    test("Fails with 401 Unauthorized if no token given", async () => {
      const response = await api
        .post("/api/blogs")
        // .set({ Authorization: "" })
        .send(exampleBlog);
      expect(response.status).toBe(401);
    });

    test("check 201 status", async () => {
      const tokenUser = await createToken();
      const response = await api
        .post("/api/blogs")
        .set({ Authorization: `Bearer ${tokenUser}` })
        .send(exampleBlog);
      expect(response.status).toBe(201);
    });

    test("check if id is present", async () => {
      const tokenUser = await createToken();
      const result = await api
        .post("/api/blogs")
        .set({ Authorization: `Bearer ${tokenUser}` })
        .send(exampleBlog);

      expect(result.body.id).toBeDefined;
    });

    test("check that blogs increase by 1", async () => {
      const tokenUser = await createToken();
      let blogs = await api
        .get("/api/blogs")
        .set({ Authorization: `Bearer ${tokenUser}` });
      const beforeFileSize = blogs.body.length;

      await api
        .post("/api/blogs")
        .set({ Authorization: `Bearer ${tokenUser}` })
        .send(exampleBlog);

      blogs = await api
        .get("/api/blogs")
        .set({ Authorization: `Bearer ${tokenUser}` });
      const afterFileSize = blogs.body.length;
      expect(afterFileSize).toBe(beforeFileSize + 1);
    });

    test("check likes is defined otherwise defaults to 0", async () => {
      let exampleBlog = {
        title: "just the HTTP POST test at the end",
        author: "Some Dev",
        url: "https://idontknow.com/",
        // likes: 3,
      };
      const result = await api.post("/api/blogs").send(exampleBlog);

      if (!("likes" in result.toJSON())) {
        const tokenUser = await createToken();
        const blogs = await api
          .get("/api/blogs")
          .set({ Authorization: `Bearer ${tokenUser}` });
        const idNewPost = blogs.body[blogs.body.length - 1].id;

        const newPost = blogs.body.find((blog) => blog.id === idNewPost);

        expect(newPost.likes).toBeDefined();
      }
    });

    test("check if tile and url present otherwise status 400", async () => {
      exampleBlog = {
        // title: "just the HTTP PUT test",
        // author: "Some Dev",
        // url: "https://idontknow.com/",
        likes: 3,
      };
      const tokenUser = await createToken();
      const result = await api
        .post("/api/blogs")
        .set({ Authorization: `Bearer ${tokenUser}` })
        .send(exampleBlog);

      if (!("title" in result.body) && !("url" in result.body)) {
        expect(result.status).toBe(400);
      }
    });
  });
});
afterAll(() => {
  mongoose.connection.close();
});
