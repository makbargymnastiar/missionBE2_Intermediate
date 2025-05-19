const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
  const pool = req.app.locals.pool;
  const { nama, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (nama, email, password) VALUES ($1, $2, $3)",
      [nama, email, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed." });
  }
});

module.exports = router;
