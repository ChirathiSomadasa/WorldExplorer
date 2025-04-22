const request = require("supertest");
const express = require("express");
const axios = require("axios");
const countryRouter = require("../../routes/country_route");

// Mock axios
jest.mock("axios");

const app = express();
app.use(express.json());
app.use("/api/countries", countryRouter);

describe("Country Routes - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /all - Get All Countries with Pagination and Filters", () => {
    it("should return paginated and filtered countries", async () => {
      const mockCountries = [
        {
          name: { common: "United States" },
          population: 331002651,
          region: "Americas",
          languages: { eng: "English" },
          flags: { png: "https://flagcdn.com/us.svg" },
          capital: ["Washington, D.C."],
        },
        {
          name: { common: "India" },
          population: 1380004385,
          region: "Asia",
          languages: { hin: "Hindi", eng: "English" },
          flags: { png: "https://flagcdn.com/in.svg" },
          capital: ["New Delhi"],
        },
      ];

      axios.get.mockResolvedValue({ data: mockCountries });

      const response = await request(app)
        .get("/api/countries/all")
        .query({ page: 1, limit: 10, name: "United", region: "Americas" });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(10);
      expect(response.body.totalPages).toBe(1);
      expect(response.body.currentPage).toBe(1);
      expect(response.body.data[0].name).toBe("United States");
    });

    it("should handle empty results after filtering", async () => {
      axios.get.mockResolvedValue({ data: [] });

      const response = await request(app)
        .get("/api/countries/all")
        .query({ name: "NonExistentCountry" });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
      expect(response.body.totalPages).toBe(0);
      expect(response.body.currentPage).toBe(1);
    });
  });

  describe("GET /filters - Fetch All Unique Regions and Languages", () => {
    it("should return unique regions and languages", async () => {
      const mockCountries = [
        { region: "Americas", languages: { eng: "English" } },
        { region: "Asia", languages: { hin: "Hindi", eng: "English" } },
      ];

      axios.get.mockResolvedValue({ data: mockCountries });

      const response = await request(app).get("/api/countries/filters");

      expect(response.status).toBe(200);
      expect(response.body.regions).toEqual(["Americas", "Asia"]);
      expect(response.body.languages).toEqual(["English", "Hindi"]);
    });
  });

  describe("GET /name/:name - Search Country by Name", () => {
    it("should return paginated results for a valid name", async () => {
      const mockCountries = [
        {
          name: { common: "United States" },
          population: 331002651,
          region: "Americas",
          languages: { eng: "English" },
          flags: { png: "https://flagcdn.com/us.svg" },
          capital: ["Washington, D.C."],
        },
      ];

      axios.get.mockResolvedValue({ data: mockCountries });

      const response = await request(app)
        .get("/api/countries/name/United")
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toBe("United States");
      expect(response.body.totalPages).toBe(1);
      expect(response.body.currentPage).toBe(1);
    });

    it("should return 404 for a non-existent name", async () => {
      axios.get.mockRejectedValue({ response: { status: 404 } });

      const response = await request(app).get("/api/countries/name/InvalidName");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Country not found");
    });
  });

  describe("GET /region/:region - Filter Countries by Region", () => {
    it("should return paginated results for a valid region", async () => {
      const mockCountries = [
        {
          name: { common: "United States" },
          population: 331002651,
          region: "Americas",
          languages: { eng: "English" },
          flags: { png: "https://flagcdn.com/us.svg" },
          capital: ["Washington, D.C."],
        },
      ];

      axios.get.mockResolvedValue({ data: mockCountries });

      const response = await request(app)
        .get("/api/countries/region/Americas")
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data[0].region).toBe("Americas");
      expect(response.body.totalPages).toBe(1);
      expect(response.body.currentPage).toBe(1);
    });

    it("should return 404 for a non-existent region", async () => {
      axios.get.mockRejectedValue({ response: { status: 404 } });

      const response = await request(app).get("/api/countries/region/InvalidRegion");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Region not found");
    });
  });

  describe("GET /alpha/:code - Get Country Details by Code or Name", () => {
    it("should return country details for a valid alpha code", async () => {
      const mockCountry = {
        name: { common: "United States" },
        population: 331002651,
        region: "Americas",
        languages: { eng: "English" },
        flags: { png: "https://flagcdn.com/us.svg" },
        capital: ["Washington, D.C."],
      };

      axios.get.mockResolvedValue({ data: mockCountry });

      const response = await request(app).get("/api/countries/alpha/US");

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("United States");
      expect(response.body.population).toBe(331002651);
      expect(response.body.region).toBe("Americas");
      expect(response.body.languages).toBe("English");
    });

    it("should return country details for a valid name", async () => {
      const mockCountry = {
        name: { common: "United States" },
        population: 331002651,
        region: "Americas",
        languages: { eng: "English" },
        flags: { png: "https://flagcdn.com/us.svg" },
        capital: ["Washington, D.C."],
      };

      axios.get.mockResolvedValue({ data: [mockCountry] });

      const response = await request(app).get("/api/countries/alpha/United%20States");

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("United States");
    });

    it("should return 404 for an invalid code or name", async () => {
      axios.get.mockRejectedValue({ response: { status: 404 } });

      const response = await request(app).get("/api/countries/alpha/InvalidCode");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Country not found");
    });
  });
});