const { default: axios } = require("axios");


const powerBallUpdate = async () => {
    const options = {
        method: 'GET',
        url: 'https://powerball.p.rapidapi.com/latest',
        headers: {
          'x-rapidapi-key': '4be35f9dcbmshc5f07ead15abe9ep1399e7jsn4fb04336cc72',
          'x-rapidapi-host': 'powerball.p.rapidapi.com'
        }
    };


    try {
        axios.request(options)
        .then(response => {
          const newDataMegaMillions = response.data.data[0]
    
          const newDateReady = `${newDataMegaMillions.DrawingDate.slice(5,7)}/${newDataMegaMillions.DrawingDate.slice(8, 10)}/${newDataMegaMillions.DrawingDate.slice(0,4)}`;

          const dataConvertToArray = newDataMegaMillions.NumberSet.split(' ')
                                                                  .filter(item => !isNaN(item))
                                                                  .map(Number);
          const lastDigitConvert = newDataMegaMillions.NumberSet.split('').slice(-2)[0];
          const amount =  parseInt( newDataMegaMillions.NextJackPot.replace(/\$|,/g, ''), 10 );

          let updatePick10 = {
            date: newDateReady,
            one: dataConvertToArray[0],
            two: dataConvertToArray[1],
            three: dataConvertToArray[2],
            four: dataConvertToArray[3],
            five: dataConvertToArray[4],
            powerball_lucky: dataConvertToArray[5],
            powerplay:  Number(lastDigitConvert),
            amount: amount,
            image: 'https://www.mdlottery.com/wp-content/themes/mdlottery/images/logos/jackpot-logo-powerball.png'
          };

    
            axios.post('http://localhost:9080/powerBall', updatePick10)
                .then( response =>  console.log(response.data))
            axios.post('https://lotteryapi-newbackend2024.adaptable.app/powerBall', updatePick10)
                .then( response =>  console.log(response.data))
    
        } );
    } catch (error) {
        console.error(error);
    }
    

}



function formatDate(isoDateString) {
    // Create a new Date object from the ISO string
    const dateObject = new Date(isoDateString);
  
    // Subtract one day
    dateObject.setDate(dateObject.getDate());
  
    // Extract the month, day, and year
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(dateObject.getDate()).padStart(2, '0');
    const year = dateObject.getFullYear();
  
    // Combine them into the desired format
    return `${month}/${day}/${year}`;
  }

  module.exports = powerBallUpdate;