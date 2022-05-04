import { useState } from "react";

const Blog = ({ blog }) => {
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
  // console.log(blog.user);
  return (
    <div style={blogStyle}>
      {blog.title} - {blog.author}{" "}
      <button onClick={() => toggle(viewStatus)}>{viewStatus}</button>
      {viewStatus === "hide" && (
        <div>
          {blog.url}
          <br />
          likes {blog.likes} <button>like</button>
          <br />
          {blog.user.name}
        </div>
      )}
    </div>
  );
};

export default Blog;
