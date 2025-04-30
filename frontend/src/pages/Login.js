import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import LoginImage from "../images/login.jpg";

// Import SweetAlert functions
import {
  showSuccessAlert,
  showErrorAlert,
} from "../utils/Alert"; // Adjust path if needed

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://world-explorer-seven.vercel.app/api/user/login",
        formData,
        {
          withCredentials: true,
        }
      );

      const { token } = response.data;

      localStorage.setItem("auth_token", token);
      setIsAuthenticated(true);

      // Show success alert and redirect
      showSuccessAlert("Login Successful", "Welcome back to WorldExplorer!", () => {
        navigate("/");
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Login failed. Please try again.";

      showErrorAlert("Login Failed", errorMessage);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${LoginImage})`,
        }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      {/* Blue overlay */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `linear-gradient(135deg, rgba(4, 107, 186, 0.4), rgba(4, 107, 186, 0.7))`,
        }}
      ></div>

      {/* Content container */}
      <div className="container mx-auto px-4 relative z-30">
        <div className="flex flex-col items-center justify-center">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-3">
              <PublicIcon className="text-4xl text-white mr-2" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">WorldExplorer</h1>
            </div>
            <p className="text-lg text-gray-200 max-w-md">
              Your gateway to discovering the world's most fascinating destinations
            </p>
          </div>

          {/* Transparent login form */}
          <div className="w-full max-w-md backdrop-blur-md bg-white bg-opacity-20 p-8 rounded-xl shadow-2xl border border-white border-opacity-20">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Welcome Back</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email/Phone field */}
              <div className="space-y-2">
                <label className="text-white font-medium text-sm" htmlFor="email">
                  Email or phone number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-300">
                    <EmailIcon className="h-5 w-5" />
                  </span>
                  <input
                    className="w-full p-3 pl-10 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg focus:ring-2 focus:ring-[#046bba] focus:bg-opacity-20 outline-none text-white placeholder-gray-300"
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email or phone"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-white font-medium text-sm" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-300">
                    <LockIcon className="h-5 w-5" />
                  </span>
                  <input
                    className="w-full p-3 pl-10 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg focus:ring-2 focus:ring-[#046bba] focus:bg-opacity-20 outline-none text-white placeholder-gray-300"
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
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-300 hover:text-white"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon className="h-5 w-5" />
                    ) : (
                      <VisibilityIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full bg-white text-[#046bba] hover:bg-[#034e87] hover:text-white font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              >
                <div className="flex items-center">
                  <span>Login</span>
                </div>
              </button>
            </form>

            {/* Sign up prompt */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white">
                Don't have an account?{" "}
                <Link to="/register" className="text-white hover:text-gray-200 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;