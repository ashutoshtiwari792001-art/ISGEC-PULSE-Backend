import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpMail } from "./mailService.js";
import { v4 as uuidv4 } from "uuid";

// In-memory users DB (demo)
const users = [];
const otps = {};

// 🔐 Admin login fallback using environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "isgecpulse@outlook.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Ashuwari_007";

/* ---------------------------------------------------------
   REGISTER USER → Send OTP
--------------------------------------------------------- */
export async function register({ email, name, password }) {
  const existing = users.find((u) => u.email === email);
  if (existing) throw new Error("User already exists");

  const hash = await bcrypt.hash(password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = otp;

  users.push({
    id: uuidv4(),
    email,
    name,
    password: hash,
    verified: false,
  });

  await sendOtpMail(email, otp);

  return { message: "OTP sent to email. Please verify to complete registration." };
}

/* ---------------------------------------------------------
   VERIFY OTP
--------------------------------------------------------- */
export async function verifyOtp({ email, otp }) {
  if (otps[email] !== otp) throw new Error("Invalid OTP");

  const user = users.find((u) => u.email === email);
  if (!user) throw new Error("User not found");

  user.verified = true;
  delete otps[email];

  return { message: "Registration complete. You can now login!" };
}

/* ---------------------------------------------------------
   LOGIN USER (Normal + Admin Fallback)
--------------------------------------------------------- */
export async function login({ email, password }) {
  // 1️⃣ Normal user from in-memory store
  const user = users.find((u) => u.email === email);

  if (user && user.verified) {
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid password");

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }

  // 2️⃣ Admin fallback (no DB, no OTP)
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email: ADMIN_EMAIL, name: "Admin User", role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: { email: ADMIN_EMAIL, name: "Admin User", role: "admin" },
    };
  }

  // 3️⃣ Neither admin nor user found
  throw new Error("User not found or not verified");
}
