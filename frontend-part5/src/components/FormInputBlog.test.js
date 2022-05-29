import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormInputBlog from "./FormInputBlog";

describe("Input blog tests", () => {
  const newBlog = {
    title: "New Book",
    author: "John Wayne",
    url: "wwww.somethng.org",
  };

  const mockSetNewPost = jest.fn();
  const mockHandleCreateBlog = jest.fn();

  test("form calls event handler with the right detail", async () => {
    render(
      <FormInputBlog
        setNewPost={mockSetNewPost}
        handleCreateBlog={mockHandleCreateBlog}
      />
    );
    const user = userEvent.setup();

    const createButton = screen.getByRole("button", { name: /create/ });
    const input = screen.getAllByRole("textbox")[0];

    await user.type(input, "teste");

    await user.click(createButton);
    expect(mockHandleCreateBlog.mock.calls).toHaveLength(1);
    expect(mockHandleCreateBlog.mock.calls[0][0].content).toBe("teste");
  });
});
