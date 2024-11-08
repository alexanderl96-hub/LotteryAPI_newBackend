var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const moment = require('moment-timezone');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');



const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // Use TLS
  auth: {
      user: process.env.EMAIL_USER,  // Your email address
      pass: process.env.EMAIL_PASS   // App password
  }
});



var homeRoot = require('./routes/index.js')


var powerballData = require('./routes/data_powerball');
var megamillionsData = require('./routes/data_megamillions');
var newyorklottoData = require('./routes/data_newyorklotto');
var pick10Data = require('./routes/data_pick10');
var cash4lifeData = require('./routes/data_cash4life');
var take5dayData = require('./routes/data_take5day');
var win4dayData = require('./routes/data_win4day');
var numbersdayData = require('./routes/data_numbersday');

var generatePowerBallData = require('./routes/data_generate_numberspowerBall.js');
var generatePick10Data = require('./routes/data_generate_numberspick10.js')
var generateMegaMillions = require('./routes/data_generate_numbersmegamillions.js')
var generateTake5 = require('./routes/data_generate_take5.js')
var generateNYLotto = require('./routes/data_generate_newyorklotto.js')
var generateCashLife = require('./routes/data_generate_cash4life.js')
var generateWin4Day = require('./routes/data_generate_win4day.js')
var generateNumbersDay = require('./routes/data_generate_numbers_day.js')


var predictionText = require('./routes/predictNumbers.js')

var Pick10Update = require('./ServiceUpdate/Pick10_Update.js');
var megaMillionsUpdate = require('./ServiceUpdate/MegaMillions_Update.js')
var powerBallUpdate = require('./ServiceUpdate/PowerBall_Update.js')
var cashForLifeUpdate = require('./ServiceUpdate/CashForLife_Update.js')
var newYorkLottoUpdate = require('./ServiceUpdate/NewYorkLotto_Update.js')
var threeAtOnceDay = require('./ServiceUpdate/threeAtOnces_Day_Update.js')
var threeAtOnceNight = require('./ServiceUpdate/threeAtOnces_Night_Update.js')


var TaskSchedule = require('./Task/task_Fetch.js');
var removeRow = require("./routes/removeElements/removeFirstRowPick10.js")



const app = express();

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Frontend origin
  credentials: true // Allow cookies or auth headers if needed
}))

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Schedule the cron job to run every day at 6:00 AM 10:53 PM for Pick 10
cron.schedule('46 14 * * *', async () => {
    try {
      // console.log('Cron job executed:', moment().tz("America/New_York").format());
        await Pick10Update();

        const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
        const memberName = 'Alexandr';
        const reason = "Pick 10"
        const schedule =  moment().tz("America/New_York").format()

        await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
      console.log('Data fetched by cron job at 6:00 AM');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });

  // Schedule the cron job to run every day at 6:00 AM 10:53 PM Cash4Life
cron.schedule('42 14 * * *', async () => {
  try {

      await cashForLifeUpdate();

      const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
      const memberName = 'Alexandr';
      const reason = "Pick 10"
      const schedule =  moment().tz("America/New_York").format()

      await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    console.log('Data fetched by cron job at 6:00 AM');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

// Function to run on Tuesdays,4  Thursdays, and Sundays at 8:20 AM Powerball
  cron.schedule('59 17 * * 2,4,0', async () => {
    try {
        await powerBallUpdate();


 const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
        const memberName = 'Alexandr';
        const reason = "Pick 10"
        const schedule =  moment().tz("America/New_York").format()

        await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
      console.log('Data fetched by cron job at 6:00 AM');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });

  // Function to run on Wednesdays and Saturdays at 8:20 AM Mega Millions
cron.schedule('43 14 * * 3,6', async () => {
  try {
    await megaMillionsUpdate();

 const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
        const memberName = 'Alexandr';
        const reason = "Pick 10"
        const schedule =  moment().tz("America/New_York").format()

    await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    console.log('MegaMillions update executed at 8:20 AM on Wednesday and Saturday');
  } catch (error) {
    console.error('Error fetching MegaMillions data:', error);
  }
});

// Function to run on Thursdays and Sundays at 8:20 AM     new York lotto
cron.schedule('29 13 * * 4,0', async () => {
  try {
     await newYorkLottoUpdate();
     
 const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
        const memberName = 'Alexandr';
        const reason = "Pick 10"
        const schedule =  moment().tz("America/New_York").format()

     await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    console.log('NewYorkLotto update executed at 8:20 AM on Thursday and Sunday');
  } catch (error) {
    console.error('Error fetching NewYorkLotto data:', error);
  }
});

// Functions to run every 12 hours (at 8:20 AM and 15:30 PM)     take5, win4, numbers (midday)
cron.schedule('18 14 * * *', async () => {
  try {
      await threeAtOnceDay();

      const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
      const memberName = 'Alexandr';
      const reason = "Pick 10"
      const schedule =  moment().tz("America/New_York").format()

      await sendSuspensionEmail(memberEmail, memberName, reason, schedule);
    console.log('12-hour updates (Win4, NumbersDays, Take5) executed at 4:30 PM and 11:30 PM');
  } catch (error) {
    console.error('Error fetching 12-hour updates:', error);
  }
});

// Functions to run every 12 hours (at 8:20 AM and 8:20 PM)  take5, win4, numbers (evening)
cron.schedule('19 14 * * *', async () => {
  try {
      await threeAtOnceNight();

      const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
      const memberName = 'Alexandr';
      const reason = "Pick 10"
      const schedule =  moment().tz("America/New_York").format()

      await sendSuspensionEmail(memberEmail, memberName, reason, schedule);
    console.log('12-hour updates (Win4, NumbersDays, Take5) executed at 4:30 PM and 11:30 PM');
  } catch (error) {
    console.error('Error fetching 12-hour updates:', error);
  }
});



app.use('/powerBall', powerballData);
app.use('/megaMillions', megamillionsData);
app.use('/newYorkLotto', newyorklottoData);
app.use('/pick10', pick10Data);
app.use('/cash4Life', cash4lifeData);
app.use('/take5Day', take5dayData);
app.use('/win4Day', win4dayData);
app.use('/numbersDay', numbersdayData);


app.use('/generate_PowerBall', generatePowerBallData);
app.use('/generate_Pick10', generatePick10Data);
app.use('/generate_MegaMillions', generateMegaMillions);
app.use('/generate_Take5', generateTake5);
app.use('/generate_NYLotto', generateNYLotto);
app.use('/generate_CashLife', generateCashLife);
app.use('/generate_Win4Day', generateWin4Day);
app.use('/generate_NumbersDay', generateNumbersDay);


app.use('/api-fetch', TaskSchedule);

app.use("/storageRemove", removeRow)


app.use('/text', predictionText)


app.use('/', homeRoot);


// Handle preflight requests for CORS
app.options('*', cors());



app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-Width')
  next();
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
  






const sendSuspensionEmail = async (email, memberName, reason, schedule) => {
  try {
      let info = await transporter.sendMail({
          from: '"Support Team" <alexander.lrperez@gmail.com>', // Sender address
          to: email, // Recipient email
          subject: 'Request Data has been made', // Subject line
          text: `Hello ${memberName}, the request data has been made. Game name: ${reason} at ${schedule}. Please contact support for more information.`, // Plain text body
          html: `<p>Hello ${memberName},</p><p>Your account has been suspended for the following reason:</p><p><strong>${reason}</strong></p><p>Please contact support for more information.</p>` // HTML body
      });

      console.log('Email sent: %s', info.messageId);
  } catch (error) {
      console.error('Error sending email:', error);
  }
};
  
  module.exports = app;

  /*
  "schema": "PGDATABASE_URL=$DATABASE_URL psql -f db/schema.sql",
  "seed": "PGDATABASE_URL=$DATABASE_URL psql -f db/seed.sql", */


  // https://lotteryapi-newbackend2024.adaptable.app/api-fetch/trigger-task