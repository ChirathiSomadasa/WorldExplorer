import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import CountryDetails from "../../pages/CountryDetails"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import axios from "axios"

// Mock axios
jest.mock("axios")

const mockCountryData = {
  name: "United States",
  capital: "Washington D.C.",
  population: 331002651,
  region: "Americas",
  flag: "https://flagcdn.com/us.svg",
  languages: ["English"]
}

describe("CountryDetails Integration Tests", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockCountryData })
  })

  test("renders fetched country details", async () => {
    render(
      <MemoryRouter initialEntries={["/countries/US"]}>
        <Routes>
          <Route path="/countries/:code" element={<CountryDetails />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText("United States")).toBeInTheDocument()
    })

    expect(screen.getByText("Washington D.C.")).toBeInTheDocument()
    expect(screen.getByText("331,002,651")).toBeInTheDocument()
    expect(screen.getByText("Americas")).toBeInTheDocument()
    expect(screen.getByText("English")).toBeInTheDocument()
  })
})
