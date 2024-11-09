var express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Lottery Storage Express!' });
});

module.exports = router;