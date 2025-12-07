const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// CONNECT TO SQLITE DATABASE FILE
const dbPath = path.join(__dirname, "talentmate.db");
const db = new sqlite3.Database(dbPath);

// CREATE TABLE IF NOT EXISTS
db.run(
  `CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    skills TEXT,
    matchScore INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
);

// API: SAVE CANDIDATE
app.post("/api/candidates", (req, res) => {
  const { name, skills, matchScore } = req.body;

  const sql =
    "INSERT INTO candidates (name, skills, matchScore) VALUES (?, ?, ?)";
  const params = [
    name || "Unnamed",
    JSON.stringify(skills || []),
    matchScore || 0,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("DB insert error:", err);
      return res.status(500).json({ error: "DB insert failed" });
    }

    res.json({ id: this.lastID, message: "Candidate saved" });
  });
});

// API: GET CANDIDATES LIST
app.get("/api/candidates", (req, res) => {
  db.all("SELECT * FROM candidates ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      console.error("DB read error:", err);
      return res.status(500).json({ error: "DB read failed" });
    }
    res.json(rows);
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});