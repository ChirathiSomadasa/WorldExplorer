const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const userRoute = require("./routes/user_route");
const countryRoute = require("./routes/country_route");

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://world-explorer-frontend.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Root endpoint (fixes 404 NOT_FOUND on backend root domain)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "WorldExplorer Backend API is running successfully",
    timestamp: new Date().toISOString(),
  });
});

// MongoDB Connection with timeout handling so serverless functions don't hang
if (process.env.MONGO_URL) {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "CountriesDB",
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err.message));
} else {
  console.warn("MONGO_URL not defined; running without active MongoDB connection");
}

// Routes
app.use("/api/user", userRoute);
app.use("/api/countries", countryRoute);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server only if NOT running in Vercel serverless environment
const PORT = process.env.PORT || 5002;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// For Vercel serverless function
module.exports = app;
