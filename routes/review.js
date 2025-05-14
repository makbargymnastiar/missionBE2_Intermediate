const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM review");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST a new review
router.post("/", async (req, res) => {
  const { users_id, kelas_id, rating, komentar } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO review (users_id, kelas_id, rating, komentar) VALUES ($1, $2, $3, $4) RETURNING *",
      [users_id, kelas_id, rating, komentar]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menambahkan review");
  }
});

// PUT update review
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { users_id, kelas_id, rating, komentar } = req.body;
  try {
    const result = await pool.query(
      "UPDATE review SET users_id = $1, kelas_id = $2, rating = $3, komentar = $4 WHERE id = $5 RETURNING *",
      [users_id, kelas_id, rating, komentar, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memperbarui review");
  }
});

// DELETE review
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM review WHERE id = $1", [id]);
    res.send("Review berhasil dihapus");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus review");
  }
});

module.exports = router;
