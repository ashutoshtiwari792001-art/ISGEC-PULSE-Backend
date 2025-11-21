import express from "express";
import { register, login, verifyOtp } from "../services/authService.js";

const router = express.Router();

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