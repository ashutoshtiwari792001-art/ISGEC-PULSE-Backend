import express from "express";
import {
  getAllProjects,
  addProject,
  assignColorAndTarget,
  getProjectsByManager,
  getProjectsByLead
} from "../services/projectService.js";
import { authenticate } from "../services/middleware.js";

const router = express.Router();

// Get all projects (admin/lead)
router.get("/", authenticate, async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new project (lead)
router.post("/add", authenticate, async (req, res) => {
  try {
    const project = await addProject(req.body);
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Assign color and target (lead)
router.post("/assign", authenticate, async (req, res) => {
  try {
    const result = await assignColorAndTarget(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get projects for a specific Project Manager
router.get("/manager/:pmId", authenticate, async (req, res) => {
  try {
    const projects = await getProjectsByManager(req.params.pmId);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get projects for a specific Team Lead
router.get("/lead/:leadId", authenticate, async (req, res) => {
  try {
    const projects = await getProjectsByLead(req.params.leadId);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
