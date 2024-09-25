const express = require('express');
var router = express.Router();
const { default: axios } = require("axios");

const moment = require('moment-timezone');
const cron = require('node-cron');
const nodemailer = require('nodemailer');


var updatePick10API = require('../ServiceUpdate/Pick10_Update.js');
var cashForLifeUpdate = require('../ServiceUpdate/CashForLife_Update.js');
var powerBallUpdate = require('../ServiceUpdate/PowerBall_Update.js');
var megaMillionsUpdate = require('../ServiceUpdate/MegaMillions_Update.js');
var newYorkLottoUpdate = require('../ServiceUpdate/NewYorkLotto_Update.js');
var threeAtOnceDay = require('../ServiceUpdate/threeAtOnces_Day_Update.js');
var threeAtOnceNight = require('../ServiceUpdate/threeAtOnces_Night_Update.js')

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS   // App password
    }
  });
  





// Endpoint to trigger the pick 10 or task manually
router.get('/trigger-task',  async (req, res) => {
    let daterepose = [];

    const options = {
      method: 'GET',
      url: 'https://lottery-results.p.rapidapi.com/games-by-state/us/ny',
      headers: {
          'x-rapidapi-key': '4be35f9dcbmshc5f07ead15abe9ep1399e7jsn4fb04336cc72',
          'x-rapidapi-host': 'lottery-results.p.rapidapi.com'
      }
    };
  

    try {

        if (checkTimePick10()) {


        let apiResponse;
        try {
            apiResponse = await axios.request(options);  // Use await for axios request
            console.log('API request successful:', apiResponse.status);
        } catch (error) {
            console.error("Error during the API request:", error.message);
            return res.status(500).send("API request failed: " + error.message); // Exit if API request fails
        }



        try {
            const newDataMegaMillions = apiResponse.data;

            for (const key in newDataMegaMillions) {
                if (key !== "status") {
                    const data = newDataMegaMillions[key];

                    if (data.name === "Pick 10") {
                        data.plays.forEach((play, index) => {
                            play.draws.forEach(a => {
                                const numbersArray = a.numbers.map(a => Number(a.value));

                                let updatePick10 = {
                                    date: a.date,
                                    one: numbersArray[0],
                                    two: numbersArray[1],
                                    three: numbersArray[2],
                                    four: numbersArray[3],
                                    five: numbersArray[4],
                                    six: numbersArray[5],
                                    seven: numbersArray[6],
                                    eight: numbersArray[7],
                                    nine: numbersArray[8],
                                    ten: numbersArray[9],
                                    eleven: numbersArray[10],
                                    twelve: numbersArray[11],
                                    thirteen: numbersArray[12],
                                    fourteen: numbersArray[13],
                                    fifteen: numbersArray[14],
                                    sixteen: numbersArray[15],
                                    seventeen: numbersArray[16],
                                    eighteen: numbersArray[17],
                                    nineteen: numbersArray[18],
                                    twenty: numbersArray[19],
                                    amount: 500000,
                                    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCfHUupp_aPxgQ-XL47tt6G5wx6OnAisilvg&s'
                                };

                                daterepose = updatePick10;

                                // POST the data
                                // axios.post('http://localhost:9080/pick10', updatePick10)
                                //     .then(response => console.log('Posted to localhost:', response.data))
                                //     .catch(err => console.log('Error posting to localhost:', err.message));

                                // axios.post('https://lotteryapi-newbackend2024.adaptable.app/pick10', updatePick10)
                                //     .then(response => console.log('Posted to external API:', response.data))
                                //     .catch(err => console.log('Error posting to external API:', err.message));

                                console.log(daterepose)
                            });
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Error processing API data:", error.message);
            return res.status(500).send("Error processing API data: " + error.message); // Exit if processing fails
        }

        try {
            const memberEmail = 'alexander.lrperez@gmail.com';
            const memberName = 'Alexander';
            const reason = `The data retrieval from the Pick 10 API has been completed successfully. Data: ${JSON.stringify(daterepose)}`;
            const schedule = moment().tz("America/New_York").format();

            await sendSuspensionEmail(memberEmail, memberName, reason, schedule);
            console.log('Email sent successfully');
        } catch (error) {
            console.error("Error sending email:", error.message);
            return res.status(500).send("Error sending email: " + error.message); // Exit if email fails
        }

    }
        
        // if (checkTimePick10()) {
            // try {
            //    console.log("innnnnn")

            //    await axios.request(options)
            //     .then(response => {
            //       const newDataMegaMillions = response.data
              
            //       for(const key in newDataMegaMillions){
            //         if(key !== "status"){
            //             const data = newDataMegaMillions[key];
              
            //             if(data.name === "Pick 10"){
            //                 // Log Lotto data with more specific checks
            //                 data.plays.forEach((play, index) => {
            //                       console.log("Play inside: ", play)
            //                      play.draws.map(a =>  {
            //                         console.log("numbers",a.numbers)
            //                         const numbersArray = a.numbers.map(a => Number(a.value));
              
            //                         let updatePick10 = {
            //                                 date: a.date,
            //                                 one: numbersArray[0],
            //                                 two: numbersArray[1],
            //                                 three: numbersArray[2],
            //                                 four: numbersArray[3],
            //                                 five: numbersArray[4],
            //                                 six: numbersArray[5],
            //                                 seven: numbersArray[6],
            //                                 eight: numbersArray[7],
            //                                 nine: numbersArray[8],
            //                                 ten: numbersArray[9],
            //                                 eleven: numbersArray[10],
            //                                 twelve: numbersArray[11],
            //                                 thirteen: numbersArray[12],
            //                                 fourteen: numbersArray[13],
            //                                 fifteen: numbersArray[14],
            //                                 sixteen: numbersArray[15],
            //                                 seventeen: numbersArray[16],
            //                                 eighteen: numbersArray[17],
            //                                 nineteen: numbersArray[18],
            //                                 twenty: numbersArray[19],   
            //                                 amount: 500000,
            //                                 image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCfHUupp_aPxgQ-XL47tt6G5wx6OnAisilvg&s'
            //                              };
            //                              daterepose = updatePick10;
              
            //                 //   axios.post('http://localhost:9080/pick10', updatePick10 )
            //                 //         .then( response =>  console.log(response.data))
            //                 //   axios.post('https://lotteryapi-newbackend2024.adaptable.app/pick10', updatePick10)
            //                 //         .then( response =>  console.log(response.data))
            //                                 });



            //                 const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
            //                 const memberName = 'Alexander';
            //                 const reason = `error first.
            //                                 Data: ${numbersArray}
            //                                 `
            //                                 // const reason = `The data retrieval from the Pick 10 API has been completed 
            //                                 // successfully. All relevant information has been fetched, 
            //                                 // and the process concluded without any issues.
            //                                 // Data: ${numbersArray}
            //                                 // `
            //                 const schedule =  moment().tz("America/New_York").format()

            //                 //  await sendSuspensionEmail(memberEmail, memberName, reason, schedule);        
              
                                            
            //                 });
            //             }
            //         }
            //       }
              
            //     } );
              
            //     const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
            //     const memberName = 'Alexander';
            //     const reason = `eeror.
            //                     Data: ${daterepose}
            //                     `
            //                     // const reason = `The data retrieval from the Pick 10 API has been completed 
            //                     // successfully. All relevant information has been fetched, 
            //                     // and the process concluded without any issues.
            //                     // Data: ${daterepose}
            //                     // `
            //     const schedule =  moment().tz("America/New_York").format()
              
            //     await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
            //   } catch (error) {
            //     console.error("Error in updatePick10API:", error.message);
            //     console.error("Stack trace:", error.stack);
              
            //     const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
            //     const memberName = 'Alexander';
            //     const reason = `errror last : ${error.message}
                              
            //                     `
            //     const schedule =  moment().tz("America/New_York").format()
              
            //     await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
              
            //     throw error; 
              
            //   }

            
        // }



//     if(checkTimeCash4Life()){
//         await cashForLifeUpdate();

//         const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
//         const memberName = 'Alexander';
//         const reason = `The data retrieval from the Cash4life API has been completed 
//                         successfully. All relevant information has been fetched, 
//                         and the process concluded without any issues.`
//         const schedule =  moment().tz("America/New_York").format()

//         await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
//     }



//     if(checkTimePowerBall()){

//         if(checkDayPowerball()){
//             await powerBallUpdate();

//             const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
//             const memberName = 'Alexander';
//             const reason = `The data retrieval from the Powerball API has been completed 
//                     successfully. All relevant information has been fetched, 
//                     and the process concluded without any issues.`
//             const schedule =  moment().tz("America/New_York").format()

//             await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 

//         }
//     }



//     if(checkTimeMegaMillions()){
//         if(checkDayMegaMillions() ){
//             await megaMillionsUpdate();
    
//             const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
//             const memberName = 'Alexander';
//             const reason =`The data retrieval from the Mega Millions API has been completed 
//                         successfully. All relevant information has been fetched, 
//                         and the process concluded without any issues.`
//             const schedule =  moment().tz("America/New_York").format()
    
//             await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    
//         }
    
//     }



//     if(checkTimeNewYorkLotto()){
//         if(checkDayMegaNewYorkLotto()){
//             await newYorkLottoUpdate();
    
//             const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
//             const memberName = 'Alexander';
//             const reason = `The data retrieval from the New York Lotto API has been completed 
//                         successfully. All relevant information has been fetched, 
//                         and the process concluded without any issues.`
//             const schedule =  moment().tz("America/New_York").format()
    
//             await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    
//         }
//     }


//     if(checkTimeComboDay()){
//         await threeAtOnceDay();

//         const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
//         const memberName = 'Alexander';
//         const reason = `The data retrieval from the Take5, Win 4 an Numbers Midday API has been completed 
//                        successfully. All relevant information has been fetched, 
//                        and the process concluded without any issues.`
//         const schedule =  moment().tz("America/New_York").format()

//         await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 

//    }



//    if(checkTimeComboNight()){
//         await threeAtOnceNight();

//         const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
//         const memberName = 'Alexander';
//         const reason = `The data retrieval from the Take5, Win 4 an Numbers NIght API has been completed 
//                         successfully. All relevant information has been fetched, 
//                         and the process concluded without any issues.`
//         const schedule =  moment().tz("America/New_York").format()

//         await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
    
//     }



             res.send('Task has been executed');

        } catch (error) {
            console.error("Error executing task:", error);
            // res.status(500).send("An error occurred while executing the task."); 

            // const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
            // const memberName = 'Alexander';
            // const reason = `An error occurred while executing the task: ${error.message}.`
            // const schedule =  moment().tz("America/New_York").format()

            // await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
        }
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




// const checkDayPowerball = () => {
//     const today = new Date();
//     const currentDay = today.getDay(); // Get the current day of the week (0-6)

//     // Check if today is Tuesday (2), Thursday (4), or Sunday (0)
//     if (currentDay === 0 || currentDay === 2 || currentDay === 4) {
//         console.log("Today is either Tuesday, Thursday, or Sunday.");
//         return true;
//     } else {
//         console.log("Today is not Tuesday, Thursday, or Sunday.");
//         return false;
//     }
// };
// const checkTimePowerBall = () => {
//     const now = moment().tz("America/New_York");
//     const currentHour = now.hour();   // Get the current hour in New York (0-23)
//     const currentMinute = now.minute(); // Get the current minute in New York (0-59)


//     // Check if the current time is between 2 AM (2) and 3 AM (3)
//     if (currentHour === 2 && currentMinute >= 10 && currentMinute < 15) {
//         console.log("The current time is between 2 AM and 3 AM.");
//         return true;
//     } else {
//         console.log("The current time is not between 2 AM and 3 AM.");
//         return false;
//     }
// };


// const checkDayMegaMillions = () => {
//     const today = new Date();
//     const currentDay = today.getDay(); // Get the current day of the week (0-6)

//     // Check if today is Wednesday (3), Saturday (6)
//     if (currentDay === 3 || currentDay === 6 ) {
//         console.log("Today is either Tuesday, Thursday, or Sunday.");
//         return true;
//     } else {
//         console.log("Today is not Tuesday, Thursday, or Sunday.");
//         return false;
//     }
// };
// const checkTimeMegaMillions = () => {
//     const now = moment().tz("America/New_York");
//     const currentHour = now.hour();   // Get the current hour in New York (0-23)
//     const currentMinute = now.minute(); // Get the current minute in New York (0-59)


//     // Check if the current time is between 2 AM (2) and 3 AM (3)
//     if (currentHour === 2 && currentMinute >= 15 && currentMinute < 20) {
//         console.log("The current time is between 2 AM and 3 AM.");
//         return true;
//     } else {
//         console.log("The current time is not between 2 AM and 3 AM.");
//         return false;
//     }
// };


// const checkDayMegaNewYorkLotto = () => {
//     const today = new Date();
//     const currentDay = today.getDay(); // Get the current day of the week (0-6)

//     // Check if today is Thursday (4), Sunday (0)
//     if (currentDay === 4 || currentDay === 0 ) {
//         console.log("Today is either Tuesday, Thursday, or Sunday.");
//         return true;
//     } else {
//         console.log("Today is not Tuesday, Thursday, or Sunday.");
//         return false;
//     }
// };
// const checkTimeNewYorkLotto = () => {
//     const now = moment().tz("America/New_York");
//     const currentHour = now.hour();   // Get the current hour in New York (0-23)
//     const currentMinute = now.minute(); // Get the current minute in New York (0-59)


//     // Check if the current time is between 2 AM (2) and 3 AM (3)
//     if (currentHour === 2 && currentMinute >= 20 && currentMinute < 25) {
//         console.log("The current time is between 2 AM and 3 AM.");
//         return true;
//     } else {
//         console.log("The current time is not between 2 AM and 3 AM.");
//         return false;
//     }
// };



const checkTimePick10 = () => {
    const now = moment().tz("America/New_York");
    const currentHour = now.hour();   // Get the current hour in New York (0-23)
    const currentMinute = now.minute(); // Get the current minute in New York (0-59)

    // Check if the current time is between 2 AM (2) and 3 AM (3)
    if (currentHour === 18 && currentMinute >= 55 && currentMinute < 60) {
        console.log("The current time is between 2 AM and 3 AM.");
        return true;
    } else {
        console.log("The current time is not between 2 AM and 3 AM.");
        return false;
    }
};

// const checkTimeCash4Life = () => {
//     const now = moment().tz("America/New_York");
//     const currentHour = now.hour();   // Get the current hour in New York (0-23)
//     const currentMinute = now.minute(); // Get the current minute in New York (0-59)


//     // Check if the current time is between 2 AM (2) and 3 AM (3)
//     if (currentHour === 2 && currentMinute >= 5 && currentMinute < 10) {
//         console.log("The current time is between 2 AM and 3 AM.");
//         return true;
//     } else {
//         console.log("The current time is not between 2 AM and 3 AM.");
//         return false;
//     }
// };

// const checkTimeComboDay = () => {
//     const now = moment().tz("America/New_York");
//     const currentHour = now.hour();   // Get the current hour in New York (0-23)
//     const currentMinute = now.minute(); // Get the current minute in New York (0-59)

//     // Check if the current time is between 2 AM (2) and 3 AM (3)
//     if (currentHour === 2 && currentMinute >= 25 && currentMinute < 30) {
//         console.log("The current time is between 2 AM and 3 AM.");
//         return true;
//     } else {
//         console.log("The current time is not between 2 AM and 3 AM.");
//         return false;
//     }
// };

// const checkTimeComboNight = () => {
//     const now = moment().tz("America/New_York");
//     const currentHour = now.hour();   // Get the current hour in New York (0-23)
//     const currentMinute = now.minute(); // Get the current minute in New York (0-59)


//     // Check if the current time is between 2 AM (2) and 3 AM (3)
//     if (currentHour === 2 && currentMinute >= 30 && currentMinute < 35) {
//         console.log("The current time is between 2 AM and 3 AM.");
//         return true;
//     } else {
//         console.log("The current time is not between 2 AM and 3 AM.");
//         return false;
//     }
// };




  module.exports = router;