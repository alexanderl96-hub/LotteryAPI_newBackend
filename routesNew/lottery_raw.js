const express = require("express");
const router = express.Router();
const db = require("../db"); // this is your pg-promise db
const storedData = require("../ServiceUpdate/dataJsonAPiRequest");

// GET all remaindata entries
router.get("/", async (req, res) => {
  try {
    await storedData();
    const result = await db.any("SELECT * FROM remaindata ORDER BY id DESC");
    res.json({ status: 200, data_lottery_raw: result });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
});

// GET remaindata entry by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const draw = await db.oneOrNone(`SELECT * FROM remaindata WHERE id = $1`, [
      id,
    ]);

    if (!draw)
      return res.status(404).json({ status: 404, message: "Draw not found" });

    res.json({ status: 200, draw });
  } catch (error) {
    console.error("Error fetching draw by ID:", error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
});

// POST new remaindata entry
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({ status: 400, message: "No data provided" });
    }

    const insertQuery = `
        INSERT INTO remaindata(
          date,
          data_
        )
        VALUES($1, $2)
        RETURNING *
      `;

    const values = [data.date, data.data_];

    // insert
    await db.one(insertQuery, values);

    // fetch last 10 rows
    const last10RemainData = await db.any(`
        SELECT *
        FROM remaindata
        ORDER BY id DESC
        LIMIT 10
      `);

    res.json({ status: 200, last10Draws: last10RemainData });
  } catch (error) {
    console.error("Error inserting into DB:", error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
});

// DELETE draw by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await db.result(`DELETE FROM remaindata WHERE id = $1`, [
      id,
    ]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Draw not found or already deleted" });
    }

    res.json({ status: 200, message: `Draw with ID ${id} deleted` });
  } catch (error) {
    console.error("Error deleting draw:", error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;
