import { useState } from "react";
const FormInputBlog = ({
  setNewPost,
  handleNotification,
  blogs,
  setBlogs,
  user,
  blogService,
}) => {
  const [inputBlog, setInputBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const clearInputBlog = () => setInputBlog({ title: "", author: "", url: "" });

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    let blogPost = {};
    try {
      blogPost = await blogService.createBlog(inputBlog, user.token);

      // put user object (with name) back in blog
      blogPost.user = await blogService.getPosterNameById(
        blogPost.id,
        user.token
      );
    } catch (exception) {
      exception.response.data.error
        ? handleNotification(exception.response.data.error, "error")
        : handleNotification(exception.response.statusText, "error");

      return;
    }

    setBlogs(blogs.concat(blogPost));
    await handleNotification(`${inputBlog.title} by ${inputBlog.author}`);

    clearInputBlog();
    setNewPost(false);
  };

  return (
    <>
      <h3>Create new</h3>
      <form onSubmit={handleCreateBlog}>
        title:{" "}
        <input
          value={inputBlog.title}
          name="title"
          onChange={(e) =>
            setInputBlog({
              ...inputBlog,
              [e.target.name]: e.target.value,
            })
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
            setInputBlog({
              ...inputBlog,
              [e.target.name]: e.target.value,
            })
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
            setInputBlog({
              ...inputBlog,
              [e.target.name]: e.target.value,
            })
          }
          autoComplete="off"
          type="text"
        ></input>
        <br />
        <button>create</button>
        <button
          onClick={() => {
            setNewPost(false);
            clearInputBlog();
          }}
        >
          cancel
        </button>
      </form>
    </>
  );
};

export default FormInputBlog;
