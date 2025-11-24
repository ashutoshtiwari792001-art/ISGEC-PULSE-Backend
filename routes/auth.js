import express from "express";
import bcrypt from "bcryptjs";
import { GoogleSpreadsheet } from "google-spreadsheet";
import dotenv from "dotenv";
import { register, login, verifyOtp } from "../services/authService.js";

dotenv.config();

const router = express.Router();

/* ---------------------------------------------------------
   🌟 TEMPORARY ADMIN CREATION ROUTE — run once then delete
--------------------------------------------------------- */
router.get("/create-admin-now", async (req, res) => {
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
    const exists = rows.find((r) => r.Email === email);

    if (exists) {
      return res.json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sheet.addRow({
      Email: email,
      Name: "Admin User",
      Password: hashedPassword,
      Verified: "TRUE",
      OTP: "",
      OTPExpire: "",
      CreatedAt: new Date().toISOString(),
    });

    res.json({ message: "Admin created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------------------------------------
   REGISTER USER → Send OTP
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
