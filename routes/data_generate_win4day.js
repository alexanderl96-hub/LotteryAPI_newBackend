// const express = require('express');
// const router = express.Router();
// const db = require('../db/index');

// /*  Get all data from generate_numbers_win_4_day table */
// router.get('/', async (req, res) => {
//     try {
//         const all_data = await db.any('SELECT * FROM generate_numbers_win_4_day');
//         res.status(200).json({ data_generateNWin4day: all_data });
//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             message: error.message
//         });
//     }
// });

// /* Post data into generate_numbers_win_4_day table */
// router.post('/', async (req, res) => {
//     try {
//         const { date, storage, amount } = req.body;

//         // Ensure storage is a valid JSON array
//         let jsonData;
//         try {
//             jsonData = JSON.parse(storage);
//         } catch (parseError) {
//             throw new Error('Storage must be a valid JSON array');
//         }

//         if (!Array.isArray(jsonData)) {
//             throw new Error('Storage must be an array');
//         }

//         const addingNewData = await db.one(
//             `INSERT INTO generate_numbers_win_4_day (date, storage, amount) 
//             VALUES ($1, $2, $3) RETURNING *`,
//             [date, jsonData, amount]
//         );

//         res.status(201).json({ addingData: addingNewData });
//     } catch (error) {
//         res.status(400).json({
//             status: 400,
//             message: error.message
//         });
//     }
// });

// /* Delete element by id from generate_numbers_win_4_day table */
// router.delete('/:id', async (req, res) => {
//     try {
//         const result = await db.result('DELETE FROM generate_numbers_win_4_day WHERE id = $1', [req.params.id]);

//         if (result.rowCount === 0) {
//             return res.status(404).json({
//                 status: 404,
//                 message: 'Element ID not found'
//             });
//         }

//         res.status(204).send();  // No content to send back
//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             message: error.message
//         });
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const db = require('../db/index');

// Middleware to prevent caching
const noCache = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache'); // For HTTP 1.0
    res.setHeader('Expires', '0'); // For HTTP 1.1
    next();
};

// Apply noCache middleware to all routes
router.use(noCache);

/*  Get all data from generate_numbers_win_4_day table */
router.get('/', async (req, res) => {
    try {
        const all_data = await db.any('SELECT * FROM generate_numbers_win_4_day');
        res.status(200).json({ data_generateNWin4day: all_data });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
});

/* Post data into generate_numbers_win_4_day table */
router.post('/', async (req, res) => {
    try {
        const { date, storage, amount } = req.body;

        // Ensure storage is a valid JSON array
        let jsonData;
        try {
            jsonData = JSON.parse(storage);
        } catch (parseError) {
            throw new Error('Storage must be a valid JSON array');
        }

        if (!Array.isArray(jsonData)) {
            throw new Error('Storage must be an array');
        }

        const addingNewData = await db.one(
            `INSERT INTO generate_numbers_win_4_day (date, storage, amount) 
            VALUES ($1, $2, $3) RETURNING *`,
            [date, jsonData, amount]
        );

        res.status(201).json({ addingData: addingNewData });
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message
        });
    }
});

/* Delete element by id from generate_numbers_win_4_day table */
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.result('DELETE FROM generate_numbers_win_4_day WHERE id = $1', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Element ID not found'
            });
        }

        res.status(204).send();  // No content to send back
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
});

module.exports = router;