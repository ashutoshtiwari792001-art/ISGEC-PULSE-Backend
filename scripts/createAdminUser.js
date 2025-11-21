import bcrypt from "bcryptjs";
import { GoogleSpreadsheet } from "google-spreadsheet";
import dotenv from "dotenv";

dotenv.config();

// Google Sheet Setup
const doc = new GoogleSpreadsheet(process.env.GSHEET_ID);

async function createAdminUser() {
  try {
    console.log("Starting admin user creation...");

    await doc.useServiceAccountAuth({
      client_email: process.env.GSHEET_CLIENT_EMAIL,
      private_key: process.env.GSHEET_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const email = "isgecpulse@outlook.com";
    const password = "Ashuwari_007";

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if user already exists
    const rows = await sheet.getRows();
    const exists = rows.find(r => r.Email === email);

    if (exists) {
      console.log("User already exists.");
      return;
    }

    // insert new row
    await sheet.addRow({
      Email: email,
      Name: "Admin User",
      Password: hashedPassword,
      Verified: "TRUE",
      CreatedAt: new Date().toISOString(),
    });

    console.log("Admin user created successfully!");
  } catch (err) {
    console.error("Error creating admin user:", err.message);
  }
}

createAdminUser();
