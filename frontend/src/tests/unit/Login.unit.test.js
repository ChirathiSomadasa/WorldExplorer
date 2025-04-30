import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Login from "../../pages/Login";

const renderWithContext = (ui) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ setIsAuthenticated: jest.fn() }}>
        {ui}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe("Login Component - Unit Tests", () => {
  test("renders form fields and login button", () => {
    renderWithContext(<Login />);
    expect(screen.getByLabelText(/Email or phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("allows password visibility toggle", () => {
    renderWithContext(<Login />);
    const passwordInput = screen.getByLabelText(/Password/i);
    const toggleButton = screen.getByRole("button", { name: /show password/i });

    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  test("updates input values correctly", () => {
    renderWithContext(<Login />);
    const emailInput = screen.getByLabelText(/Email or phone number/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("123456");
  });
});
