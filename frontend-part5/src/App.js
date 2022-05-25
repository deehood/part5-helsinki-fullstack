import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import helperService from "./services/helper";
import FormInputBlog from "./components/FormInputBlog";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const [notification, setNotification] = useState(null);

  const [newPost, setNewPost] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      // could also do a async function inside usEffect
      blogService
        .getAll(user.token)
        .then((data) => setBlogs(helperService.sortBlogs(data)));
    }
  }, []);

  const handleNotification = (exception, type = "normal") => {
    setNotification({ exception, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
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
      handleNotification(exception.response.data.error, "error", setBlogs);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    window.location.reload();
  };

  const handleRemoveBlog = async (blog, token) => {
    if (window.confirm(`remove blog - ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.removeBlog(blog.id, token);
      } catch (exception) {
        return;
      }
      setBlogs(blogs.filter((x) => x.id !== blog.id));
    }
  };

  const handleLikes = async (blog, token) => {
    const newBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };

    await blogService.updateBlog(blog.id, newBlog, token);

    // change the likes in blogs and sort
    const temp = [...blogs];
    const blogIndex = temp.findIndex((x) => x.id === blog.id);
    temp[blogIndex].likes = newBlog.likes;
    setBlogs(helperService.sortBlogs([...temp]));
  };

  const DisplayBlog = () => {
    return (
      <div>
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
          <>
            <Blog
              key={blog.id}
              blog={blog}
              username={user.username}
              token={user.token}
              handleLikes={handleLikes}
              handleRemove={handleRemoveBlog}
            />
          </>
        ))}
      </div>
    );
  };

  return (
    <>
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
      </div>
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <DisplayBlog />
      )}
    </>
  );
};

export default App;
