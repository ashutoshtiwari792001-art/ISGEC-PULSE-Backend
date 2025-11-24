import express from "express";
import bcrypt from "bcryptjs";
import axios from "axios";
import dotenv from "dotenv";
import { register, login, verifyOtp } from "../services/authService.js";

dotenv.config();

const router = express.Router();

/* ---------------------------------------------------------
   🌟 CREATE ADMIN USING GOOGLE SHEETS REST API (NO PACKAGES)
--------------------------------------------------------- */
router.get("/create-admin-now", async (req, res) => {
  try {
    const email = "isgecpulse@outlook.com";
    const password = "Ashuwari_007";

    const SHEET_ID = process.env.GSHEET_ID;
    const API_KEY = process.env.GSHEET_API_KEY;

    // 1) READ rows
    const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;
    const readRes = await axios.get(readUrl);
    const rows = readRes.data.values || [];

    const headers = rows[0];
    const emailIndex = headers.indexOf("Email");

    const exists = rows.find(r => r[emailIndex] === email);

    if (exists) {
      return res.json({ message: "Admin already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 2) APPEND admin row
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1:append?valueInputOption=RAW&key=${API_KEY}`;

    const newRow = [
      email,
      "Admin User",
      hashed,
      "TRUE",
      "",
      "",
      new Date().toISOString()
    ];

    await axios.post(appendUrl, {
      range: "Sheet1",
      majorDimension: "ROWS",
      values: [newRow]
    });

    res.json({ message: "Admin created successfully!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------------------------------------
   REGISTER
--------------------------------------------------------- */
router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const response = await register({ email, name, password });
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ---------------------------------------------------------
   VERIFY OTP
--------------------------------------------------------- */
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const response = await verifyOtp({ email, otp });
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ---------------------------------------------------------
   LOGIN
--------------------------------------------------------- */
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
