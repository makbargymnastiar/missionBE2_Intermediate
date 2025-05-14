const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all payments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM payment");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST a new payment
router.post("/", async (req, res) => {
  const { orders_id, metode, jumlah } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO payment (orders_id, metode, jumlah) VALUES ($1, $2, $3) RETURNING *",
      [orders_id, metode, jumlah]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menambahkan payment");
  }
});

// PUT update payment
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { orders_id, metode, jumlah } = req.body;
  try {
    const result = await pool.query(
      "UPDATE payment SET orders_id = $1, metode = $2, jumlah = $3 WHERE id = $4 RETURNING *",
      [orders_id, metode, jumlah, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memperbarui payment");
  }
});

// DELETE payment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM payment WHERE id = $1", [id]);
    res.send("Payment berhasil dihapus");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus payment");
  }
});

module.exports = router;
