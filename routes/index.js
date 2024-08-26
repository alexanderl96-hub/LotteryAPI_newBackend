var express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});


// router.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
//   });


module.exports = router;