import { getSheet, appendToSheet, updateSheetRow } from "./sheetService.js";

// Google Sheet columns: [id, name, leadId, pmId, color, target, status, ...]
const SHEET_NAME = "Projects";

export async function getAllProjects() {
  const rows = await getSheet(SHEET_NAME);
  return rows.map(rowToProject);
}

export async function addProject({ name, leadId, pmId, status = "Active" }) {
  const color = ""; // to be assigned by lead
  const target = ""; // to be assigned by lead
  const id = `PRJ-${Date.now()}`;
  const row = [id, name, leadId, pmId, color, target, status];
  await appendToSheet(SHEET_NAME, [row]);
  return rowToProject(row);
}

export async function assignColorAndTarget({ id, color, target }) {
  // Updates color and target for a specific project
  return updateSheetRow(SHEET_NAME, id, { color, target });
}

export async function getProjectsByManager(pmId) {
  const rows = await getSheet(SHEET_NAME);
  return rows.filter((r) => r[3] === pmId).map(rowToProject);
}

export async function getProjectsByLead(leadId) {
  const rows = await getSheet(SHEET_NAME);
  return rows.filter((r) => r[2] === leadId).map(rowToProject);
}

function rowToProject(row) {
  return {
    id: row[0], name: row[1], leadId: row[2], pmId: row[3],
    color: row[4], target: row[5], status: row[6]
  };
}