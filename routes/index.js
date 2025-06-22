var express = require('express');
var router = express.Router();
var dataJsonRequest = require("..//ServiceUpdate/dataJson_RequestApi")


router.get('/', (req, res) => {
    res.json({ message: `Welcome to Lottery Storage Express! ${values.exports}` });
});

module.exports = router;