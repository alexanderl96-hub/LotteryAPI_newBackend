var express = require('express');
var router = express.Router();

const db = require('../../db/index');


router.get("/pick10", async (req, res) => {
    try {
        let responseData = []
        const data = await db.any("SELECT * FROM generate_numbers_pick10")

        console.log("Data: ", data.length)

        if (data.length > 17) {
            // Delete the first row
            await db.any(`
                WITH deleted AS (
                    SELECT id 
                    FROM generate_numbers_pick10 
                    ORDER BY id ASC 
                    LIMIT 1
                )
                DELETE FROM generate_numbers_pick10 
                WHERE id IN (SELECT id FROM deleted);
            `);
            // Refetch the data after deletion
            responseData = await db.any("SELECT * FROM generate_numbers_pick10");
        } else {
            responseData = data;
        }

        res.send({
            status: "Sucesss",
            data: responseData
        })
    } catch (error) {
        res.send({
            status: 404,
            message: error.message
          })
    }

})

router.get("/cash4Fife", async (req, res) => {
    try {
        let responseData = []
        const data = await db.any("SELECT * FROM generate_numbers_cash4life")

        console.log("Data: ", data.length)

        if (data.length > 17) {
            // Delete the first row
            await db.any(`
                WITH deleted AS (
                    SELECT id 
                    FROM generate_numbers_cash4life 
                    ORDER BY id ASC 
                    LIMIT 1
                )
                DELETE FROM generate_numbers_cash4life 
                WHERE id IN (SELECT id FROM deleted);
            `);
            // Refetch the data after deletion
            responseData = await db.any("SELECT * FROM generate_numbers_cash4life");
        } else {
            responseData = data;
        }

        res.send({
            status: "Sucesss",
            data: responseData
        })
    } catch (error) {
        res.send({
            status: 404,
            message: error.message
          })
    }

})





module.exports = router;


// const element = await db.one('DELETE FROM pick_10 WHERE id = $1', [req.params.id]);