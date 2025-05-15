const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM modul_class");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST
router.post("/", async (req, res) => {
  const { kelas_id, judul, deskripsi } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO modul_class (kelas_id, judul, deskripsi) VALUES ($1, $2, $3) RETURNING *",
      [kelas_id, judul, deskripsi]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menambahkan modul");
  }
});

// PUT
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { kelas_id, judul, deskripsi } = req.body;
  try {
    const result = await pool.query(
      "UPDATE modul_class SET kelas_id = $1, judul = $2, deskripsi = $3 WHERE id = $4 RETURNING *",
      [kelas_id, judul, deskripsi, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memperbarui modul");
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM modul_class WHERE id = $1", [id]);
    res.send("Modul berhasil dihapus");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus modul");
  }
});

module.exports = router;
