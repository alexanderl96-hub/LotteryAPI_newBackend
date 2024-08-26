var express = require('express');
var router = express.Router();

const db = require('../db/index');

/*  Get all data from pick_10 table */

router.get('/', async function (req, res, next) {
    try {
        const all_data = await db.any('SELECT * FROM pick_10');
        res.json({data_pick10 : all_data});
    } catch (error) {
        res.send({
            status : 404,
            message : error.message
        })
    }
})

/* Get element in data by id */
router.get('/:id', async (req, res) => {
    try {
        const element = await db.one('SELECT * FROM pick_10 WHERE id = $1',[req.params.id]);
        res.json(element);
    } catch (error) {
        res.send({
            status: 404,
            message: error.message
        })
    }
})

/* Post data into mega_millions table */
router.post('/', async (req, res) => {
    try {
        const {date, one, two, three, four, five, six, seven, eight, nine, ten,
             eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen,
             nineteen, twenty, amount, image } = req.body;
        if(image == undefined){
            image = ''
        }
        const addingNewData = await db.one( ` INSERT INTO pick_10 
        (date, one, two, three, four, five, six, seven, eight, nine, ten,
            eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen,
            nineteen, twenty, amount, image) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING *`, 
        [date,  one, two, three, four, five, six, seven, eight, nine, ten,
            eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen,
            nineteen, twenty, amount, image]);
      
       console.log("Check if is coming from here")
        res.json({addingData: addingNewData})
    } catch (error) {
        res.send({
            status: 400,
            message: error.message
        })
    }
})

/* Delete element by id from table*/
router.delete('/:id', async (req, res) => {
    try {
        const element = await db.one('DELETE FROM pick_10 WHERE id = $1', [req.params.id]);
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