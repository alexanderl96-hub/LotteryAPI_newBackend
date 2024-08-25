const app = require('./app');
// const { loadModel } = require('./LSTM-Model/lstm_model.js'); 
require("dotenv").config();
const PORT = process.env.PORT || 9001;



// loadModel().then(model => {
//     app.locals.model = model;
    app.listen(PORT, () => {
        console.log(`App listening on port : ${PORT} this is the last checking`);

       
    });
// }).catch(error => {
//     console.error('Failed to load model:', error);
//     process.exit(1); // Exit the process with an error code
// });