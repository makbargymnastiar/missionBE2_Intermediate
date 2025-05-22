const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);
router.get("/", async (req, res) => {
  const pool = req.app.locals.pool;

  try {
    const result = await pool.query("SELECT * FROM users ");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan" });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Detail error:", err);
    res.status(500).send("Error saat ambil data");
  }
});

// GET
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Detail error:", err);
    res.status(500).send("Error ambil data by ID");
  }
});

// POST
router.post("/", async (req, res) => {
  const { nama, email, password } = req.body;
  console.log(">> req.body:", JSON.stringify(req.body));
  try {
    const result = await pool.query(
      "INSERT INTO users (nama, email, password) VALUES ($1, $2, $3) RETURNING *",
      [nama, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Detail error:", err);
    res.status(500).send("Gagal tambah users");
  }
});

// PUT
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nama, email, password } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET nama = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [nama, email, password, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Detail error:", err);
    res.status(500).send("Gagal update users");
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.send("users berhasil dihapus");
  } catch (err) {
    console.error("Detail error:", err);
    res.status(500).send("Gagal hapus users");
  }
});

module.exports = router;
