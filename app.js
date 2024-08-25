var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const moment = require('moment-timezone');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const app = express();

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});



app.use(function(req, res, next) {
    next(createError(404));
  });



// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
    });
});
  
  
  module.exports = app;