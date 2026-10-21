import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import {
  LocationCity as LocationCityIcon,
  People as PeopleIcon,
  Public as PublicIcon,
  Language as LanguageIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
} from "@mui/icons-material"
import axios from "axios"
import "./country_animations.css"

function CountryDetails() {
  const { code } = useParams() // Get country code from the URL
  const [country, setCountry] = useState(null) // State for country data
  const [loading, setLoading] = useState(true) // State for loading
  const [error, setError] = useState("") // State for error

  // Refs for animated elements
  const headerRef = useRef(null)

  useEffect(() => {
    // Fetch country details from the backend
    const fetchCountryDetails = async () => {
      try {
        setLoading(true)
        setError("") // Reset error state
        const response = await axios.get(`https://world-explorer-backend.vercel.app/api/countries/alpha/${encodeURIComponent(code)}`)
        setCountry(response.data) // Set the fetched country data
        setLoading(false)
      } catch (err) {
        console.error("Error fetching country details:", err.message)
        setError("Failed to fetch country details. Please try again later.")
        setLoading(false)
      }
    }

    fetchCountryDetails()
  }, [code])

  useEffect(() => {
    // Set up intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-visible")
        }
      })
    }, observerOptions)

    const elementsToClean = []
    // Observe all elements with fade-in class
    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el)
      elementsToClean.push(el)
    })

    return () => {
      elementsToClean.forEach((el) => {
        if (el) observer.unobserve(el)
      })
    }
  }, [country])

  // Parallax effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollPosition = window.scrollY
        headerRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Format population with commas
  const formatPopulation = (population) => {
    return population?.toLocaleString() || "Unknown"
  }

  // Format languages as a comma-separated list
  const formatLanguages = (languages) => {
    if (!languages || languages.length === 0) return "Unknown"
    return Array.isArray(languages) ? languages.join(", ") : languages
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-b-4 border-[#298bd6] rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-4 text-lg">Loading country details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <Link to="/" className="mt-6 text-[#298bd6] hover:underline flex items-center">
          <ArrowBackIcon className="mr-1" /> Return to countries list
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header with flag */}
      <div
        ref={headerRef}
        className="relative h-[50vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${country.flag || "/placeholder.svg?height=800&width=1200"})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>

        <div className="absolute top-4 left-4 z-10">
          <Link
            to="/"
            className="flex items-center text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-full transition-all"
          >
            <ArrowBackIcon className="mr-1" /> Back
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="animate-fade-up">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2">{country.name}</h1>
              <p className="text-xl text-gray-200">{country.region}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Quick facts */}
          <section className="bg-white rounded-xl shadow-md overflow-hidden fade-in">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <InfoIcon className="mr-2 text-[#298bd6]" /> Quick Facts
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg transform transition-transform hover:scale-105">
                  <div className="flex items-center mb-2">
                    <LocationCityIcon className="h-6 w-6 text-[#298bd6]" />
                    <h3 className="ml-2 text-lg font-medium text-gray-900">Capital</h3>
                  </div>
                  <p className="text-gray-700">{country.capital || "Unknown"}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg transform transition-transform hover:scale-105">
                  <div className="flex items-center mb-2">
                    <PeopleIcon className="h-6 w-6 text-[#298bd6]" />
                    <h3 className="ml-2 text-lg font-medium text-gray-900">Population</h3>
                  </div>
                  <p className="text-gray-700">{formatPopulation(country.population)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg transform transition-transform hover:scale-105">
                  <div className="flex items-center mb-2">
                    <PublicIcon className="h-6 w-6 text-[#298bd6]" />
                    <h3 className="ml-2 text-lg font-medium text-gray-900">Region</h3>
                  </div>
                  <p className="text-gray-700">{country.region || "Unknown"}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg transform transition-transform hover:scale-105">
                  <div className="flex items-center mb-2">
                    <LanguageIcon className="h-6 w-6 text-[#298bd6]" />
                    <h3 className="ml-2 text-lg font-medium text-gray-900">Languages</h3>
                  </div>
                  <p className="text-gray-700">{formatLanguages(country.languages)}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Flag section */}
          <section
            className="bg-white rounded-xl shadow-md overflow-hidden fade-in"
            style={{ transitionDelay: "100ms" }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">National Flag</h2>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg shadow-md border border-gray-200">
                    <img
                      src={country.flag || "/placeholder.svg?height=600&width=900"}
                      alt={`Flag of ${country.name}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className="md:w-1/2">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">About the Flag</h3>
                  <p className="text-gray-600">
                    The flag of {country.name} represents the nation's history, values, and cultural heritage. Each
                    element and color has specific symbolism related to the country's identity and national pride.
                  </p>
                  <p className="text-gray-600 mt-4">
                    National flags are powerful symbols that often incorporate elements representing historical events,
                    cultural values, and geographical features significant to the country.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Culture and history */}
          <section
            className="bg-white rounded-xl shadow-md overflow-hidden fade-in"
            style={{ transitionDelay: "200ms" }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Culture & History</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">History</h3>
                  <p className="text-gray-600">
                    {country.name} has a rich and diverse history that spans many centuries. The country has been shaped
                    by various cultural influences, historical events, and political developments that have contributed
                    to its unique identity today.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Culture</h3>
                  <p className="text-gray-600">
                    The culture of {country.name} is characterized by its distinctive traditions, arts, music, cuisine,
                    and social customs. The country's cultural heritage reflects its historical experiences and the
                    diverse influences that have shaped its society.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Traditions</h4>
                    <p className="text-gray-600 text-sm">
                      Traditional customs and celebrations that have been passed down through generations.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Cuisine</h4>
                    <p className="text-gray-600 text-sm">
                      Distinctive food and culinary practices that reflect local ingredients and cultural influences.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Arts</h4>
                    <p className="text-gray-600 text-sm">
                      Visual arts, music, dance, and literature that express the country's cultural identity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Additional country information */}
          <section
            className="bg-white rounded-xl shadow-md overflow-hidden fade-in"
            style={{ transitionDelay: "300ms" }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Country Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Geography</h3>
                  <p className="text-gray-600 mb-4">
                    {country.name} is located in {country.region}. The country's geographical position has influenced
                    its climate, natural resources, and historical development.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Travel Highlights</h3>
                  <p className="text-gray-600 mb-4">
                    {country.name} offers visitors a variety of experiences, from exploring its vibrant cities to
                    discovering its natural landscapes and cultural heritage.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-1">Capital City - {country.capital}</h4>
                      <p className="text-gray-600 text-sm">
                        Explore the vibrant capital with its historical landmarks, museums, and cultural attractions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default CountryDetails
