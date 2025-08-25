const express = require("express");
const router = express.Router();
const db = require("../db"); // this is your pg-promise db
const {isoToMMDDYYYY} = require('../ServiceUpdate/dataJsonAPiRequest');

// GET all derby_cash entries
router.get("/", async (req, res) => {
  try {
    const result = await db.any("SELECT * FROM derby_cash ORDER BY id DESC");
    res.json({ status: 200, data_derby_cash: result });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
});

// GET derby_cash entry by ID
router.get('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const draw = await db.oneOrNone(`SELECT * FROM derby_cash WHERE id = $1`, [id]);
  
      if (!draw) return res.status(404).json({ status: 404, message: "Draw not found" });
  
      res.json({ status: 200, draw });
    } catch (error) {
      console.error("Error fetching draw by ID:", error.message);
      res.status(500).json({ status: 500, message: error.message });
    }
});

// POST new derby_cash entry
router.post('/', async (req, res) => {
    try {
      const data = req.body;
  
      if (!data) {
        return res.status(400).json({ status: 400, message: "No data provided" });
      }
  
      const insertQuery = `
        INSERT INTO derby_cash (
          date,
          nextDrawDate,
          nextDrawJackpot,
          numbers,
          extraFields,
          gameName,
          playName
        )
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
  
      const values = [
        isoToMMDDYYYY(data.date),
        data.nextDrawDate !== "" ? isoToMMDDYYYY(data.nextDrawDate) :isoToMMDDYYYY(nextDay(data.date)),
        data.nextDrawJackpot !== null ? data.nextDrawJackpot : 0,
        data.numbers,             // text[]
        data.extraFields,               // empty extraFields
        data.gameName,
        data.playName
      ];
             
  
      // insert
      await db.one(insertQuery, values);
  
      // fetch last 10 rows
      const last10derby_cash = await db.any(`
        SELECT *
        FROM derby_cash
        ORDER BY id DESC
        LIMIT 10
      `);
  
      res.json({ status: 200, last10Draws: last10derby_cash });
  
    } catch (error) {
      console.error("Error inserting into DB:", error.message);
      res.status(500).json({ status: 500, message: error.message });
    }
  });

// DELETE draw by ID
router.delete('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await db.result(`DELETE FROM derby_cash WHERE id = $1`, [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ status: 404, message: "Draw not found or already deleted" });
      }
  
      res.json({ status: 200, message: `Draw with ID ${id} deleted` });
    } catch (error) {
      console.error("Error deleting draw:", error.message);
      res.status(500).json({ status: 500, message: error.message });
    }
});




function nextDay(mmddyyyy) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(mmddyyyy);
  if (!m) throw new Error("Use MM/DD/YYYY");
  const [, mm, dd, yyyy] = m;

  // Build in UTC to avoid timezone/DST issues
  const d = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));

  // Validate input date (rejects things like 02/30/2025)
  if (
    d.getUTCFullYear() !== Number(yyyy) ||
    d.getUTCMonth() !== Number(mm) - 1 ||
    d.getUTCDate() !== Number(dd)
  ) {
    throw new Error("Invalid date");
  }

  // Add one day
  d.setUTCDate(d.getUTCDate() + 1);

  const mm2 = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd2 = String(d.getUTCDate()).padStart(2, "0");
  const yyyy2 = String(d.getUTCFullYear());
  return `${mm2}/${dd2}/${yyyy2}`;
}


module.exports = router;