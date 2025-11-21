import express from "express";
import { register, login, verifyOtp } from "../services/authService.js";
import bcrypt from "bcryptjs";
import { GoogleSpreadsheet } from "google-spreadsheet";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// TEMPORARY ADMIN CREATION ROUTE — DELETE AFTER USE
router.get("/create-admin", async (req, res) => {
  try {
    const email = "isgecpulse@outlook.com";
    const password = "Ashuwari_007";

    const doc = new GoogleSpreadsheet(process.env.GSHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.GSHEET_CLIENT_EMAIL,
      private_key: process.env.GSHEET_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const rows = await sheet.getRows();
    const exists = rows.find(r => r.Email === email);

    if (exists) {
      return res.json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sheet.addRow({
      Email: email,
      Name: "Admin User",
      Password: hashedPassword,
      Verified: "TRUE",
      CreatedAt: new Date().toISOString()
    });

    res.json({ message: "Admin created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registration Route
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
