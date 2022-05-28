import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("blog tests", () => {
  const blog = {
    title: "example",
    author: "someone",
    url: "www.example.com",
    likes: 0,
    user: { name: "someone", username: "someone" },
  };
  const handleLikes = jest.fn();
  const handleRemoveBlog = jest.fn();
  const username = "ola";
  const token = "123";

  test("renders title and author and not url and likes by default", () => {
    render(
      <Blog
        blog={blog}
        username={username}
        token={token}
        handleLikes={handleLikes}
        handleRemoveBlog={handleRemoveBlog}
      />
    );
    let element = screen.queryByText(/example - someone/);
    expect(element).toBeDefined();

    element = screen.queryByText(/www.example.com/);
    expect(element).toBeNull();

    element = screen.queryByText(/likes/);
    expect(element).toBeNull();
  });

  test("renders likes and url after clicking view button", async () => {
    render(
      <Blog
        blog={blog}
        username={username}
        token={token}
        handleLikes={handleLikes}
        handleRemoveBlog={handleRemoveBlog}
      />
    );
    const user = userEvent.setup();
    const button = screen.getByText(/view/);
    await user.click(button);
    let element = screen.queryByText(/www.example.com/);
    expect(element).not.toBeNull();
    element = screen.queryByText(/likes 0/);
    expect(element).not.toBeNull();
  });
});
