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

// Schedule the cron job to run every day at 6:00 AM 10:53 PM for Pick 10
    // cron.schedule('30 10 * * *', async () => {
    //     try {
    //     // console.log('Cron job executed:', moment().tz("America/New_York").format());
    //         await Pick10Update();

            const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
            const memberName = 'Alexandr';
            const reason = "Pick 10"
            const schedule =  moment().tz("America/New_York").format()

            await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    //     console.log('Data fetched by cron job at 6:00 AM');
    //     } catch (error) {
    //     console.error('Error fetching data:', error);
    //     }
    // });




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



  module.exports = router;