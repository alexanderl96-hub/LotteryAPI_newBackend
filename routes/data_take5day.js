var express = require('express');
var router = express.Router();

const db = require('../db/index');

/*  Get all data from take_5_day table */

router.get('/', async function (req, res, next) {
    try {
        const all_data = await db.any('SELECT * FROM take_5_day');
        res.json({data_take5day : all_data});
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
        const element = await db.one('SELECT * FROM take_5_day WHERE id = $1',[req.params.id]);
        res.json(element);
    } catch (error) {
        res.send({
            status: 404,
            message: error.message
        })
    }
})

/* Post data into take_5_day table */
router.post('/', async (req, res) => {
    try {
        const {date, one, two, three, four, five, amount, image, timedate } = req.body;
        if(image == undefined){
            image = ''
        }
        const addingNewData = await db.one( ` INSERT INTO take_5_day 
        (date, one, two, three, four, five, amount, image, timedate) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, 
        [date, one, two, three, four, five, amount, image, timedate]);
      
       
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
        const element = await db.one('DELETE FROM take_5_day WHERE id = $1', [req.params.id]);
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