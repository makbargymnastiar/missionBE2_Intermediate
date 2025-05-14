const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all pretests
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pretest");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST a new pretest
router.post("/", async (req, res) => {
  const { kelas_id, soal, jawaban_benar } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO pretest (kelas_id, soal, jawaban_benar) VALUES ($1, $2, $3) RETURNING *",
      [kelas_id, soal, jawaban_benar]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menambahkan pretest");
  }
});

// PUT update pretest
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { kelas_id, soal, jawaban_benar } = req.body;
  try {
    const result = await pool.query(
      "UPDATE pretest SET kelas_id = $1, soal = $2, jawaban_benar = $3 WHERE id = $4 RETURNING *",
      [kelas_id, soal, jawaban_benar, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memperbarui pretest");
  }
});

// DELETE pretest
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM pretest WHERE id = $1", [id]);
    res.send("Pretest berhasil dihapus");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus pretest");
  }
});

module.exports = router;
