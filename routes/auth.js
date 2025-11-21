import express from "express";
import { register, login, verifyOtp } from "../services/authService.js";
import User from "../helpers/userModel.js";  // <-- IMPORTANT: user model import

const router = express.Router();

// TEMPORARY: Create Admin User (DELETE AFTER USE)
router.get("/create-admin", async (req, res) => {
  try {
    const adminEmail = "isgecpulse@outlook.com";

    // check already exists?
    const exists = await User.findOne({ email: adminEmail });
    if (exists) {
      return res.json({ message: "Admin already exists" });
    }

    const admin = new User({
      name: "Admin",
      email: adminEmail,
      password: "Ashuwari_007",
      isVerified: true,
      role: "admin",
    });

    await admin.save();

    res.json({ message: "Admin user created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registration Route - triggers OTP to email
router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const response = await register({ email, name, password });
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// OTP Verification Route
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const response = await verifyOtp({ email, otp });
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await login({ email, password });
    res.json(response);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

export default router;

