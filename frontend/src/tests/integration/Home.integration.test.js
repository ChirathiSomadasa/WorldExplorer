// src/tests/integration/Home.integration.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import Home from "../../pages/Home";

jest.mock("axios");

const mockFilters = {
  regions: ["Asia", "Europe"],
  languages: ["English", "French"]
};

const mockCountries = {
  data: {
    data: [
      { name: "France", capital: "Paris", region: "Europe", population: 67000000, flag: "https://flagcdn.com/fr.svg" },
      { name: "Sri Lanka", capital: "Colombo", region: "Asia", population: 21000000, flag: "https://flagcdn.com/lk.svg" }
    ],
    totalPages: 1
  }
};

describe("Home Page - Integration Tests", () => {
  beforeEach(() => {
    // Mock filters endpoint
    axios.get.mockImplementation((url) => {
      if (url.includes("/filters")) {
        return Promise.resolve({ data: mockFilters });
      } else if (url.includes("/countries/all")) {
        return Promise.resolve(mockCountries);
      } else if (url.includes("/favorites")) {
        return Promise.resolve({ data: { favorites: ["France"] } });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("loads and displays countries", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("France")).toBeInTheDocument();
      expect(screen.getByText("Sri Lanka")).toBeInTheDocument();
    });
  });

  test("search filters the countries", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("France"));

    const searchInput = screen.getByPlaceholderText(/Search for a country/i);
    fireEvent.change(searchInput, { target: { value: "France" } });

    // Wait for re-render after search
    await waitFor(() => {
      expect(screen.getByText("France")).toBeInTheDocument();
    });
  });

  test("displays active filter tags", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const filterBtn = screen.getByRole("button", { name: /Filters/i });
    fireEvent.click(filterBtn);

    const regionSelect = screen.getByLabelText(/Region/i);
    fireEvent.change(regionSelect, { target: { value: "Asia" } });

    const applyBtn = screen.getByRole("button", { name: /Apply Filters/i });
    fireEvent.click(applyBtn);

    await waitFor(() => {
      expect(screen.getByText(/Region: Asia/i)).toBeInTheDocument();
    });
  });
});
