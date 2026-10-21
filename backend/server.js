const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const userRoute = require("./routes/user_route");
const countryRoute = require("./routes/country_route");

dotenv.config();

// Disable Mongoose command buffering so operations fail fast with clear errors instead of 10s timeouts
mongoose.set("bufferCommands", false);

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

// Database connection helper for serverless environment
let cachedDbPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL environment variable is not defined");
  }

  if (!cachedDbPromise) {
    cachedDbPromise = mongoose.connect(process.env.MONGO_URL, {
      dbName: "CountriesDB",
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    await cachedDbPromise;
  } catch (err) {
    cachedDbPromise = null;
    throw err;
  }
};

// Database connection middleware for user authentication and favorites routes
app.use(
  "/api/user",
  async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (err) {
      console.error("Database connection error:", err.message);
      return res.status(503).json({
        error:
          "Database unavailable. Please ensure your MongoDB Atlas cluster is active (not paused) and MONGO_URL in Vercel environment variables is correct.",
        details: err.message,
      });
    }
  },
  userRoute
);

// Country routes (served directly from bundled dataset without database dependency)
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
