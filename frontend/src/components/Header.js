import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PublicIcon from "@mui/icons-material/Public";
import { AuthContext } from "../contexts/AuthContext"; 

function Header() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post("https://world-explorer-seven.vercel.app/api/user/logout", {}, { withCredentials: true });
      localStorage.removeItem("auth_token"); // Remove the token from localStorage
      setIsAuthenticated(false); // Update global authentication status
      navigate("/login"); // Redirect to the login page
    } catch (err) {
      console.error("Error logging out:", err.message);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white shadow">
        <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl md:px-6 lg:px-8">
          {/* Left side - Logo and name */}
          <div className="flex items-center gap-2">
            <PublicIcon className="text-[#046bba] mr-2 text-2xl" />
            <Link to="/" className="flex items-center gap-2">
              <div className="text-lg font-semibold text-[#046bba]">WorldExplorer</div>
            </Link>
          </div>

          {/* Right side - Auth buttons */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              // Show Sign Out button if the user is authenticated
              <button
                onClick={handleLogout}
                className="px-4 py-2 font-medium rounded-md transition-colors hover:bg-gray-100"
              >
                Sign Out
              </button>
            ) : (
              // Show Sign Up and Login buttons if the user is not authenticated
              <>
                <Link to="/register">
                  <button className="px-4 py-2 font-medium text-white rounded-md bg-[#046bba] transition-colors hover:bg-[#034e87]">
                    Sign Up
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-[22px] py-2 font-medium rounded-md transition-colors bg-gray-100 hover:bg-gray-200">
                    Login
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;