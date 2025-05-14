const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all orders
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST a new orders
router.post("/", async (req, res) => {
  const { users_id, kelas_id, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO orders (users_id, kelas_id, status) VALUES ($1, $2, $3) RETURNING *",
      [users_id, kelas_id, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menambahkan orders");
  }
});

// PUT update orders
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { users_id, kelas_id, status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE orders SET users_id = $1, kelas_id = $2, status = $3 WHERE id = $4 RETURNING *",
      [users_id, kelas_id, status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memperbarui orders");
  }
});

// DELETE orders
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM orders WHERE id = $1", [id]);
    res.send("orders berhasil dihapus");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus orders");
  }
});

module.exports = router;
