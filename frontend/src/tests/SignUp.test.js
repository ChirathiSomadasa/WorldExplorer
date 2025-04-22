import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // Wrap with BrowserRouter
import SignUp from "../pages/SignUp"; // Adjusted relative import for SignUp
import axios from "axios";

// Mock axios for API calls
jest.mock("axios");

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SignUp Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the signup form", () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    expect(screen.getByText(/Sign up now/i)).toBeInTheDocument();
  });

  test("submits the form and calls the API", async () => {
    axios.post.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/First name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5002/api/user/register",
        {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          password: "password123",
        }
      );
    });

    // Ensure navigation occurs after successful registration
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("shows an error message on API failure", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: "Registration failed" } },
    });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/First name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText(/Last name/i), {
      target: { value: "Smith" },
    });
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: "jane.smith@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });
});