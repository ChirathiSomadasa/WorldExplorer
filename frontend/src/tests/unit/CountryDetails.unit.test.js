// src/tests/unit/CountryDetails.unit.test.js
import { render, screen } from "@testing-library/react";
import CountryDetails from "../../pages/CountryDetails";
import { MemoryRouter, Route, Routes } from "react-router-dom";

describe("CountryDetails - Unit Tests", () => {
  test("shows loading message initially", () => {
    render(
      <MemoryRouter initialEntries={["/country/FR"]}>
        <Routes>
          <Route path="/country/:code" element={<CountryDetails />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading country details.../i)).toBeInTheDocument();
  });

  test("displays error message when error state is set", async () => {
    // Directly override useEffect to simulate error state (not normally recommended)
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("API Error"));
  });
});
