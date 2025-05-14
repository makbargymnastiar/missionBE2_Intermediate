const pool = require("./db");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Gagal konek ke database:", err);
  } else {
    console.log("Berhasil konek ke database:", res.rows);
  }
  pool.end();
});
