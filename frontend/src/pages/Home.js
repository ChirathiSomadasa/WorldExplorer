import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  FilterAlt as FilterIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import HomeLandingPageImage from "../images/home.jpg";

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    region: "",
    language: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([]);

  // Fetch all available regions and languages dynamically
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/countries/filters");
        setAvailableRegions(response.data.regions);
        setAvailableLanguages(response.data.languages);
      } catch (err) {
        setError("Failed to fetch filters");
      }
    };
    fetchFilters();
  }, []);

  // Fetch countries with pagination and filters
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5002/api/countries/all", {
          params: {
            page: currentPage,
            limit: 12,
            name: searchQuery,
            region: filters.region,
            language: filters.language,
          },
        });
        setCountries(response.data.data);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch countries");
        setLoading(false);
      }
    };
    fetchCountries();
  }, [currentPage, filters, searchQuery]);

  // Fetch user favorites when the component loads
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("auth_token"); // Retrieve token from localStorage
      if (!token) {
        return; // No need to fetch if the user isn't logged in
      }

      try {
        const response = await axios.get("http://localhost:5002/api/user/favorites", {
          headers: { Authorization: `Bearer ${token}` }, // Send token in Authorization header
        });
        setFavorites(response.data.favorites); // Update favorites state
      } catch (err) {
        console.error("Error fetching favorites:", err.response?.data || err.message);
        alert("Failed to fetch favorites.");
      }
    };

    fetchFavorites(); // Call the function
  }, []); // Empty dependency array ensures this runs only once on component mount

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when applying filters
  };

  // Apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    // Filters are already applied via useEffect dependency
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      region: "",
      language: "",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Toggle favorite status
  const toggleFavorite = async (countryName) => {
    const token = localStorage.getItem("auth_token"); // Retrieve token from localStorage
    if (!token) {
      alert("Please log in to save favorites.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5002/api/user/favorites",
        { countryCode: countryName },
        { headers: { Authorization: `Bearer ${token}` } } // Send token in Authorization header
      );
      setFavorites(response.data.favorites); // Update favorites state
    } catch (err) {
      console.error("Error toggling favorite:", err.response?.data || err.message);
      alert("Failed to update favorites.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-[#035ca1]">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src={HomeLandingPageImage || "/placeholder.svg?height=600&width=1200"}
            alt="World map background"
          />
          <div className="absolute inset-0 bg-[#046bba] mix-blend-multiply" aria-hidden="true"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white lg:text-6xl">
            Discover the World
          </h1>
          <p className="mt-4 sm:mt-6 max-w-3xl text-lg sm:text-xl text-blue-100">
            Explore detailed information about countries, cultures, and travel destinations around the globe.
          </p>
          {/* Search Bar with Filter Toggle */}
          <div className="mt-8 sm:mt-10 max-w-xl">
            <form onSubmit={applyFilters} className="flex flex-col sm:flex-row">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-md sm:rounded-l-md sm:rounded-r-none leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#046bba]"
                  placeholder="Search for a country..."
                />
              </div>
              <div className="flex mt-2 sm:mt-0">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md sm:rounded-l-none sm:rounded-r-md text-white bg-[#298bd6] hover:bg-[#046bba] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#046bba]"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="ml-2 flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#298bd6] hover:bg-[#046bba] focus:outline-none focus:ring-2 focus:ring-white"
                  aria-expanded={showFilters}
                >
                  <FilterIcon className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              </div>
            </form>
            {/* Filter Bar */}
            {showFilters && (
              <div className="mt-4 bg-white rounded-md shadow-lg p-4 transition-all duration-300 ease-in-out">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-900">Filter Countries</h3>
                  <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-500">
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Region Filter */}
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={filters.region}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Regions</option>
                      {availableRegions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Language Filter */}
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={filters.language}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Languages</option>
                      {availableLanguages.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#046bba]"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={applyFilters}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#298bd6] border border-transparent rounded-md hover:bg-[#046bba] focus:outline-none focus:ring-2 focus:ring-[#046bba]"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Featured Countries Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Featured Countries</h2>
          {/* Active filters display */}
          <div className="flex flex-wrap items-center gap-2">
            {(filters.region || filters.language) && <span className="text-sm text-gray-500">Active filters:</span>}
            {filters.region && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Region: {filters.region}
                <button
                  onClick={() => setFilters({ ...filters, region: "" })}
                  className="ml-1 text-green-500 hover:text-green-700"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.language && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Language: {filters.language}
                <button
                  onClick={() => setFilters({ ...filters, language: "" })}
                  className="ml-1 text-purple-500 hover:text-purple-700"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#046bba]"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        {!loading && !error && countries.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No countries found matching your criteria.</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-[#046bba] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
        {!loading && !error && countries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {countries.map((country) => (
              <div
                key={country.name}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {/* Display the flag as an image */}
                      <img
                        src={country.flag || "/placeholder.svg?height=40&width=40"}
                        alt={`${country.name} flag`}
                        className="w-8 h-8 sm:w-10 sm:h-10 mr-3 rounded-md object-cover"
                      />
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{country.name}</h3>
                        <p className="text-sm sm:text-base text-gray-600">{country.capital}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(country.name)}
                      className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                      aria-label={favorites.includes(country.name) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorites.includes(country.name) ? (
                        <FavoriteIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                      ) : (
                        <FavoriteBorderIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                      )}
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <span>Region: {country.region}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <span>Population: {country.population?.toLocaleString() || "Unknown"}</span>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <Link
                      to={`/country/${country.name}`}
                      className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#298bd6] hover:bg-[#046bba] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Pagination Controls */}
        {!loading && !error && countries.length > 0 && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-[#298bd6] text-white rounded-l-md hover:bg-[#046bba] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 text-sm sm:text-base">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-[#298bd6] text-white rounded-r-md hover:bg-[#046bba] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;