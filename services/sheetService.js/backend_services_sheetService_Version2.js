import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

function getAuth() {
  return new google.auth.JWT(
    process.env.GSHEET_CLIENT_EMAIL,
    null,
    process.env.GSHEET_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
}

// Reads all rows from a named sheet
export async function getSheet(sheetName) {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GSHEET_ID,
    range: sheetName,
  });
  // First row is header, skip it if present
  return Array.isArray(res.data.values) ? res.data.values.slice(1) : [];
}

// Appends one or more rows to a sheet
export async function appendToSheet(sheetName, rows) {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GSHEET_ID,
    range: sheetName,
    valueInputOption: "USER_ENTERED",
    resource: { values: rows }
  });
}

// Updates a row in a sheet matching ID in the first column
export async function updateSheetRow(sheetName, id, updates) {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const rows = await getSheet(sheetName);

  // Fetch header to find columns:
  const hSheet = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GSHEET_ID,
    range: sheetName + "!A1:Z1"
  });
  const headers = hSheet.data.values && hSheet.data.values[0] || [];
  
  let rowIdx = rows.findIndex(r => r[0] === id);
  if (rowIdx === -1) throw new Error("Row not found");

  // Find original row in all rows (adding 2 because rows is after header)
  rowIdx += 2;

  // Map updates to columns
  Object.entries(updates).forEach(([key, value]) => {
    const col = headers.indexOf(key.charAt(0).toUpperCase() + key.slice(1));
    if (col !== -1) {
      // Post value to sheet
      sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GSHEET_ID,
        range: `${sheetName}!${String.fromCharCode(65 + col)}${rowIdx}`,
        valueInputOption: "USER_ENTERED",
        resource: { values: [[value]] }
      });
    }
  });

  return { status: "success" };
}