import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config.js";

/**
 *
 * @param {Object} req  - Express request
 * @param {Object} res  - Express response
 * @param {Object} next - Express next function
 * @returns {void} - Calls the next function or returns an error response
 */
export default function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}
