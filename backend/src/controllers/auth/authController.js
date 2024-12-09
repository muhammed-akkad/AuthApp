import { User } from "../../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config/config.js";

/**
 * and endpoint to register a new user
 * @param {object} req - Express request, expects `username` and `password` in `req.body`
 * @param {object} res - Express response
 * @returns {Promise<void>}  JSON response with the user data or an error message.
 */
export async function register(req, res) {
  const { username, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({ username, password: hashedPassword });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
}

/**
 * Login for users
 * @param {object} req - Express request, containing `username` and `password` in `req.body`
 * @param {object} res - Express response
 * @returns {Promise<void>}  JSON response with the user data or an error message.
 */
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
}

/**
 * Retrieves the profile of the currently authenticated user.
 * @param {object} req - Express request object, with `req.user.id` defined
 * @param {object} res - Express response
 * @returns {Promise<void>}  JSON response with the user data or an error message.
 */
export async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: "Server error during profile retrieval" });
  }
}
