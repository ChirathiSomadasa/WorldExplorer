const express = require("express");
const axios = require("axios");

const router = express.Router();
require("dotenv").config();
// Base URL from environment variable
const BASE_URL = process.env.BASE_URL;

//Get All Countries with Pagination and Filters
router.get("/all", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 12; // Default to 10 items per page
  const name = req.query.name || ""; // Search query
  const region = req.query.region || ""; // Region filter
  const language = req.query.language || ""; // Language filter

  try {
    const response = await axios.get(`${BASE_URL}/all`);
    let countries = response.data.map((country) => ({
      name: country.name.common,
      population: country.population,
      region: country.region,
      languages: Object.values(country.languages || {}).join(", "),
      flag: country.flags.png,
      capital: country.capital ? country.capital[0] : "N/A",
    }));

    // Apply filters
    if (name.trim() !== "") {
      countries = countries.filter((country) =>
        country.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (region.trim() !== "") {
      countries = countries.filter((country) => country.region === region);
    }
    if (language.trim() !== "") {
      countries = countries.filter((country) =>
        country.languages.toLowerCase().includes(language.toLowerCase())
      );
    }

    // Paginate the results
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCountries = countries.slice(startIndex, endIndex);

    res.status(200).json({
      data: paginatedCountries,
      totalPages: Math.ceil(countries.length / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching countries:", error.message);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

//Fetch All Unique Regions and Languages for Filters
router.get("/filters", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/all`);
    const regions = [...new Set(response.data.map((country) => country.region))].filter(Boolean); // Unique regions
    const languages = [...new Set(
      response.data.flatMap((country) => Object.values(country.languages || {}))
    )]; // Unique languages
    res.status(200).json({ regions, languages });
  } catch (error) {
    console.error("Error fetching filters:", error.message);
    res.status(500).json({ error: "Failed to fetch filters" });
  }
});

//Search Country by Name
router.get("/name/:name", async (req, res) => {
  const { name } = req.params;
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 12; // Default to 10 items per page

  try {
    const response = await axios.get(`${BASE_URL}/name/${name}`);
    const countries = response.data.map((country) => ({
      name: country.name.common,
      population: country.population,
      region: country.region,
      languages: Object.values(country.languages || {}).join(", "),
      flag: country.flags.png,
      capital: country.capital ? country.capital[0] : "N/A",
    }));

    // Paginate the results
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCountries = countries.slice(startIndex, endIndex);

    res.status(200).json({
      data: paginatedCountries,
      totalPages: Math.ceil(countries.length / limit),
      currentPage: page,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "Country not found" });
    }
    res.status(500).json({ error: "Failed to fetch country" });
  }
});

//Filter Countries by Region
router.get("/region/:region", async (req, res) => {
  const { region } = req.params;
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

  try {
    const response = await axios.get(`${BASE_URL}/region/${region}`);
    const countries = response.data.map((country) => ({
      name: country.name.common,
      population: country.population,
      region: country.region,
      languages: Object.values(country.languages || {}).join(", "),
      flag: country.flags.png,
      capital: country.capital ? country.capital[0] : "N/A",
    }));

    // Paginate the results
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCountries = countries.slice(startIndex, endIndex);

    res.status(200).json({
      data: paginatedCountries,
      totalPages: Math.ceil(countries.length / limit),
      currentPage: page,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "Region not found" });
    }
    res.status(500).json({ error: "Failed to fetch countries by region" });
  }
});

// Get Country Details by Code or Name
router.get("/alpha/:code", async (req, res) => {
  const { code } = req.params;

  try {
    let response;
    if (code.length === 2 || code.length === 3) {
      // If the code is an alpha-2 or alpha-3 code, use the /alpha endpoint
      response = await axios.get(`${BASE_URL}/alpha/${code}`);
    } else {
      // If the code is not a valid alpha code, assume it's a name
      response = await axios.get(`${BASE_URL}/name/${encodeURIComponent(code)}`);
    }

    const country = Array.isArray(response.data) ? response.data[0] : response.data;
    const formattedCountry = {
      name: country.name.common,
      population: country.population,
      region: country.region,
      languages: Object.values(country.languages || {}).join(", "),
      flag: country.flags.png,
      capital: country.capital ? country.capital[0] : "N/A",
    };

    res.status(200).json(formattedCountry);
  } catch (error) {
    console.error("Error fetching country details:", error.message);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "Country not found" });
    }
    res.status(500).json({ error: "Failed to fetch country details" });
  }
});

module.exports = router;