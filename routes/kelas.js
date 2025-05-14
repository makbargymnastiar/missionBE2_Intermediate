const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all kelas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM kelas");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching data: ", err);
    res.status(500).send("Server error");
  }
});

// POST a new kelas
router.post("/", async (req, res) => {
  const { nama, deskripsi, kategori_id, tutor_id } = req.body;

  // Debug log to check the incoming request body
  console.log("Request Body: ", req.body);

  try {
    // Validasi apakah kategori_id ada di tabel category_class
    const categoryCheck = await pool.query(
      "SELECT * FROM category_class WHERE id = $1",
      [kategori_id]
    );
    if (categoryCheck.rowCount === 0) {
      return res
        .status(400)
        .send("Invalid kategori_id: Kategori tidak ditemukan");
    }

    // Validasi apakah tutor_id ada di tabel tutor
    const tutorCheck = await pool.query("SELECT * FROM tutor WHERE id = $1", [
      tutor_id,
    ]);
    if (tutorCheck.rowCount === 0) {
      return res.status(400).send("Invalid tutor_id: Tutor tidak ditemukan");
    }

    // Jika validasi berhasil, masukkan data ke tabel kelas
    const result = await pool.query(
      "INSERT INTO kelas (nama, deskripsi, kategori_id, tutor_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [nama, deskripsi, kategori_id, tutor_id]
    );

    // Menyampaikan hasil yang baru dimasukkan
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).send("Gagal menambahkan kelas");
  }
});

// PUT update kelas
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi, kategori_id, tutor_id } = req.body;

  try {
    // Validasi apakah kategori_id ada di tabel category_class
    const categoryCheck = await pool.query(
      "SELECT * FROM category_class WHERE id = $1",
      [kategori_id]
    );
    if (categoryCheck.rowCount === 0) {
      return res
        .status(400)
        .send("Invalid kategori_id: Kategori tidak ditemukan");
    }

    // Validasi apakah tutor_id ada di tabel tutor
    const tutorCheck = await pool.query("SELECT * FROM tutor WHERE id = $1", [
      tutor_id,
    ]);
    if (tutorCheck.rowCount === 0) {
      return res.status(400).send("Invalid tutor_id: Tutor tidak ditemukan");
    }

    // Update kelas
    const result = await pool.query(
      "UPDATE kelas SET nama = $1, deskripsi = $2, kategori_id = $3, tutor_id = $4 WHERE id = $5 RETURNING *",
      [nama, deskripsi, kategori_id, tutor_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Kelas tidak ditemukan");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating data: ", err);
    res.status(500).send("Gagal memperbarui kelas");
  }
});

// DELETE kelas
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM kelas WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send("Kelas tidak ditemukan");
    }
    res.send("Kelas berhasil dihapus");
  } catch (err) {
    console.error("Error deleting data: ", err);
    res.status(500).send("Gagal menghapus kelas");
  }
});

module.exports = router;
