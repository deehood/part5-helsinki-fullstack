import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [inputBlog, setInputBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      // could also do a async function inside useffect
      blogService.getAll(user.token).then((blogs) => setBlogs(blogs));
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    window.location.reload();
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      window.localStorage.setItem("loggedUser", JSON.stringify(user));

      const data = await blogService.getAll(user.token);
      setBlogs(data);
    } catch (exception) {
      setUsername("");
      setPassword("");
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <>
      {errorMessage}
      <form onSubmit={handleLogin}>
        <div>
          <h2>Log in to application</h2>
          username
          <input
            autoComplete="off"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          password
          <input
            autoComplete="off"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button>Login</button>
        </div>
      </form>
    </>
  );

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    await blogService.createBlog(inputBlog, user.token);

    setBlogs(blogs.concat(inputBlog));
  };

  const displayBlog = () => {
    return (
      <div>
        <h2>Blogs</h2>
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
        <h3>Create new</h3>
        <form onSubmit={handleCreateBlog}>
          title:{" "}
          <input
            value={inputBlog.title}
            name="title"
            onChange={(e) =>
              setInputBlog({ ...inputBlog, [e.target.name]: e.target.value })
            }
            autoComplete="off"
            type="text"
          ></input>
          <br />
          author:{" "}
          <input
            value={inputBlog.author}
            name="author"
            onChange={(e) =>
              setInputBlog({ ...inputBlog, [e.target.name]: e.target.value })
            }
            autoComplete="off"
            type="text"
          ></input>
          <br />
          url:{" "}
          <input
            value={inputBlog.url}
            name="url"
            onChange={(e) =>
              setInputBlog({ ...inputBlog, [e.target.name]: e.target.value })
            }
            autoComplete="off"
            type="text"
          ></input>
          <br />
          <button>create</button>
          <br />
          <br />
        </form>

        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    );
  };

  return user === null ? loginForm() : displayBlog();
};

export default App;
