const app = require('./app');
require("dotenv").config();
const PORT = process.env.PORT || 9001;


    // app.listen(PORT, () => {
    //     console.log(`App listening on port : ${PORT} this is the last checking`);

       
    // });
    const server = app.listen(PORT, () => {
        console.log(`App listening on port : ${PORT} with a custom timeout`);
    });
    
    // Set the server timeout to 5 minutes (300000 milliseconds)
    server.setTimeout(300000); // Adjust this value as needed