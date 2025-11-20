import { getSheet, appendToSheet } from "./sheetService.js";

// Billing Sheet: [recordId, projectId, pmId, amount, month, note, createdAt]
const SHEET_NAME = "Billing";

export async function addBilling({ projectId, pmId, amount, month, note }) {
  const recordId = `BILL-${Date.now()}`;
  const createdAt = new Date().toISOString();
  const row = [recordId, projectId, pmId, amount, month, note, createdAt];
  await appendToSheet(SHEET_NAME, [row]);
  return { status: "success", recordId };
}

export async function getBillingByProject(projectId) {
  const rows = await getSheet(SHEET_NAME);
  return rows.filter(r => r[1] === projectId)
    .map(rowToBilling);
}

export async function getBillingByManager(pmId) {
  const rows = await getSheet(SHEET_NAME);
  return rows.filter(r => r[2] === pmId).map(rowToBilling);
}

function rowToBilling(row) {
  return {
    recordId: row[0], projectId: row[1], pmId: row[2],
    amount: row[3], month: row[4], note: row[5], createdAt: row[6]
  };
}