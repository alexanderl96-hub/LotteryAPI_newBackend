const express = require("express");
const router = express.Router();
const db = require("../db"); // this is your pg-promise db
// const dataJsonRequest = require("../ServiceUpdate/dataJsonAPiRequest");

router.get("/", async (req, res) => {
  try {
    // const result = await dataJsonRequest();
    res.json({ status: 200, data_AllData: result });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;
