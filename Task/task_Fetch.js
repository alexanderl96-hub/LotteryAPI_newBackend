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



// Endpoint to trigger the pick 10 or task manually
router.get('/trigger-task',  async (req, res) => {
    
    if (checkTimePick10()) {
        console.log("Running the task since the time is between 2 AM and 3 AM.");
        await Pick10Update();

        const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
        const memberName = 'Alexander';
        const reason = `The data retrieval from the Pick 10 API has been completed 
                        successfully. All relevant information has been fetched, 
                        and the process concluded without any issues.`
        const schedule =  moment().tz("America/New_York").format()
    
        await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    }
    // else {
    //     const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
    //     const memberName = 'Alexander';
    //     const reason = `Today's request to the Pick 10 API has already been processed. As the 
    //                    request for this data has been made successfully, no further requests 
    //                    are needed for today.`
    //     const schedule =  moment().tz("America/New_York").format()

    //     await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 

    // }

    res.send('Task has been executed');
});

// Endpoint to trigger the Cash4life or task manually
router.get('/trigger-task',  async (req, res) => {

    if(checkTimeCash4Life()){
        // await cashForLifeUpdate();

        const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
        const memberName = 'Alexander';
        const reason = `The data retrieval from the Cash4life API has been completed 
                        successfully. All relevant information has been fetched, 
                        and the process concluded without any issues.`
        const schedule =  moment().tz("America/New_York").format()

        await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    }
    // else {
    //     const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
    //     const memberName = 'Alexander';
    //     const reason =  `Today's request to the Cash4life API has already been processed. As the 
    //     request for this data has been made successfully, no further requests 
    //     are needed for today.`
    //     const schedule =  moment().tz("America/New_York").format()

    //     await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 

    // }
    
    res.send('Task has been executed');
});


// Endpoint to trigger the Powerball or task manually
router.get('/trigger-task',  async (req, res) => {


    if(checkTimePowerBall()){

            if(checkDayPowerball()){
                // await powerBallUpdate();

                const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
                const memberName = 'Alexander';
                const reason = `The data retrieval from the Powerball API has been completed 
                        successfully. All relevant information has been fetched, 
                        and the process concluded without any issues.`
                const schedule =  moment().tz("America/New_York").format()

                await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 

            }
            // else{

            //     const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
            //     const memberName = 'Alexander';
            //     const reason =   `Today's request to the Powerball API has already been processed. As the 
            //     request for this data has been made successfully, no further requests 
            //     are needed for today.`
            //     const schedule =  moment().tz("America/New_York").format()

            //     await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 

            // }
        }

    res.send('Task has been executed');
});


// Endpoint to trigger the Mega Millions or task manually
router.get('/trigger-task',  async (req, res) => {

    if(checkTimeMegaMillions()){
        if(checkDayMegaMillions() ){
            // await megaMillionsUpdate();;
    
            const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
            const memberName = 'Alexander';
            const reason =`The data retrieval from the Mega Millions API has been completed 
                        successfully. All relevant information has been fetched, 
                        and the process concluded without any issues.`
            const schedule =  moment().tz("America/New_York").format()
    
            await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    
        }
        // else{

        //     const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
        //     const memberName = 'Alexander';
        //     const reason =   `Today's request to the Mega millions API has already been processed. As the 
        //     request for this data has been made successfully, no further requests 
        //     are needed for today.`
        //     const schedule =  moment().tz("America/New_York").format()
    
        //     await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    
        // }
    
    }

  
    res.send('Task has been executed');
});


// Endpoint to trigger the new york lotto or task manually
router.get('/trigger-task',  async (req, res) => {

    if(checkTimeNewYorkLotto()){
        if(checkDayMegaNewYorkLotto()){
            // await newYorkLottoUpdate();
    
            const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
            const memberName = 'Alexander';
            const reason = `The data retrieval from the New York Lotto API has been completed 
                        successfully. All relevant information has been fetched, 
                        and the process concluded without any issues.`
            const schedule =  moment().tz("America/New_York").format()
    
            await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    
        }
        // else{
        //     const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
        //     const memberName = 'Alexander';
        //     const reason = `Today's request to the New York Lotto API has already been processed. As the 
        //     request for this data has been made successfully, no further requests 
        //     are needed for today.`
        //     const schedule =  moment().tz("America/New_York").format()
    
        //     await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    
        // }
    }

    res.send('Task has been executed');
});


// Endpoint to trigger the Take5, Win4, numbers at midday
router.get('/trigger-task',  async (req, res) => {

    if(checkTimeComboDay()){
         // await threeAtOnceDay();

         const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
         const memberName = 'Alexander';
         const reason = `The data retrieval from the Take5, Win 4 an Numbers Midday API has been completed 
                        successfully. All relevant information has been fetched, 
                        and the process concluded without any issues.`
         const schedule =  moment().tz("America/New_York").format()
 
         await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
 
    }
    // else {
    //     const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
    //     const memberName = 'Alexander';
    //     const reason = `Today's request to the Take5, Win 4 and Numbers Midday API has already been processed. As the 
    //     request for this data has been made successfully, no further requests 
    //     are needed for today.`
    //     const schedule =  moment().tz("America/New_York").format()

    //     await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 

    // }

    res.send('Task has been executed');
});

// Endpoint to trigger the Take5, Win4, numbers at night
router.get('/trigger-task',  async (req, res) => {

    if(checkTimeComboNight()){
        // await threeAtOnceNight();

        const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
        const memberName = 'Alexander';
        const reason = `The data retrieval from the Take5, Win 4 an Numbers NIght API has been completed 
                        successfully. All relevant information has been fetched, 
                        and the process concluded without any issues.`
        const schedule =  moment().tz("America/New_York").format()

        await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
       
    }
    // else {
    //     const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
    //     const memberName = 'Alexander';
    //     const reason = `Today's request to the Take5, Win 4 and Numbers Night API has already been processed. As the 
    //     request for this data has been made successfully, no further requests 
    //     are needed for today.`
    //     const schedule =  moment().tz("America/New_York").format()

    //     await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 

    // }

    res.send('Task has been executed');
});







const sendSuspensionEmail = async (email, memberName, reason, schedule) => {
    try {
        let info = await transporter.sendMail({
            from: '"Support Team" <alexander.lrperez@gmail.com>', // Sender address
            to: email, // Recipient email
            subject: 'Request Data has been made', // Subject line
            text: `Hello ${memberName}, the request data has been made. Game name: ${reason} at ${schedule}.`, // Plain text body
            html: `<p>Hello ${memberName},</p><p>the request data has been made. Game name:</p><p><strong>${reason}</strong></p>` // HTML body
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
const checkTimePowerBall = () => {
    const now = moment().tz("America/New_York");
    const currentHour = now.hour();   // Get the current hour in New York (0-23)
    const currentMinute = now.minute(); // Get the current minute in New York (0-59)


    // Check if the current time is between 2 AM (2) and 3 AM (3)
    if (currentHour === 1 && currentMinute >= 10 && currentMinute <= 15) {
        console.log("The current time is between 2 AM and 3 AM.");
        return true;
    } else {
        console.log("The current time is not between 2 AM and 3 AM.");
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
const checkTimeMegaMillions = () => {
    const now = moment().tz("America/New_York");
    const currentHour = now.hour();   // Get the current hour in New York (0-23)
    const currentMinute = now.minute(); // Get the current minute in New York (0-59)


    // Check if the current time is between 2 AM (2) and 3 AM (3)
    if (currentHour === 1 && currentMinute >= 15 && currentMinute <= 20) {
        console.log("The current time is between 2 AM and 3 AM.");
        return true;
    } else {
        console.log("The current time is not between 2 AM and 3 AM.");
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
const checkTimeNewYorkLotto = () => {
    const now = moment().tz("America/New_York");
    const currentHour = now.hour();   // Get the current hour in New York (0-23)
    const currentMinute = now.minute(); // Get the current minute in New York (0-59)


    // Check if the current time is between 2 AM (2) and 3 AM (3)
    if (currentHour === 1 && currentMinute >= 20 && currentMinute <= 25) {
        console.log("The current time is between 2 AM and 3 AM.");
        return true;
    } else {
        console.log("The current time is not between 2 AM and 3 AM.");
        return false;
    }
};



const checkTimePick10 = () => {
    const now = moment().tz("America/New_York");
    const currentHour = now.hour();   // Get the current hour in New York (0-23)
    const currentMinute = now.minute(); // Get the current minute in New York (0-59)

    // Check if the current time is between 2 AM (2) and 3 AM (3)
    if (currentHour === 1 && currentMinute >= 0 && currentMinute <= 5) {
        console.log("The current time is between 2 AM and 3 AM.");
        return true;
    } else {
        console.log("The current time is not between 2 AM and 3 AM.");
        return false;
    }
};

const checkTimeCash4Life = () => {
    const now = moment().tz("America/New_York");
    const currentHour = now.hour();   // Get the current hour in New York (0-23)
    const currentMinute = now.minute(); // Get the current minute in New York (0-59)


    // Check if the current time is between 2 AM (2) and 3 AM (3)
    if (currentHour === 1 && currentMinute >= 5 && currentMinute <= 10) {
        console.log("The current time is between 2 AM and 3 AM.");
        return true;
    } else {
        console.log("The current time is not between 2 AM and 3 AM.");
        return false;
    }
};

const checkTimeComboDay = () => {
    const now = moment().tz("America/New_York");
    const currentHour = now.hour();   // Get the current hour in New York (0-23)
    const currentMinute = now.minute(); // Get the current minute in New York (0-59)

    // Check if the current time is between 2 AM (2) and 3 AM (3)
    if (currentHour === 1 && currentMinute >= 25 && currentMinute <= 30) {
        console.log("The current time is between 2 AM and 3 AM.");
        return true;
    } else {
        console.log("The current time is not between 2 AM and 3 AM.");
        return false;
    }
};

const checkTimeComboNight = () => {
    const now = moment().tz("America/New_York");
    const currentHour = now.hour();   // Get the current hour in New York (0-23)
    const currentMinute = now.minute(); // Get the current minute in New York (0-59)


    // Check if the current time is between 2 AM (2) and 3 AM (3)
    if (currentHour === 1 && currentMinute >= 30 && currentMinute <= 35) {
        console.log("The current time is between 2 AM and 3 AM.");
        return true;
    } else {
        console.log("The current time is not between 2 AM and 3 AM.");
        return false;
    }
};




  module.exports = router;