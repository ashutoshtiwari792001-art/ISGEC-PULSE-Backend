router.get("/create-admin", async (req, res) => {
  try {
    const email = "isgecpulse@outlook.com";
    const password = "Ashuwari_007";

    const doc = new GoogleSpreadsheet(process.env.GSHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.GSHEET_CLIENT_EMAIL,
      private_key: process.env.GSHEET_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const rows = await sheet.getRows();
    const exists = rows.find(r => r.Email === email);

    if (exists) {
      return res.json({ message: "Admin already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await sheet.addRow({
      Email: email,
      Name: "Admin User",
      Password: hashed,
      Verified: "TRUE",
      CreatedAt: new Date().toISOString()
    });

    res.json({ message: "Admin created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
