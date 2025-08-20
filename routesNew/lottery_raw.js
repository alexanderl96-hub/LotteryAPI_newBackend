const express = require("express");
const router = express.Router();
const db = require("../db"); // this is your pg-promise db
const storedData = require("../ServiceUpdate/dataJsonAPiRequest");

// GET all remaindata entries
router.get("/", async (req, res) => {
  try {
      await storedData();
    
      const result = await db.any("SELECT * FROM allremaindata ORDER BY id DESC");

      const data = [{
        dataDate: result[0].date,
        dataResult: result[0].data_
      }]
   
    res.json({ status: 200, data_lottery_raw: data });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
});

// GET remaindata entry by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const draw = await db.oneOrNone(`SELECT * FROM allremaindata WHERE id = $1`, [
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
    // const { date, data_ } = req.body;
    const { date, dateSelect, data_ } = req.body;
    if (date == null || data_ == null) {
      return res.status(400).json({ status: 400, message: "Missing date or data_" });
    }

    // 1) Normalize date to ISO (YYYY-MM-DD)
    const normalizeDate = (input) => {
      if (typeof input !== "string") input = String(input);
      // already ISO
      if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
      // MM/DD/YYYY
      const mdy = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (mdy) return `${mdy[2].padStart(2,'0')}-${mdy[1].padStart(2,'0')}-${mdy[3]}`;
      // Fallback: let JS parse things like "Sun Aug 17 2025"
      const d = new Date(input);
      if (!isNaN(d)) return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      throw new Error(`Unparseable date: ${input}`);
    };

    // 2) Unwrap possibly stringified JSON (1x/2x)
    const toOriginal = (input) => {
      let v = input;
      for (let i = 0; i < 5 && typeof v === "string"; i++) {
        try { v = JSON.parse(v); } catch { break; }
      }
      return v;
    };

    const isoDate = normalizeDate(date);
    const jsonSelected = toOriginal(dateSelect);
    const jsonPayload = toOriginal(data_);

    const sql = `
      INSERT INTO allremaindata (date, dateSelect, data_)
      VALUES ($1::date, $2::jsonb, $3::jsonb)
      RETURNING id, to_char(date,'YYYY-MM-DD') AS date, dateSelect, data_
    `;

      const params = [
      isoDate,
      jsonSelected == null ? null : JSON.stringify(jsonSelected),
      jsonPayload  == null ? null : JSON.stringify(jsonPayload),
    ];

    // const row = await db.one(sql, [isoDate, JSON.stringify(jsonPayload)]);
    const row = await db.one(sql, params);

    const last10 = await db.any(`
      SELECT id, to_char(date,'YYYY-MM-DD') AS date, dateSelect, data_
      FROM allremaindata
      ORDER BY id DESC
      LIMIT 10
    `);

    return res.json({ status: 200, inserted: row, last10Draws: last10 });
  } catch (error) {
    console.error("Error inserting into DB:", error);
    return res.status(500).json({ status: 500, message: error.message });
  }
});


// DELETE draw by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await db.result(`DELETE FROM allremaindata WHERE id = $1`, [
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
