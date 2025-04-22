import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Login from "../pages/Login";

// Mock axios for API calls
jest.mock("axios");

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the login form correctly", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Check if all input fields are present
    expect(screen.getByLabelText(/email or phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Check if the submit button is present
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();

    // Check if the sign-up link is present
    expect(screen.getByText(/don't have an account?/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test("updates form fields when user types", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Simulate typing into the email field
    const emailInput = screen.getByLabelText(/email or phone number/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");

    // Simulate typing into the password field
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    expect(passwordInput.value).toBe("Password123!");
  });

  test("toggles password visibility when the eye icon is clicked", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText(/password/i);
    const eyeIcon = screen.getByRole("button", { name: /show password/i });

    // Initially, the password field should be of type "password"
    expect(passwordInput.type).toBe("password");

    // Click the eye icon to toggle visibility
    fireEvent.click(eyeIcon);
    expect(passwordInput.type).toBe("text");

    // Click again to hide the password
    fireEvent.click(eyeIcon);
    expect(passwordInput.type).toBe("password");
  });

  test("displays an error message when login fails", async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { error: "Invalid credentials" } } });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/email or phone number/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("redirects to the home page after successful login", async () => {
    axios.post.mockResolvedValueOnce({ data: { token: "mockToken" } });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/email or phone number/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "correctpassword" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait for navigation to occur
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});