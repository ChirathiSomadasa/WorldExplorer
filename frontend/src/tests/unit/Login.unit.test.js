import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../../pages/Login";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

// Wrapper to include context + router
const renderWithContext = (ui, { providerProps }) => {
  return render(
    <AuthContext.Provider value={providerProps}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthContext.Provider>
  );
};

describe("Login Component - Unit Tests", () => {
  const providerProps = { setIsAuthenticated: jest.fn() };

  test("renders email and password fields", () => {
    renderWithContext(<Login />, { providerProps });

    expect(screen.getByLabelText(/Email or phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test("shows password when toggle is clicked", () => {
    renderWithContext(<Login />, { providerProps });

    const passwordInput = screen.getByLabelText(/Password/i);
    const toggleButton = screen.getByRole("button", { name: /show password/i });

    // Initially type is password
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);

    // After toggle, type should be text
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  test("form input values update on change", () => {
    renderWithContext(<Login />, { providerProps });

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("secret");
  });
});
