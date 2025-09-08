import jwt from "jsonwebtoken";
import redisClient from "../redis.js";


// Middleware to authenticate JWT and check blacklist
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) return res.status(401).json({ error: "Token expired / logged out" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Role-based authorization
export const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden: insufficient permissions" });
  }
  next();
};

// Logout function
export const logout = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(400).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  // Get token expiration
  const decoded = jwt.decode(token);
  const exp = decoded?.exp;
  const ttl = exp ? exp - Math.floor(Date.now() / 1000) : 3600; // fallback 1 hour

  await redisClient.set(token, "blacklisted", { EX: ttl });

  res.json({ message: "Logged out successfully" });
};
