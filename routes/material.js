const express = require("express");
const router = express.Router();
const pool = require("../db");

const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);
router.get("/", async (req, res) => {
  const pool = req.app.locals.pool;

  try {
    const result = await pool.query("SELECT * FROM material");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan" });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM material");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST
router.post("/", async (req, res) => {
  const { modul_id, tipe, konten } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO material (modul_id, tipe, konten) VALUES ($1, $2, $3) RETURNING *",
      [modul_id, tipe, konten]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menambahkan material");
  }
});

// PUT
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { modul_id, tipe, konten } = req.body;
  try {
    const result = await pool.query(
      "UPDATE material SET modul_id = $1, tipe = $2, konten = $3 WHERE id = $4 RETURNING *",
      [modul_id, tipe, konten, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memperbarui material");
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM material WHERE id = $1", [id]);
    res.send("Material berhasil dihapus");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus material");
  }
});

module.exports = router;
