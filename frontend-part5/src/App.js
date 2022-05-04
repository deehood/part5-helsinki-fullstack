import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import helperService from "./services/helper";
import FormInputBlog from "./components/FormInputBlog";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [notification, setNotification] = useState(null);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [newPost, setNewPost] = useState(false);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      // could also do a async function inside usEffect
      blogService.getAll(user.token).then((data) => {
        setBlogs(helperService.sortBlogs(data));
      });
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
      handleNotification(exception.response.data.error, "error");
    }
  };

  const handleNotification = (exception, type = "normal") => {
    setNotification({ exception, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const loginForm = () => (
    <>
      <form onSubmit={handleLogin}>
        <div>
          <h2>Log in to application</h2>
          <Notification notification={notification} />
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
        <Notification notification={notification} />
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
        <button onClick={() => setNewPost(true)}>new post </button>
        {newPost && (
          <FormInputBlog
            setNewPost={setNewPost}
            handleNotification={handleNotification}
            blogs={blogs}
            setBlogs={setBlogs}
            user={user}
            blogService={blogService}
          />
        )}
        <br />
        <br />
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            setBlogs={setBlogs}
            blogs={blogs}
          />
        ))}
      </div>
    );
  };

  return user === null ? loginForm() : displayBlog();
};

export default App;
