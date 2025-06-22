const { default: axios } = require("axios");


const powerBallUpdate = async () => {
    //   const options = {
    //     method: 'GET',
    //     url: 'https://lottery-results.p.rapidapi.com/games-by-state/us/ny',
    //     headers: {
    //         'x-rapidapi-key': '4be35f9dcbmshc5f07ead15abe9ep1399e7jsn4fb04336cc72',
    //         'x-rapidapi-host': 'lottery-results.p.rapidapi.com'
    //     }
    // };



    // const options = {
    //     method: 'GET',
    //     url: 'https://powerball.p.rapidapi.com/latest',
    //     headers: {
    //       'x-rapidapi-key': '4be35f9dcbmshc5f07ead15abe9ep1399e7jsn4fb04336cc72',
    //       'x-rapidapi-host': 'powerball.p.rapidapi.com'
    //     }
    // };


    // try {
    //     axios.request(options)
    //     .then(response => {
    //       const newDataMegaMillions = response.data.data[0]
    
    //       const newDateReady = `${newDataMegaMillions.DrawingDate.slice(5,7)}/${newDataMegaMillions.DrawingDate.slice(8, 10)}/${newDataMegaMillions.DrawingDate.slice(0,4)}`;

    //       const dataConvertToArray = newDataMegaMillions.NumberSet.split(' ')
    //                                                               .filter(item => !isNaN(item))
    //                                                               .map(Number);
    //       const lastDigitConvert = newDataMegaMillions.NumberSet.split('').slice(-2)[0];
    //       const amount =  parseInt( newDataMegaMillions.NextJackPot.replace(/\$|,/g, ''), 10 );

    //       let updatePick10 = {
    //         date: newDateReady,
    //         one: dataConvertToArray[0],
    //         two: dataConvertToArray[1],
    //         three: dataConvertToArray[2],
    //         four: dataConvertToArray[3],
    //         five: dataConvertToArray[4],
    //         powerball_lucky: dataConvertToArray[5],
    //         powerplay:  Number(lastDigitConvert),
    //         amount: amount,
    //         image: 'https://www.mdlottery.com/wp-content/themes/mdlottery/images/logos/jackpot-logo-powerball.png'
    //       };

    
    //         axios.post('http://localhost:9080/powerBall', updatePick10)
    //             .then( response =>  console.log(response.data))
    //         axios.post('https://lotteryapi-newbackend2024.adaptable.app/powerBall', updatePick10)
    //             .then( response =>  console.log(response.data))
    
    //     } );
    // } catch (error) {
    //     console.error(error);
    // }

  //   try {
  //     axios.request(options)
  //     .then(response => {
  //       const newDataMegaMillions = response.data

  //       for(const key in newDataMegaMillions){
  //         if(key !== "status"){
  //             const data = newDataMegaMillions[key];

  //             if(data.name === "Powerball"){
  //             //     // Log Lotto data with more specific checks
  //                 data.plays.forEach((play, index) => {

  //                      play.draws.map(a =>  {
  //                         const numbersArray = a.numbers.map(a => Number(a.value));

  //                         let updatePick10 = {
  //                                 date: a.date,
  //                                 one: numbersArray[0],
  //                                 two: numbersArray[1],
  //                                 three: numbersArray[2],
  //                                 four: numbersArray[3],
  //                                 five: numbersArray[4],
  //                                 powerball_lucky: numbersArray[5],
  //                                 powerplay: numbersArray[6],
  //                                 amount: a.nextDrawJackpot,
  //                                 image: 'https://www.mynylottery.org/portal/portal/static/img/game-logos/lotto.png'
  //                              };

  //                         axios.post('http://localhost:9080/powerBall', updatePick10)
  //                              .then( response =>  console.log(response.data))
                     

  //                      });
  //                 });
  //             }
  //         }
  //       }

  //     } );
  // } catch (error) {
  //     console.error(error);
  // }
  
    

}


  module.exports = powerBallUpdate;