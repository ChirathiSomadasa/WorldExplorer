import { render, screen, fireEvent } from "@testing-library/react";
import SignUp from "../../pages/SignUp";
import { MemoryRouter } from "react-router-dom";

// Mock alert utilities
jest.mock("../../utils/Alert", () => ({
  showSuccessAlert: jest.fn(),
  showErrorAlert: jest.fn(),
}));

describe("SignUp - Unit Tests", () => {
  it("renders input fields correctly", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Enter your first name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your last name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
  });

  it("shows password when eye icon clicked", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const toggleBtn = screen.getByRole("button");

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
