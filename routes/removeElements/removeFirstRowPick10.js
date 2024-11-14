var express = require('express');
var router = express.Router();

const moment = require('moment-timezone');

const db = require('../../db/index');


router.get("/pick10", async (req, res) => {
    try {

        // if(timeForProcessComplain()){
            // if (!timeForProcessComplain()) {
            //     return res.send({ status: "Error", message: "Not the right time for processing" });
            // }


            let responseData = []
            const data = await db.any("SELECT * FROM generate_numbers_pick10")

            console.log("Data: ", data.length)

            if (data.length > 5) {
            //     // Delete the first row
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
            //     // Refetch the data after deletion
                responseData = await db.any("SELECT * FROM generate_numbers_pick10");
            } else {
                responseData = data;
            }

            res.send({
                status: "Sucesss",
                data: responseData,
            })
      
        // }


    } catch (error) {
        res.send({
            status: 404,
            message: error.message
          })
    }

})

// router.get("/cash4Fife", async (req, res) => {
//     try {
//         let responseData = []
//         const data = await db.any("SELECT * FROM generate_numbers_cash4life")

//         console.log("Data: ", data.length)

//         if (data.length > 17) {
//             // Delete the first row
//             await db.any(`
//                 WITH deleted AS (
//                     SELECT id 
//                     FROM generate_numbers_cash4life 
//                     ORDER BY id ASC 
//                     LIMIT 1
//                 )
//                 DELETE FROM generate_numbers_cash4life 
//                 WHERE id IN (SELECT id FROM deleted);
//             `);
//             // Refetch the data after deletion
//             responseData = await db.any("SELECT * FROM generate_numbers_cash4life");
//         } else {
//             responseData = data;
//         }

//         res.send({
//             status: "Sucesss",
//             data: responseData
//         })
//     } catch (error) {
//         res.send({
//             status: 404,
//             message: error.message
//           })
//     }

// })







const timeForProcessComplain = () => {
    const now = moment().tz("America/New_York");
    const currentHour = now.hour();   // Get the current hour in New York (0-23)
    const currentMinute = now.minute(); // Get the current minute in New York (0-59)

    // Check if the current time is between 2 AM (2) and 3 AM (3)
    if (currentHour === 0 && currentMinute >= 0 && currentMinute < 5) {
        console.log("The current time is between 2 AM and 3 AM.");
        return true;
    } else {
        console.log("The current time is not between 2 AM and 3 AM.");
        return false;
    }
};



module.exports = router;


// const element = await db.one('DELETE FROM pick_10 WHERE id = $1', [req.params.id]);