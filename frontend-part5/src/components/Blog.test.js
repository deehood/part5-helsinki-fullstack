import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    title: "example",
    author: "someone",
  };
  const handleLikes = jest.fn();
  const handleRemove = jest.fn();

  render(
    <Blog blog={blog} handleLikes={handleLikes} handleRemove={handleRemove} />
  );

  const element = screen.getByText("example");
  // expect(element).toBeDefined();
});
