import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import ExploreIcon from "@mui/icons-material/Explore";
import PublicIcon from "@mui/icons-material/Public";
import axios from "axios";
import SignUpImage from "../images/signup.jpg";

// Import SweetAlert functions
import {
  showSuccessAlert,
  showErrorAlert,
} from "../utils/Alert"; // Adjust path as needed

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { first_name, last_name, email, password } = formData;

    if (!first_name.trim()) {
      showErrorAlert("Missing Information", "Please enter your first name.");
      return false;
    }

    if (!last_name.trim()) {
      showErrorAlert("Missing Information", "Please enter your last name.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorAlert("Invalid Email", "Please enter a valid email address.");
      return false;
    }

    if (password.length < 4) {
      showErrorAlert(
        "Weak Password",
        "Password must be at least 4 characters long."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if validation fails

    try {
      const response = await axios.post(
        "https://world-explorer-backend.vercel.app/api/user/register",
        formData
      );

      // Show success alert and redirect to login
      showSuccessAlert("Registration Successful", "You can now log in.", () => {
        navigate("/login");
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong. Please try again.";

      // Check if it's a duplicate email error
      if (
        errorMessage.toLowerCase().includes("email") &&
        errorMessage.toLowerCase().includes("already")
      ) {
        showErrorAlert("Email Already in Use", "Please use another email.");
      } else {
        showErrorAlert("Registration Failed", errorMessage);
      }
    }
  };

  return (
    <div
      className="relative bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(161, 210, 255, 0.6), rgba(0, 165, 254, 0.8)), url(${SignUpImage})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>
      {/* Content container */}
      <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row items-center justify-between">
        {/* Left side - Branding */}
        <div className="w-full lg:w-1/2 text-white mb-10 lg:mb-0">
          <div className="flex items-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold">WorldExplorer</h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover the World's Wonders</h2>
          <p className="text-xl md:text-2xl max-w-xl leading-relaxed mb-8">
            Access detailed information about countries, cultures, and travel destinations all in one place.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center">
              <ExploreIcon className="text-white mr-2" />
              <span>190+ Countries</span>
            </div>
            <div className="flex items-center">
              <PublicIcon className="text-white mr-2" />
              <span>7 Continents</span>
            </div>
            <div className="flex items-center">
              <PersonIcon className="text-white mr-2" />
              <span>Thousands of Cultures</span>
            </div>
          </div>
        </div>
        {/* Right side - Transparent Form */}
        <div className="w-full lg:w-5/12">
          <div className="backdrop-blur-md bg-white bg-opacity-20 p-8 rounded-xl shadow-2xl border border-white border-opacity-20">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Create your account</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-white mb-1">
                    First name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-300">
                      <PersonIcon className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      id="firstName"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:bg-opacity-20 outline-none text-white placeholder-gray-300"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white mb-1">
                    Last name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-300">
                      <PersonIcon className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      id="lastName"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:bg-opacity-20 outline-none text-white placeholder-gray-300"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-300">
                    <EmailIcon className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:bg-opacity-20 outline-none text-white placeholder-gray-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-300">
                    <LockIcon className="h-5 w-5" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:bg-opacity-20 outline-none text-white placeholder-gray-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-300 hover:text-white"
                  >
                    {showPassword ? <VisibilityIcon className="h-5 w-5" /> : <VisibilityOffIcon className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  Use 4 or more characters with a mix of letters, numbers & symbols
                </p>
              </div>
              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-white text-[#046bba] hover:bg-[#034e87]  hover:text-white font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                >
                  Sign Up
                </button>
              </div>
              {/* Login link */}
              <div className="text-center text-sm text-white">
                Already have an account?{" "}
                <Link to="/login" className="text-white hover:text-[#034e87] font-medium">
                  Log in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;