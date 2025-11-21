import express from "express";
import bcrypt from "bcryptjs";
import { GoogleSpreadsheet } from "google-spreadsheet";
import dotenv from "dotenv";

import { register, login, verifyOtp } from "../services/authService.js";

dotenv.config();
const router = express.Router();

/* ---------------------------------------------------------
   🚨 TEMPORARY: CREATE ADMIN USER
   RUN ONCE → Then DELETE THIS ROUTE
--------------------------------------------------------- */
router.get("/create-admin", async (req, res) => {
  try {
    const email = "isgecpulse@outlook.com";
    const password = "Ashuwari_007";

    // Connect Google Sheet
    const doc = new GoogleSpreadsheet(process.env.GSHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.GSHEET_CLIENT_EMAIL,
      private_key: process.env.GSHEET_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // Check if admin exists
    const rows = await sheet.getRows();
    const exists = rows.find(r => r.Email === email);

    if (exists) {
      return res.json({ message: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin row
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

/* ---------------------------------------------------------
   REGISTER USER  → Sends OTP
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
   LOGIN USER
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
