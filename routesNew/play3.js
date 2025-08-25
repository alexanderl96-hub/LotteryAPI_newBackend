const express = require("express");
const router = express.Router();
const db = require("../db"); // this is your pg-promise db
const isoToMMDDYYYY = require('../ServiceUpdate/dataJsonAPiRequest')

// GET all play3 entries
router.get("/", async (req, res) => {
  try {
    const result = await db.any("SELECT * FROM play3 ORDER BY id DESC");
    res.json({ status: 200, data_play3: result });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
});

// GET play3 entry by ID
router.get('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const draw = await db.oneOrNone(`SELECT * FROM play3 WHERE id = $1`, [id]);
  
      if (!draw) return res.status(404).json({ status: 404, message: "Draw not found" });
  
      res.json({ status: 200, draw });
    } catch (error) {
      console.error("Error fetching draw by ID:", error.message);
      res.status(500).json({ status: 500, message: error.message });
    }
});

// POST new play3 entry
  router.post('/', async (req, res) => {
    try {
      const payload = req.body;
      if (!Array.isArray(payload) || payload.length === 0) {
        return res.status(400).json({ status: 400, message: 'No data provided' });
      }
  
      // helper to format dates as "MM/DD/YYYY"
      const fmt = (d) => {
        if (!d) return d;
        const toDate = (x) =>
          x instanceof Date ? x :
          typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) ? new Date(x + 'T00:00:00Z') :
          new Date(x); // fallback
        const dt = toDate(d);
        const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(dt.getUTCDate()).padStart(2, '0');
        const yyyy = dt.getUTCFullYear();
        return `${mm}/${dd}/${yyyy}`;
      };
  
      const insertSQL = `
        INSERT INTO play3 (
          date,
          nextDrawDate,
          nextDrawJackpot,
          numbers,
          extraFields,
          gameName,
          playName
        )
        VALUES (
          to_date($1,'MM/DD/YYYY'),
          to_date($2,'MM/DD/YYYY'),
          $3,
          $4::text[],
          $5::text[],
          $6,
          $7
        )
        RETURNING id, date, nextDrawDate, nextDrawJackpot, numbers, extraFields, gameName, playName
      `;
  
      const inserted = [];
  
      await db.tx(async t => {
        for (const d of payload) {
          const vals = [
       isoToMMDDYYYY(data.date),
       isoToMMDDYYYY(data.nextDrawDate),
            d.nextDrawJackpot ?? 0,
            d.numbers ?? [],
            d.extraFields ?? [],
            d.gameName,
            d.playName
          ];
          const row = await t.one(insertSQL, vals);
          inserted.push(row);
        }
      });
  
      // Build the response in your requested shape
      const draw = inserted.map(r => ({
        date: fmt(r.date),
        nextDrawDate: fmt(r.nextdrawdate),
        nextDrawJackpot: Number(r.nextdrawjackpot),
        numbers: (r.numbers || []).map(String),
        extraFields: r.extrafields ?? [],
        gameName: r.gamename,
        playName: r.playname
      }));
  
      const response = [{
        id: inserted[0].id,                 // first inserted row id
        date: draw[0].date,                 // first draw's date (MM/DD/YYYY)
        nextDrawDate: draw[0].nextDrawDate, // first draw's nextDrawDate
        draw                                  // full array you sent, normalized from DB
      }];
  
      return res.json(response);
    } catch (error) {
      console.error('Insert error:', error);
      return res.status(500).json({ status: 500, message: error.message });
    }
  });

// DELETE draw by ID
router.delete('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await db.result(`DELETE FROM play3 WHERE id = $1`, [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ status: 404, message: "Draw not found or already deleted" });
      }
  
      res.json({ status: 200, message: `Draw with ID ${id} deleted` });
    } catch (error) {
      console.error("Error deleting draw:", error.message);
      res.status(500).json({ status: 500, message: error.message });
    }
});

module.exports = router;