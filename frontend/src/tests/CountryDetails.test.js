import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import axios from "axios";
import CountryDetails from "../pages/CountryDetails";

// Mock axios for API calls
jest.mock("axios");

describe("CountryDetails Component - Unit Tests", () => {
  const mockCountry = {
    name: "United States",
    capital: "Washington, D.C.",
    population: 331002651,
    region: "Americas",
    languages: ["English"],
    flag: "https://flagcdn.com/us.svg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state while fetching country details", async () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Simulate pending API call

    render(
      <MemoryRouter initialEntries={["/country/US"]}>
        <CountryDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading country details.../i)).toBeInTheDocument();
  });

  test("displays country details after successful API call", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountry });

    render(
      <MemoryRouter initialEntries={["/country/US"]}>
        <CountryDetails />
      </MemoryRouter>
    );

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(screen.getByText(mockCountry.name)).toBeInTheDocument();
    });

    // Check if key details are displayed
    expect(screen.getByText(mockCountry.capital)).toBeInTheDocument();
    expect(screen.getByText(mockCountry.region)).toBeInTheDocument();
    expect(screen.getByText(mockCountry.population.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(mockCountry.languages.join(", "))).toBeInTheDocument();
  });

  test("displays an error message when API call fails", async () => {
    axios.get.mockRejectedValueOnce({ response: { data: { error: "Failed to fetch country details" } } });

    render(
      <MemoryRouter initialEntries={["/country/INVALID"]}>
        <CountryDetails />
      </MemoryRouter>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch country details/i)).toBeInTheDocument();
    });
  });

  test("formats population correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountry });

    render(
      <MemoryRouter initialEntries={["/country/US"]}>
        <CountryDetails />
      </MemoryRouter>
    );

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(screen.getByText(mockCountry.population.toLocaleString())).toBeInTheDocument();
    });
  });

  test("formats languages as a comma-separated list", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountry });

    render(
      <MemoryRouter initialEntries={["/country/US"]}>
        <CountryDetails />
      </MemoryRouter>
    );

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(screen.getByText(mockCountry.languages.join(", "))).toBeInTheDocument();
    });
  });

  test("handles back button navigation", () => {
    render(
      <MemoryRouter initialEntries={["/country/US"]}>
        <CountryDetails />
      </MemoryRouter>
    );

    // Check if the back button is rendered
    const backButton = screen.getByRole("link", { name: /Back to Countries/i });
    expect(backButton).toHaveAttribute("href", "/");
  });
});