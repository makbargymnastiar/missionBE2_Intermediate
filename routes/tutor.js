const express = require("express");
const router = express.Router();
const pool = require("../db");

const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);
router.get("/", async (req, res) => {
  const pool = req.app.locals.pool;

  try {
    const result = await pool.query("SELECT * FROM tutor");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan" });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tutor");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST
router.post("/", async (req, res) => {
  const { nama, bio, keahlian } = req.body;
  console.log("body", req.body);
  try {
    const result = await pool.query(
      "INSERT INTO tutor (nama, bio, keahlian) VALUES ($1, $2, $3) RETURNING *",
      [nama, bio, keahlian]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menambahkan tutor");
  }
});

// PUT
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nama, bio, keahlian } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tutor SET nama = $1, bio = $2, keahlian = $3 WHERE id = $4 RETURNING *",
      [nama, bio, keahlian, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memperbarui tutor");
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tutor WHERE id = $1", [id]);
    res.send("Tutor berhasil dihapus");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus tutor");
  }
});

module.exports = router;
