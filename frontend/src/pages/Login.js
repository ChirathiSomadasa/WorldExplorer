import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext); // Use AuthContext to update global authentication state
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner
    setError(""); // Clear any previous error messages

    try {
      // Send login request to the backend
      const response = await axios.post("http://localhost:5002/api/user/login", formData, {
        withCredentials: true, // Required for handling cookies
      });

      // Extract the token from the response
      const { token } = response.data;

      // Save the token in local storage
      localStorage.setItem("auth_token", token);

      // Update global authentication state
      setIsAuthenticated(true);

      // Redirect to the home page or dashboard after successful login
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#e4f3ff] px-4 py-8">
      {/* Welcome message */}
      <div className="text-center mb-6 max-w-md">
        <h1 className="text-[#046bba] text-4xl font-semibold mb-2">Welcome Back!</h1>
        <p className="text-gray-600 text-lg">Please enter your details to access your account</p>
      </div>

      {/* Login card */}
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
        </div>

        <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Email/Phone field */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-medium" htmlFor="email">
              Email or phone number
            </label>
            <input
              className="p-3 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#046bba]/20 focus:border-[#046bba]"
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email or phone"
              required
            />
          </div>

          {/* Password field */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="p-3 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#046bba]/20 focus:border-[#046bba]"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className={`bg-[#046bba] hover:bg-[#044578] text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 mt-2 flex items-center justify-center ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Sign up prompt */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#046bba] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;