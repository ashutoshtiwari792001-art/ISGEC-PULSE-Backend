import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpMail } from "./mailService.js";
import { v4 as uuidv4 } from "uuid";

// Simple in-memory storage for demo; replace with DB for production!
const users = [];
const otps = {};

export async function register({ email, name, password }) {
  const existing = users.find((u) => u.email === email);
  if (existing) throw new Error("User already exists");

  const hash = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  users.push({ id: uuidv4(), email, name, password: hash, verified: false });
  otps[email] = otp;

  await sendOtpMail(email, otp);

  return { message: "OTP sent to email. Please verify to complete registration." };
}

export async function verifyOtp({ email, otp }) {
  if (otps[email] !== otp) throw new Error("Invalid OTP");
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error("User not found");
  user.verified = true;
  delete otps[email];
  return { message: "Registration complete. You can now login!" };
}

export async function login({ email, password }) {
  const user = users.find((u) => u.email === email);
  if (!user || !user.verified) throw new Error("User not found or not verified");
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid password");
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}
