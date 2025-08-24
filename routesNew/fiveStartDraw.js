// const express = require("express");
// const router = express.Router();
// const db = require("../db"); // this is your pg-promise db

// // GET all five_star_draw entries
// router.get("/", async (req, res) => {
//   try {
//     const result = await db.any("SELECT * FROM five_star_draw ORDER BY id DESC");
//     res.json({ status: 200, data_fiveStarDraw: result });
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     res.status(500).json({ status: 500, message: error.message });
//   }
// });

// // GET five_star_draw entry by ID
// router.get('/:id', async (req, res) => {
//     try {
//       const id = parseInt(req.params.id);
//       const draw = await db.oneOrNone(`SELECT * FROM five_star_draw WHERE id = $1`, [id]);
  
//       if (!draw) return res.status(404).json({ status: 404, message: "Draw not found" });
  
//       res.json({ status: 200, draw });
//     } catch (error) {
//       console.error("Error fetching draw by ID:", error.message);
//       res.status(500).json({ status: 500, message: error.message });
//     }
// });

// // POST new five_star_draw entry
// router.post('/', async (req, res) => {
//     try {
//       const data = req.body;
  
//       if (!data) {
//         return res.status(400).json({ status: 400, message: "No data provided" });
//       }
  
//       const insertQuery = `
//         INSERT INTO five_star_draw (
//           date,
//           nextDrawDate,
//           nextDrawJackpot,
//           numbers,
//           extraFields,
//           gameName,
//           playName
//         )
//         VALUES($1, $2, $3, $4, $5, $6, $7)
//         RETURNING *
//       `;
  
//       const values = [
//         data.date,
//         data.nextDrawDate,
//         data.nextDrawJackpot,
//         data.numbers,    // text[]
//         data.extraFields,               // empty extraFields
//         data.gameName,
//         data.playName
//       ];
  
//       // insert
//       await db.one(insertQuery, values);
  
//       // fetch last 10 rows
//       const last10Five_Star_Draw = await db.any(`
//         SELECT *
//         FROM five_star_draw
//         ORDER BY id DESC
//         LIMIT 10
//       `);
  
//       res.json({ status: 200, last10Draws: last10Five_Star_Draw });
  
//     } catch (error) {
//       console.error("Error inserting into DB:", error.message);
//       res.status(500).json({ status: 500, message: error.message });
//     }
//   });

// // DELETE draw by ID
// router.delete('/:id', async (req, res) => {
//     try {
//       const id = parseInt(req.params.id);
//       const result = await db.result(`DELETE FROM five_star_draw WHERE id = $1`, [id]);
  
//       if (result.rowCount === 0) {
//         return res.status(404).json({ status: 404, message: "Draw not found or already deleted" });
//       }
  
//       res.json({ status: 200, message: `Draw with ID ${id} deleted` });
//     } catch (error) {
//       console.error("Error deleting draw:", error.message);
//       res.status(500).json({ status: 500, message: error.message });
//     }
// });

// module.exports = router;