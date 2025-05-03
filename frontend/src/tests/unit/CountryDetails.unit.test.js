import React from "react"
import { render, screen } from "@testing-library/react"
import CountryDetails from "../../pages/CountryDetails"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import axios from "axios"

// Mock axios
jest.mock("axios")

// Mock useParams from react-router-dom
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom")
  return {
    ...originalModule,
    useParams: () => ({ code: "US" }),
    Link: (props) => <a {...props}>{props.children}</a>,
  }
})

describe("CountryDetails Unit Tests", () => {
  test("shows loading initially", () => {
    render(
      <MemoryRouter>
        <CountryDetails />
      </MemoryRouter>
    )

    expect(screen.getByText(/loading country details/i)).toBeInTheDocument()
  })

  test("shows error message on fetch failure", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"))

    render(
      <MemoryRouter initialEntries={["/countries/US"]}>
        <Routes>
          <Route path="/countries/:code" element={<CountryDetails />} />
        </Routes>
      </MemoryRouter>
    )

    const errorMessage = await screen.findByText(/failed to fetch country details/i)
    expect(errorMessage).toBeInTheDocument()
  })
})
