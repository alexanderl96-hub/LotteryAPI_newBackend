
// const express = require('express');
// var router = express.Router();
// const { default: axios } = require("axios");

// const moment = require('moment-timezone');
// const nodemailer = require('nodemailer');


// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     secure: false, // Use TLS
//     auth: {
//         user: process.env.EMAIL_USER,  // Your email address
//         pass: process.env.EMAIL_PASS   // App password
//     }
//   });


// router.get('/trigger-task-fecth', async (req, res) => {
//     try {
//         // Sequential API Calls for each game based on time conditions
//         if (checkTimePick10()) {

//             await handleGameRequest('Pick 10', 'http://localhost:9080/pick10', 'https://lotteryapi-newbackend2024.adaptable.app/pick10');
//         }

//         if (checkTimeCash4Life()) {
//             await handleGameRequest('Cash4Life', 'http://localhost:9080/cash4Life', 'https://lotteryapi-newbackend2024.adaptable.app/cash4Life');
//         }

//         // if (checkTimePowerBall() && checkDayPowerball()) {
//         //     await handleGameRequest('Powerball', 'http://localhost:9080/powerBall', 'https://lotteryapi-newbackend2024.adaptable.app/powerBall');
//         // }

//         // if (checkTimeMegaMillions() && checkDayMegaMillions()) {
//         //     await handleGameRequest('MEGA Millions', 'http://localhost:9080/megamillions', 'https://lotteryapi-newbackend2024.adaptable.app/megamillions');
//         // }

//         // if (checkTimeNewYorkLotto() && checkDayMegaNewYorkLotto()) {
//         //     await handleGameRequest('Lotto', 'http://localhost:9080/newyorklotto', 'https://lotteryapi-newbackend2024.adaptable.app/newyorklotto');
//         // }

//         // if (checkTimeComboDay()) {
//         //     await handleGameRequest('Take 5 Midday', 'http://localhost:9080/take5Day', 'https://lotteryapi-newbackend2024.adaptable.app/take5Day');
//         // }

//         // if (checkTimeComboNight()) {
//         //     await handleGameRequest('Take 5 Evening', 'http://localhost:9080/take5Night', 'https://lotteryapi-newbackend2024.adaptable.app/take5Night');
//         // }

//         res.send('All tasks completed');
//     } catch (error) {
//         console.error("Error executing task:", error.message);
//         res.status(500).send('Error executing task: ' + error.message);
//     }
// });

// // Function to handle game requests
// const handleGameRequest = async (gameName, localUrl, externalUrl) => {
//     const options = {
//         method: 'GET',
//         url: 'https://lottery-results.p.rapidapi.com/games-by-state/us/ny',
//         headers: {
//             'x-rapidapi-key': process.env.RAPID_API_KEY,
//             'x-rapidapi-host': 'lottery-results.p.rapidapi.com'
//         }
//     };

//     try {
//         const apiResponse = await axios.request(options);
//         console.log(`${gameName} API request successful:`, apiResponse.status);
        
//         const newData = apiResponse.data;
//         const gameData = processGameData(gameName, newData);

//         if (gameData) {
//             // POST to both local and external APIs
//             await postToApis(gameData, localUrl, externalUrl);
//             await sendSuccessEmail(gameName, gameData);
//         }
//     } catch (error) {
//         console.error(`Error during ${gameName} API request:`, error.message);
//         await sendFailureEmail(gameName, error.message);
//         throw error;
//     }
// };

// // Function to process game data based on game name
// const processGameData = (gameName, apiData) => {
//     // Implement logic for processing data specific to each game
//     for (const key in apiData) {
//         if (key !== "status") {
//             const data = apiData[key];

//             if (data.name === gameName) {
//                 // Assuming you use similar data structure for all games
//                 const processedData = data.plays.map(play => {
//                     return {
//                         date: play.date,
//                         numbers: play.draws.map(a => a.numbers.map(n => Number(n.value))),
//                         amount: data.nextDrawJackpot || 50000 // Example amount field
//                     };
//                 });
//                 console.log("processedData:" , processedData)
//                 return processedData;
//             }
//         }
//     }
//     return null; // If game data not found
// };

// // Function to post data to both local and external APIs
// const postToApis = async (data, localUrl, externalUrl) => {
//     try {
//         await axios.post(localUrl, data);
//         console.log('Posted to local API:', localUrl);
//         await axios.post(externalUrl, data);
//         console.log('Posted to external API:', externalUrl);
//     } catch (err) {
//         console.error(`Error posting to APIs for ${data.gameName}:`, err.message);
//     }
// };

// // Email sending functions (success and failure)
// const sendSuccessEmail = async (gameName, data) => {
//     const memberEmail = 'alexander.lrperez@gmail.com';
//     const reason = `The data retrieval for ${gameName} has been completed successfully.`;
//     const schedule = moment().tz("America/New_York").format();
//     await sendSuspensionEmail(memberEmail, 'Alexander', reason, schedule);
// };

// const sendFailureEmail = async (gameName, errorMessage) => {
//     const memberEmail = 'alexander.lrperez@gmail.com';
//     const reason = `The data retrieval for ${gameName} failed. Error: ${errorMessage}`;
//     const schedule = moment().tz("America/New_York").format();
//     await sendSuspensionEmail(memberEmail, 'Alexander', reason, schedule);
// };






// const checkTimePick10 = () => {
//     const now = moment().tz("America/New_York");
//     const currentHour = now.hour();   // Get the current hour in New York (0-23)
//     const currentMinute = now.minute(); // Get the current minute in New York (0-59)

//     // Check if the current time is between 2 AM (2) and 3 AM (3)
//     if (currentHour === 13 && currentMinute >= 50 && currentMinute < 57) {
//         console.log("The current time is between 2 AM and 3 AM.");
//         console.log(`${currentHour} : ${currentMinute} : ${currentMinute}`);
//         return true;
//     } else {
//         console.log("The pick10 current time is not between 2 AM and 3 AM.");
//         console.log(`${currentHour} : ${currentMinute} : ${currentMinute}`);
//         return false;
//     }
// };

// const checkTimeCash4Life = () => {
//     const now = moment().tz("America/New_York");
//     const currentHour = now.hour();   // Get the current hour in New York (0-23)
//     const currentMinute = now.minute(); // Get the current minute in New York (0-59)


//     // Check if the current time is between 2 AM (2) and 3 AM (3)
//     if (currentHour === 13 && currentMinute >= 50 && currentMinute < 57) {
//         console.log("The current time is between 2 AM and 3 AM.");
//         return true;
//     } else {
//         console.log("The cash4life current time is not between 2 AM and 3 AM.");
//         console.log(`${currentHour} : ${currentMinute} : ${currentMinute}`);
//         return false;
//     }
// };


// const sendSuspensionEmail = async (email, memberName, reason, schedule) => {
//     try {
//         let info = await transporter.sendMail({
//             from: '"Support Team" <alexander.lrperez@gmail.com>', // Sender address
//             to: email, // Recipient email
//             subject: 'Request Data has been made', // Subject line
//             text: `Hello ${memberName}, the request data has been made. Game name: ${reason} at ${schedule}.`, // Plain text body
//             html: `<p>Hello ${memberName},</p><p>the request data has been made. Game name:</p><p><strong>${reason}</strong></p>` // HTML body
//         });
  
//         console.log('Email sent: %s', info.messageId);
//     } catch (error) {
//         console.error('Error sending email:', error);

//     }
//   };




// module.exports = router;



// public class refactor {

//     public static void main(String[] args) throws IOException{
//         Path path = Paths.get("the paths file ");

//         processFile(path);
//     };

//     public static void processFile(Path path) {
//         try {
//                String content = new String(Files.readAllBytes(path));
               
//                if(content.contains("a package dependency import ex: import io.annotations.ApiOperation;")){
//                    content = replaceAnnotation(content);

//                    Files.write(path, content.getBytes());
//                    System.out.println("File update successfully!")
//                }else{
//                    System.out.println("File update successfully!")
//                }
    

//         } catch (IOException e) {
//             e.printStackTrace();
//         }
//     }
    
//     public static String replaceAnnotation(String content) {

//     }
// }