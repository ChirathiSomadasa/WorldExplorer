import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Login from "../../pages/Login";
import axios from "axios";

jest.mock("axios");

const renderWithProviders = (ui, authContextOverrides = {}) => {
  const defaultContext = {
    setIsAuthenticated: jest.fn(),
  };

  return {
    ...render(
      <BrowserRouter>
        <AuthContext.Provider value={{ ...defaultContext, ...authContextOverrides }}>
          {ui}
        </AuthContext.Provider>
      </BrowserRouter>
    ),
    mockSetAuth: defaultContext.setIsAuthenticated,
  };
};

describe("Login Component - Integration Tests", () => {
  test("submits form and navigates on successful login", async () => {
    const mockNavigate = jest.fn();
    const token = "mock_token";
    axios.post.mockResolvedValueOnce({ data: { token } });

    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    const { mockSetAuth } = renderWithProviders(<Login />);

    fireEvent.change(screen.getByLabelText(/Email or phone number/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5002/api/user/login",
        { email: "user@example.com", password: "password123" },
        { withCredentials: true }
      );
      expect(localStorage.getItem("auth_token")).toBe(token);
      expect(mockSetAuth).toHaveBeenCalledWith(true);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("shows error message on failed login", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: "Invalid credentials" } },
    });

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByLabelText(/Email or phone number/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    const errorMessage = await screen.findByText(/Invalid credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
