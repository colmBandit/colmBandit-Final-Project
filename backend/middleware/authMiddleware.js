const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization");

  console.log("Received Token:", token); // ✅ Log the token for debugging

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  // ✅ Extract token properly
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trim();
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;
