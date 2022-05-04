import { useState } from "react";
import blogService from "./../services/blogs";
import helperService from "./../services/helper";

const Blog = ({ blog, user, setBlogs, blogs }) => {
  const [viewStatus, setViewStatus] = useState("view");
  const [likes, setLikes] = useState(blog.likes);

  const toggle = () =>
    viewStatus === "view" ? setViewStatus("hide") : setViewStatus("view");

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleRemove = async () => {
    if (window.confirm(`remove blog - ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.removeBlog(blog.id, user.token);
      } catch (exception) {
        return;
      }
      setBlogs(blogs.filter((x) => x.id !== blog.id));
    }
  };

  const handleLikes = async () => {
    const newBlog = {
      user: blog.user.id,
      likes: likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };

    setLikes(likes + 1);

    await blogService.updateBlog(blog.id, newBlog, user.token);

    // change the likes in blogs and sort
    const temp = [...blogs];
    const blogIndex = temp.findIndex((x) => x.id === blog.id);

    temp[blogIndex].likes = likes + 1;
    setBlogs(helperService.sortBlogs(temp));
  };

  return (
    <div style={blogStyle}>
      {blog.title} - {blog.author}{" "}
      <button onClick={() => toggle(viewStatus)}>{viewStatus}</button>
      {viewStatus === "hide" && (
        <div>
          {blog.url}
          <br />
          likes {likes} <button onClick={handleLikes}>like</button>
          <br />
          {blog.user.name}
          <br />
          {user.username === blog.user.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
