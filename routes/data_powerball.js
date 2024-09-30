var express = require('express');
var router = express.Router();


const db = require('../db/index');

/*  Get all data from powerball table */
router.get('/', async (req, res, next) => {
    try {
        const all_data = await db.any('SELECT * FROM powerball');
        res.json({data_powerball : all_data});
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
        const element = await db.one('SELECT * FROM powerball WHERE id = $1',[req.params.id]);
        res.json(element);
    } catch (error) {
        res.send({
            status: 404,
            message: error.message
        })
    }
})

/* Post data into powerBall table */
router.post('/', async (req, res) => {
    try {
        const {date, one, two, three, four, five, powerball_lucky, powerplay, amount, image } = req.body;
        if(image == undefined){
            image = ''
        }
        const addingNewData = await db.one( ` INSERT INTO powerball 
        (date, one, two, three, four, five, powerball_lucky, powerplay, amount, image) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, 
        [date, one, two, three, four, five, powerball_lucky, powerplay, amount, image]);
      
       
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
        const element = await db.one('DELETE FROM powerball WHERE id = $1', [req.params.id]);
        // res.json(element)
        res.json({
            status: "Success", message: `Element  ID :${element} has been deleted successfully`
        })
    } catch (error) {
        res.send({
            status: 404,
            message: error.message
          })
    }
})





module.exports = router;