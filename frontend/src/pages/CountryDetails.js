import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowBack as ArrowBackIcon,
  LocationCity as LocationCityIcon,
  People as PeopleIcon,
  Public as PublicIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import axios from "axios";

function CountryDetails() {
  const { code } = useParams(); // Get country code from the URL
  const [country, setCountry] = useState(null); // State for country data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(""); // State for error

  useEffect(() => {
    // Fetch country details from the backend
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        setError(""); // Reset error state
        const response = await axios.get(`http://localhost:5002/api/countries/alpha/${encodeURIComponent(code)}`);
        setCountry(response.data); // Set the fetched country data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching country details:", err.message);
        setError("Failed to fetch country details. Please try again later.");
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [code]);

  // Format population with commas
  const formatPopulation = (population) => {
    return population?.toLocaleString() || "Unknown";
  };

  // Format languages as a comma-separated list
  const formatLanguages = (languages) => {
    if (!languages || languages.length === 0) return "Unknown";
    return languages;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading country details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 mb-8 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <ArrowBackIcon className="h-5 w-5 mr-2" />
          Back to Countries
        </Link>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Country flag banner */}
          <div className="relative h-64 sm:h-80 bg-gray-200">
            <img
              src={country.flag || "/placeholder.svg"}
              alt={`Flag of ${country.name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{country.name}</h1>
            </div>
          </div>

          {/* Country details */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Country Information</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <LocationCityIcon className="h-6 w-6 text-[#298bd6]" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Capital</h3>
                      <p className="mt-1 text-gray-600">{country.capital}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <PeopleIcon className="h-6 w-6 text-[#298bd6]" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Population</h3>
                      <p className="mt-1 text-gray-600">{formatPopulation(country.population)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <PublicIcon className="h-6 w-6 text-[#298bd6]" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Region</h3>
                      <p className="mt-1 text-gray-600">{country.region}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <LanguageIcon className="h-6 w-6 text-[#298bd6]" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Languages</h3>
                      <p className="mt-1 text-gray-600">{formatLanguages(country.languages)}</p>
                    </div>
                  </div>
                </div>
              </div>             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryDetails;