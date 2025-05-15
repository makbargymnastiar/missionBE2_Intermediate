const express = require("express");
const router = express.Router();
const pool = require("../db");

//GET
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM category_class");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//POST
router.post("/", async (req, res) => {
  const { nama, deskripsi } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO category_class (nama, deskripsi) VALUES ($1, $2) RETURNING *",
      [nama, deskripsi]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menambahkan kategori");
  }
});

//PUT
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi } = req.body;
  try {
    const result = await pool.query(
      "UPDATE category_class SET nama = $1, deskripsi = $2 WHERE id = $3 RETURNING *",
      [nama, deskripsi, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memperbarui kategori");
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM category_class WHERE id = $1", [id]);
    res.send("Kategori berhasil dihapus");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus kategori");
  }
});

module.exports = router;
