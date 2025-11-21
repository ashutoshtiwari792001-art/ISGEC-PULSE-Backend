import express from "express";
import { addBilling, getBillingByProject, getBillingByManager } from "../services/billingService.js";
import { authenticate } from "../services/middleware.js";

const router = express.Router();

// Add a billing entry (PM)
router.post("/add", authenticate, async (req, res) => {
  try {
    const result = await addBilling(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get billing records for a project
router.get("/project/:projectId", authenticate, async (req, res) => {
  try {
    const records = await getBillingByProject(req.params.projectId);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all billing records for a PM
router.get("/manager/:pmId", authenticate, async (req, res) => {
  try {
    const records = await getBillingByManager(req.params.pmId);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
