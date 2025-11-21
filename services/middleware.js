import jwt from "jsonwebtoken";

// Auth middleware for JWT token-based API protection
export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Auth token missing" });
  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid auth header" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
