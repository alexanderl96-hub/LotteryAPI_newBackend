const express = require('express');
var router = express.Router();

const moment = require('moment-timezone');
const cron = require('node-cron');
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS   // App password
    }
  });
  

var Pick10Update = require('../ServiceUpdate/Pick10_Update.js')



// Endpoint to trigger the cron job or task manually
router.get('/trigger-task',  async (req, res) => {
    
    if (checkTimePick10()) {
        console.log("Running the task since the time is between 2 AM and 3 AM.");
     // await Pick10Update();

        const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
        const memberName = 'Alexander';
        const reason = "Pick 10"
        const schedule =  moment().tz("America/New_York").format()
    
        await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    }
    res.send('Task has been executed');
});

// Endpoint to trigger the cron job or task manually
router.get('/trigger-task',  async (req, res) => {
    
    // await cashForLifeUpdate();

    const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
    const memberName = 'Alexander';
    const reason = "Cash4Life"
    const schedule =  moment().tz("America/New_York").format()

    await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 

    res.send('Task has been executed');
});


// Endpoint to trigger the cron job or task manually
router.get('/trigger-task',  async (req, res) => {

    if(checkDayPowerball()){
        // await powerBallUpdate();

        const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
        const memberName = 'Alexander';
        const reason = "Powerball"
        const schedule =  moment().tz("America/New_York").format()

        await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 

    }

    res.send('Task has been executed');
});


// Endpoint to trigger the cron job or task manually
router.get('/trigger-task',  async (req, res) => {

    if(checkDayMegaMillions() ){
        // await megaMillionsUpdate();;

        const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
        const memberName = 'Alexander';
        const reason = "MegaMillions"
        const schedule =  moment().tz("America/New_York").format()

        await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 

    }

    res.send('Task has been executed');
});


// Endpoint to trigger the cron job or task manually
router.get('/trigger-task',  async (req, res) => {

    if(checkDayMegaNewYorkLotto()){
        // await newYorkLottoUpdate();

        const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
        const memberName = 'Alexander';
        const reason = "New York Lotto"
        const schedule =  moment().tz("America/New_York").format()

        await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 

    }

    res.send('Task has been executed');
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




const checkDayPowerball = () => {
    const today = new Date();
    const currentDay = today.getDay(); // Get the current day of the week (0-6)

    // Check if today is Tuesday (2), Thursday (4), or Sunday (0)
    if (currentDay === 0 || currentDay === 2 || currentDay === 4) {
        console.log("Today is either Tuesday, Thursday, or Sunday.");
        return true;
    } else {
        console.log("Today is not Tuesday, Thursday, or Sunday.");
        return false;
    }
};

const checkDayMegaMillions = () => {
    const today = new Date();
    const currentDay = today.getDay(); // Get the current day of the week (0-6)

    // Check if today is Wednesday (3), Saturday (6)
    if (currentDay === 3 || currentDay === 6 ) {
        console.log("Today is either Tuesday, Thursday, or Sunday.");
        return true;
    } else {
        console.log("Today is not Tuesday, Thursday, or Sunday.");
        return false;
    }
};

const checkDayMegaNewYorkLotto = () => {
    const today = new Date();
    const currentDay = today.getDay(); // Get the current day of the week (0-6)

    // Check if today is Thursday (4), Sunday (0)
    if (currentDay === 4 || currentDay === 0 ) {
        console.log("Today is either Tuesday, Thursday, or Sunday.");
        return true;
    } else {
        console.log("Today is not Tuesday, Thursday, or Sunday.");
        return false;
    }
};


const checkTimePick10 = () => {
    const now = new Date();
    const currentHour = now.getHours(); // Get the current hour (0-23)
    const currentMinute = now.getMinutes(); // Get the current minute (0-59)

    // Check if the current time is between 2 AM (2) and 3 AM (3)
    if (currentHour === 12 && currentMinute >= 0 && currentMinute <= 6) {
        console.log("The current time is between 2 AM and 3 AM.");
        return true;
    } else {
        console.log("The current time is not between 2 AM and 3 AM.");
        return false;
    }
};




  module.exports = router;