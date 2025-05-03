import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../pages/Login";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

// Mock Axios
jest.mock("axios");

// Mock SweetAlert utils
jest.mock("../../utils/Alert", () => ({
  showSuccessAlert: jest.fn((title, message, callback) => callback?.()),
  showErrorAlert: jest.fn(),
}));

describe("Login Component - Integration Test", () => {
  const mockSetIsAuthenticated = jest.fn();

  const renderLogin = () =>
    render(
      <AuthContext.Provider value={{ setIsAuthenticated: mockSetIsAuthenticated }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );

  test("successful login flow", async () => {
    axios.post.mockResolvedValueOnce({
      data: { token: "mocked_token" },
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem("auth_token")).toBe("mocked_token");
      expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
    });
  });

  test("handles login error response", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: "Invalid credentials" } },
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      const { showErrorAlert } = require("../utils/Alert");
      expect(showErrorAlert).toHaveBeenCalledWith("Login Failed", "Invalid credentials");
    });
  });
});
