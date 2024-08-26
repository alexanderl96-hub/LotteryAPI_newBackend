var express = require('express');
var router = express.Router();

const db = require('../db/index');

/*  Get all data from powerball table */

router.get('/', async function (req, res, next) {
    try {
        const all_data = await db.any('SELECT * FROM generate_numbers_newyorklotto');
        res.json({data_generateNNewYorkLotto : all_data});
    } catch (error) {
        res.send({
            status : 404,
            message : error.message
        })
    }
})

router.post('/', async (req, res) => {
    try {
        const { date, storage, amount } = req.body;

        const jsonData = JSON.parse(storage)

        if (!Array.isArray(jsonData)) {
            throw new Error('Storage must be an array');
        }
        // const storageString = storage.map(subArray => `{${subArray.join(',')}}`).join(',');
        const addingNewData = await db.one(
            `INSERT INTO generate_numbers_newyorklotto (date, storage, amount) 
            VALUES ($1, $2, $3) RETURNING *`,
            [date,  jsonData, amount]
        );

        res.json({ addingData: addingNewData });
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const element = await db.one('DELETE FROM generate_numbers_newyorklotto WHERE id = $1', [req.params.id]);
        res.json(element)
        res.send({
            status: "Success", message: 'Element ID has been deleted successfully'
        })
    } catch (error) {
        res.send({
            status: 404,
            message: error.message
          })
    }
})


module.exports = router;