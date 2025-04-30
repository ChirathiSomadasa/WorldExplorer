import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignUp from "../../pages/Signup";
import axios from "axios";

jest.mock("axios");

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("SignUp Component - Integration Test", () => {
  test("submits the form successfully and redirects", async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    const mockNavigate = jest.fn();

    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    renderWithRouter(<SignUp />);

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("shows error message on failed signup", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: "User already exists" } },
    });

    renderWithRouter(<SignUp />);

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: "Smith" } });
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "pass1234" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    const errorMessage = await screen.findByText(/User already exists/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
