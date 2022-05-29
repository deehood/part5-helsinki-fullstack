import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormInputBlog from "./FormInputBlog";

describe("Input blog tests", () => {
  const mockSetNewPost = jest.fn();
  const mockHandleCreateBlog = jest.fn();

  test("form calls event handler with the right details", async () => {
    render(
      <FormInputBlog
        setNewPost={mockSetNewPost}
        handleCreateBlog={mockHandleCreateBlog}
      />
    );
    const user = userEvent.setup();

    const createButton = screen.getByRole("button", { name: /create/ });
    const input = screen.getAllByRole("textbox");

    await user.type(input[0], "New Book");
    await user.type(input[1], "John Wayne");
    await user.type(input[2], "wwww.something.org");

    fireEvent.submit(createButton);

    expect(mockHandleCreateBlog.mock.calls[0][1].title).toBe("New Book");
    expect(mockHandleCreateBlog.mock.calls[0][1].author).toBe("John Wayne");
    expect(mockHandleCreateBlog.mock.calls[0][1].url).toBe(
      "wwww.something.org"
    );
  });
});
