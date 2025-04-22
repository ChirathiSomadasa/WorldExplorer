const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Try to get the token from cookies
  let token = req.cookies.auth_token;

  // If no token in cookies, try to get it from the Authorization header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token is found, return an error
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = { verifyToken };