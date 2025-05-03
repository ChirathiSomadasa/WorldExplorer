import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "../../pages/SignUp";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";

// Mock alert utils and navigate
jest.mock("../../utils/Alert", () => ({
  showSuccessAlert: jest.fn((title, msg, callback) => callback && callback()),
  showErrorAlert: jest.fn(),
}));

jest.mock("axios");

describe("SignUp - Integration Tests", () => {
  it("submits form successfully and redirects", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: "Registered" } });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your first name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your last name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "abcd1234" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5002/api/user/register",
        expect.any(Object)
      )
    );
  });

  it("shows error if email already exists", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Email already in use" } },
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your first name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your last name"), {
      target: { value: "Smith" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "1234" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      const { showErrorAlert } = require("../utils/Alert");
      expect(showErrorAlert).toHaveBeenCalledWith(
        "Email Already in Use",
        "Please use another email."
      );
    });
  });
});
