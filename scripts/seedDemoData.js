import { appendToSheet } from "../services/sheetService.js";

// Demo projects (add rows for "Projects" sheet)
const demoProjects = [
  ["PRJ-001", "Compressor Block Upgrade", "lead001", "pm001", "red", "1000000", "Active"],
  ["PRJ-002", "Heat Exchanger Revamp", "lead002", "pm002", "green", "450000", "Overdue"]
];

// Demo billing
const demoBilling = [
  ["BILL-001", "PRJ-001", "pm001", 300000, "2025-10", "Q1 payment", "2025-10-05T09:32:00Z"],
  ["BILL-002", "PRJ-001", "pm001", 280000, "2025-11", "Q2 payment", "2025-11-07T09:36:00Z"],
  ["BILL-003", "PRJ-002", "pm002", 150000, "2025-10", "Startup", "2025-10-10T09:50:00Z"]
];

async function seedProjects() {
  await appendToSheet("Projects", demoProjects);
  console.log("Demo projects seeded.");
}

async function seedBilling() {
  await appendToSheet("Billing", demoBilling);
  console.log("Demo billing seeded.");
}

(async () => {
  await seedProjects();
  await seedBilling();
  process.exit(0);
})();
