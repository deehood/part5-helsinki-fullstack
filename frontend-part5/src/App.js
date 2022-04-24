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

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);

    try {
      const user = await loginService.login({ username, password });
      setUser(user);
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

  const displayBlog = () => {
    return (
      <div>
        <h2>Blogs</h2>
        <p>{user.name} logged in</p>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    );
  };

  return user === null ? loginForm() : displayBlog();
};

export default App;
