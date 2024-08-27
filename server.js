const app = require('./app');
require("dotenv").config();
const PORT = process.env.PORT || 9001;


    app.listen(PORT, () => {
        console.log(`App listening on port : ${PORT} this is the last checking`);

       
    });
