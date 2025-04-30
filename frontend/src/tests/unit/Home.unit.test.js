// src/tests/unit/Home.unit.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../../pages/Home";

const renderHome = () => render(
  <BrowserRouter>
    <Home />
  </BrowserRouter>
);

describe("Home Page - Unit Tests", () => {
  test("renders hero title and search input", () => {
    renderHome();
    expect(screen.getByText(/Discover the World/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search for a country/i)).toBeInTheDocument();
  });

  test("search input updates on change", () => {
    renderHome();
    const searchInput = screen.getByPlaceholderText(/Search for a country/i);
    fireEvent.change(searchInput, { target: { value: "Sri Lanka" } });
    expect(searchInput).toHaveValue("Sri Lanka");
  });

  test("toggle filters panel on button click", () => {
    renderHome();
    const filterButton = screen.getByRole("button", { name: /Filters/i });
    fireEvent.click(filterButton);
    expect(screen.getByText(/Filter Countries/i)).toBeInTheDocument();
  });
});
