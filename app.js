const express = require("express");
const verifyToken = require("./middleware/verifyToken");
const { Pool } = require("pg");
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Konfigurasi koneksi ke database PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "missionBE2_Intermediate",
  password: "makbargymnastiar",
  port: 5432,
});

app.locals.pool = pool;

// ROUTES
app.use("/api/users", require("./routes/users"));
app.use("/api/tutor", require("./routes/tutor"));
app.use("/api/category_class", require("./routes/category_class"));
app.use("/api/kelas", require("./routes/kelas"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/my_class_list", require("./routes/my_class_list"));
app.use("/api/review", require("./routes/review"));
app.use("/api/pretest", require("./routes/pretest"));
app.use("/api/material", require("./routes/material"));
app.use("/api/modul_class", require("./routes/modul_class"));

// auth
app.use("/api/auth/register", require("./routes/auth/authRegister"));
app.use("/api/auth/login", require("./routes/auth/authLogin"));

// Route tes koneksi
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

app.get("/api/cek-token", verifyToken, (req, res) => {
  res.json({ message: "Token valid", users: req.users });
});
