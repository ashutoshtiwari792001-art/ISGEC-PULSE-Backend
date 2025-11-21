import express from "express";
import {
  getDashboardStats,
  getRiskPredict,
  getProjectAnalytics
} from "../services/analyticsService.js";
import { authenticate } from "../services/middleware.js";

const router = express.Router();

// Quick analytics for the dashboard home
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ML/AI prediction/risk analytics
router.get("/risk", authenticate, async (req, res) => {
  try {
    const result = await getRiskPredict();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics for a single project
router.get("/project/:projectId", authenticate, async (req, res) => {
  try {
    const result = await getProjectAnalytics(req.params.projectId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
