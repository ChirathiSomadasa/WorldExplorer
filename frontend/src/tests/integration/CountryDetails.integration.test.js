// src/tests/integration/CountryDetails.integration.test.js
import { render, screen, waitFor } from "@testing-library/react";
import CountryDetails from "../../pages/CountryDetails";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

const mockCountryData = {
  name: "France",
  capital: "Paris",
  population: 67000000,
  region: "Europe",
  flag: "https://flagcdn.com/fr.svg",
  languages: "French"
};

const renderComponent = () =>
  render(
    <MemoryRouter initialEntries={["/country/FR"]}>
      <Routes>
        <Route path="/country/:code" element={<CountryDetails />} />
      </Routes>
    </MemoryRouter>
  );

describe("CountryDetails - Integration Tests", () => {
  afterEach(() => jest.clearAllMocks());

  test("renders country details after successful fetch", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountryData });

    renderComponent();

    expect(screen.getByText(/Loading country details/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("France")).toBeInTheDocument();
      expect(screen.getByText("Paris")).toBeInTheDocument();
      expect(screen.getByText("Europe")).toBeInTheDocument();
      expect(screen.getByText("French")).toBeInTheDocument();
    });
  });

  test("shows error message if fetch fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("API failure"));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch country details/i)).toBeInTheDocument();
    });
  });
});
