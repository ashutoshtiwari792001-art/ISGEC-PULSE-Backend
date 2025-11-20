import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import billingRoutes from "./routes/billing.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "*",
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("ISGEC PULSE API running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ISGEC PULSE backend running on port ${PORT}`);
});