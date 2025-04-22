import { Link } from "react-router-dom"

// Import icons (assuming you're using Material UI icons)
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import InstagramIcon from "@mui/icons-material/Instagram"
import YouTubeIcon from "@mui/icons-material/YouTube"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import PublicIcon from "@mui/icons-material/Public"
import SendIcon from "@mui/icons-material/Send"

function Footer() {
  // Get current year for copyright
  const currentYear = new Date().getFullYear()

  // Regions for country categories
  const regions = [
    { name: "Africa", path: "/regions/africa" },
    { name: "Americas", path: "/regions/americas" },
    { name: "Asia", path: "/regions/asia" },
    { name: "Europe", path: "/regions/europe" },
    { name: "Oceania", path: "/regions/oceania" },
  ]

  // Quick links
  const quickLinks = [
    { name: "Popular Countries", path: "/popular" },
    { name: "Travel Guides", path: "/guides" },
    { name: "Country Comparison", path: "/compare" },
    { name: "Currency Converter", path: "/currency" },
    { name: "Language Translator", path: "/translate" },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-6 pt-10 pb-6">
        <div className="flex flex-wrap">
          {/* Brand and description */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <PublicIcon className="text-[#046bba] mr-2 text-2xl" />
              <span className="text-xl font-bold">WorldExplorer</span>
            </div>
            <p className="text-gray-400 mb-4">
              Discover detailed information about countries, cultures, and travel destinations around the world.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FacebookIcon />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <TwitterIcon />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <InstagramIcon />
              </a>
              <a href="https://youtube.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <YouTubeIcon />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <LinkedInIcon />
              </a>
            </div>
          </div>

          {/* Regions */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Regions</h3>
            <ul className="space-y-2">
              {regions.map((region) => (
                <li key={region.name}>
                  <Link to={region.path} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {region.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for travel tips and country updates.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 text-gray-200 px-4 py-2 rounded-l outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button className="bg-[#046bba] hover:bg-blue-600 px-4 py-2 rounded-r transition-colors">
                <SendIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">© {currentYear} WorldExplorer. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link to="/about" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
