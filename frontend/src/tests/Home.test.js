import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Home from "../pages/Home";

// Mock axios for API calls
jest.mock("axios");

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key]),
    setItem: jest.fn((key, value) => (store[key] = value)),
    removeItem: jest.fn((key) => delete store[key]),
    clear: jest.fn(() => (store = {})),
  };
})();

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("Home Component - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  it("renders the home page correctly", async () => {
    axios.get.mockResolvedValue({
      data: {
        data: [],
        totalPages: 1,
      },
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Check if the hero section is rendered
    expect(screen.getByText(/Discover the World/i)).toBeInTheDocument();

    // Check if the search bar is rendered
    const searchBar = screen.getByPlaceholderText(/Search for a country.../i);
    expect(searchBar).toBeInTheDocument();

    // Check if the filter toggle button is rendered
    const filterButton = screen.getByRole("button", { name: /Filters/i });
    expect(filterButton).toBeInTheDocument();

    // Check if the featured countries section is rendered
    expect(screen.getByText(/Featured Countries/i)).toBeInTheDocument();
  });

  it("searches for countries when the search input changes", async () => {
    const mockCountries = [
      { name: "United States", capital: "Washington, D.C.", region: "Americas", population: 331002651, flag: "us-flag-url" },
      { name: "India", capital: "New Delhi", region: "Asia", population: 1380004385, flag: "in-flag-url" },
    ];

    axios.get.mockResolvedValueOnce({
      data: {
        data: mockCountries,
        totalPages: 1,
      },
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Simulate typing into the search bar
    const searchBar = screen.getByPlaceholderText(/Search for a country.../i);
    fireEvent.change(searchBar, { target: { value: "United" } });

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("http://localhost:5002/api/countries/all", {
        params: {
          page: 1,
          limit: 12,
          name: "United",
          region: "",
          language: "",
        },
      });
    });

    // Check if the correct countries are displayed
    expect(screen.getByText(/United States/i)).toBeInTheDocument();
  });

  it("applies filters when the filter form is submitted", async () => {
    const mockCountries = [
      { name: "United States", capital: "Washington, D.C.", region: "Americas", population: 331002651, flag: "us-flag-url" },
    ];

    axios.get.mockResolvedValueOnce({
      data: {
        data: mockCountries,
        totalPages: 1,
      },
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Open the filter menu
    const filterButton = screen.getByRole("button", { name: /Filters/i });
    fireEvent.click(filterButton);

    // Select a region filter
    const regionFilter = screen.getByLabelText(/Region/i);
    fireEvent.change(regionFilter, { target: { value: "Americas" } });

    // Submit the filter form
    const applyFiltersButton = screen.getByRole("button", { name: /Apply Filters/i });
    fireEvent.click(applyFiltersButton);

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("http://localhost:5002/api/countries/all", {
        params: {
          page: 1,
          limit: 12,
          name: "",
          region: "Americas",
          language: "",
        },
      });
    });

    // Check if the filtered country is displayed
    expect(screen.getByText(/United States/i)).toBeInTheDocument();
  });

  it("resets filters when the reset button is clicked", async () => {
    const mockCountries = [];

    axios.get.mockResolvedValueOnce({
      data: {
        data: mockCountries,
        totalPages: 1,
      },
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Open the filter menu
    const filterButton = screen.getByRole("button", { name: /Filters/i });
    fireEvent.click(filterButton);

    // Select a region filter
    const regionFilter = screen.getByLabelText(/Region/i);
    fireEvent.change(regionFilter, { target: { value: "Americas" } });

    // Reset filters
    const resetFiltersButton = screen.getByRole("button", { name: /Reset/i });
    fireEvent.click(resetFiltersButton);

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("http://localhost:5002/api/countries/all", {
        params: {
          page: 1,
          limit: 12,
          name: "",
          region: "",
          language: "",
        },
      });
    });

    // Check if no countries are displayed
    expect(screen.queryByText(/United States/i)).not.toBeInTheDocument();
  });

  it("toggles favorite status when the favorite icon is clicked", async () => {
    const mockCountries = [
      { name: "United States", capital: "Washington, D.C.", region: "Americas", population: 331002651, flag: "us-flag-url" },
    ];

    axios.get.mockResolvedValueOnce({
      data: {
        data: mockCountries,
        totalPages: 1,
      },
    });

    axios.post.mockResolvedValueOnce({
      data: {
        favorites: ["United States"],
      },
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    // Click the favorite icon
    const favoriteIcon = screen.getByLabelText(/Add to favorites/i);
    fireEvent.click(favoriteIcon);

    // Wait for the favorite toggle API call to resolve
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5002/api/user/favorites",
        { countryCode: "United States" },
        { headers: { Authorization: "Bearer null" } }
      );
    });

    // Check if the favorite icon is updated
    expect(screen.getByLabelText(/Remove from favorites/i)).toBeInTheDocument();
  });

  it("displays an error message when fetching countries fails", async () => {
    axios.get.mockRejectedValueOnce({ response: { data: { error: "Failed to fetch countries" } } });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Wait for the API call to fail
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch countries/i)).toBeInTheDocument();
    });
  });

  it("navigates to the next page when the 'Next' button is clicked", async () => {
    const mockCountries = [
      { name: "United States", capital: "Washington, D.C.", region: "Americas", population: 331002651, flag: "us-flag-url" },
    ];

    axios.get.mockResolvedValue({
      data: {
        data: mockCountries,
        totalPages: 2,
      },
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Click the 'Next' button
    const nextButton = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextButton);

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("http://localhost:5002/api/countries/all", {
        params: {
          page: 2,
          limit: 12,
          name: "",
          region: "",
          language: "",
        },
      });
    });
  });
});