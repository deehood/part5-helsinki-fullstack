import { useState } from "react";

import PropTypes from "prop-types";

const Blog = ({ blog, username, token, handleLikes, handleRemoveBlog }) => {
  const [viewStatus, setViewStatus] = useState("view");

  const toggle = () =>
    viewStatus === "view" ? setViewStatus("hide") : setViewStatus("view");

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div className="blogLine" style={blogStyle}>
      {blog.title} - {blog.author}{" "}
      <button onClick={() => toggle(viewStatus)}>{viewStatus}</button>
      {viewStatus === "hide" && (
        <div className="innerBlogLine">
          {blog.url}
          <br />
          likes {blog.likes}{" "}
          <button onClick={() => handleLikes(blog, token)}>like</button>
          <br />
          {blog.user.name}
          <br />
          {username === blog.user.username && (
            <button onClick={() => handleRemoveBlog(blog, token)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  handleLikes: PropTypes.func.isRequired,
  handleRemoveBlog: PropTypes.func.isRequired,
};

export default Blog;
