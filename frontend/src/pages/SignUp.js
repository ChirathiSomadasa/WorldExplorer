import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios"; // Import axios for making HTTP requests
import SignUpImage from "../images/signup.jpg";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to the registration endpoint
      await axios.post("http://localhost:5002/api/user/register", formData);
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div
      className="relative bg-cover bg-center min-h-screen flex flex-col md:flex-row md:items-center"
      style={{ backgroundImage: `url(${SignUpImage})` }}
    >
      {/* Text on the background */}
      <div className="w-full md:w-1/2 p-6 md:p-10 text-[#046bba] z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Explore the World</h1>
        <p className="text-xl md:text-3xl max-w-xl leading-relaxed">
          Access to detailed information about countries, cultures, and travel destinations
        </p>
      </div>

      {/* Form container */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end px-4 pb-8 md:pr-16 md:pb-0">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md relative z-10">
          <h2 className="text-2xl font-medium mb-6 text-gray-800">Sign up now</h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-200 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-200 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <EmailIcon className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded focus:ring-2 focus:ring-gray-200 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 pr-10 border border-gray-300 rounded focus:ring-2 focus:ring-gray-200 focus:border-transparent outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? <VisibilityIcon className="h-5 w-5" /> : <VisibilityOffIcon className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use 4 or more characters with a mix of letters, numbers & symbols
              </p>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#046bba] hover:bg-[#035a9e] text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
              >
                Sign up
              </button>
            </div>

            {/* Login link */}
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#046bba] hover:underline">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-30 md:bg-opacity-0 z-0"></div>
    </div>
  );
}

export default SignUp;