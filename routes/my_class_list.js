const express = require("express");
const router = express.Router();
const pool = require("../db");

const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);
router.get("/", async (req, res) => {
  const pool = req.app.locals.pool;

  try {
    const result = await pool.query("SELECT * FROM my_class_list");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan" });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM my_class_list");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST
router.post("/", async (req, res) => {
  const { users_id, kelas_id, progress } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO my_class_list (users_id, kelas_id, progress) VALUES ($1, $2, $3) RETURNING *",
      [users_id, kelas_id, progress]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menambahkan my class");
  }
});

// PUT
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { users_id, kelas_id, progress } = req.body;
  try {
    const result = await pool.query(
      "UPDATE my_class_list SET users_id = $1, kelas_id = $2, progress = $3 WHERE id = $4 RETURNING *",
      [users_id, kelas_id, progress, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memperbarui data");
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM my_class_list WHERE id = $1", [id]);
    res.send("Data berhasil dihapus");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus data");
  }
});

module.exports = router;
