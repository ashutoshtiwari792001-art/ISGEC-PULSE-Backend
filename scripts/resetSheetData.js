import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

async function resetTab(tabName) {
  const auth = new google.auth.JWT(
    process.env.GSHEET_CLIENT_EMAIL,
    null,
    process.env.GSHEET_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  const sheets = google.sheets({ version: "v4", auth });
  // Keep only header row (row 1), clear all below it
  await sheets.spreadsheets.values.clear({
    spreadsheetId: process.env.GSHEET_ID,
    range: `${tabName}!A2:Z`
  });
  console.log(`Sheet ${tabName} reset (all data rows deleted).`);
}

// Usage: node backend/scripts/resetSheetData.js
(async () => {
  await resetTab("Projects");
  await resetTab("Billing");
  // Add any other tabs as needed...
  process.exit(0);
})();
