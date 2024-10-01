const { default: axios } = require("axios");
const moment = require('moment-timezone');
const cron = require('node-cron');
const nodemailer = require('nodemailer');


const updatePick10API = async () => {
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

  axios.request(options)
  .then(response => {
    const newDataMegaMillions = response.data

    for(const key in newDataMegaMillions){
      if(key !== "status"){
          const data = newDataMegaMillions[key];

          if(data.name === "Pick 10"){
              // Log Lotto data with more specific checks
              data.plays.forEach((play, index) => {
                    console.log("Play inside: ", play)
                   play.draws.map(a =>  {
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

                axios.post('http://localhost:9080/pick10', updatePick10 )
                      .then( response =>  console.log(response.data))
       
                              });

                              
              });
          }
      }
    }

  } );

  const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
  const memberName = 'Alexander';
  const reason = `The data retrieval from the Pick 10 API has been completed 
                  successfully. All relevant information has been fetched, 
                  and the process concluded without any issues.
                  Data: ${data}
                  `
  const schedule =  moment().tz("America/New_York").format()

  await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 
} catch (error) {
  console.error("Error in updatePick10API:", error.message);
  console.error("Stack trace:", error.stack);

  const memberEmail = 'alexander.lrperez@gmail.com'; // Get member's email from your database
  const memberName = 'Alexander';
  const reason = `The data retrieval from the Pick 10 API has not been completed 
                  successfully. All relevant information has been fetched, 
                  and the process concluded wit any issues : ${error.message}
                
                  `
  const schedule =  moment().tz("America/New_York").format()

  await sendSuspensionEmail(memberEmail, memberName, reason, schedule); 


  throw error; 

}

}



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



module.exports = updatePick10API;