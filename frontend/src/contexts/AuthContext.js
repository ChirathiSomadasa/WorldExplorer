import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status 
  const checkAuthStatus = () => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token); // Set true if token exists, false otherwise
  };

  // Run authentication check on provider load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};