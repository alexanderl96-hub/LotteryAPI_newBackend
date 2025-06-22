const { default: axios } = require("axios");


const newYorkLottoUpdate = async () => {
    // const options = {
    //     method: 'GET',
    //     url: 'https://lottery-results.p.rapidapi.com/games-by-state/us/ny',
    //     headers: {
    //         'x-rapidapi-key': '4be35f9dcbmshc5f07ead15abe9ep1399e7jsn4fb04336cc72',
    //         'x-rapidapi-host': 'lottery-results.p.rapidapi.com'
    //     }
    // };


    // try {
    //     axios.request(options)
    //     .then(response => {
    //       const newDataMegaMillions = response.data

    //       for(const key in newDataMegaMillions){
    //         if(key !== "status"){
    //             const data = newDataMegaMillions[key];

    //             if(data.name === "Lotto"){
    //                 // Log Lotto data with more specific checks
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
    //                                 six: numbersArray[5],
    //                                 bonus: numbersArray[6],
    //                                 amount: a.nextDrawJackpot,
    //                                 image: 'https://www.mynylottery.org/portal/portal/static/img/game-logos/lotto.png'
    //                              };

    //                              axios.post('http://localhost:9080/newyorklotto', updatePick10 )
    //                                   .then( response =>  console.log(response.data))
                          

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


  module.exports = newYorkLottoUpdate;




