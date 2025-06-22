const { default: axios } = require("axios");


const cashForLifeUpdate = async () => {
  //     const options = {
  //       method: 'GET',
  //       url: 'https://lottery-results.p.rapidapi.com/games-by-state/us/ny',
  //       headers: {
  //           'x-rapidapi-key': '4be35f9dcbmshc5f07ead15abe9ep1399e7jsn4fb04336cc72',
  //           'x-rapidapi-host': 'lottery-results.p.rapidapi.com'
  //       }
  //   };

  //   try {
  //     axios.request(options)
  //     .then(response => {
  //       const newDataMegaMillions = response.data

  //       for(const key in newDataMegaMillions){
  //         if(key !== "status"){
  //             const data = newDataMegaMillions[key];

  //             if(data.name === "Cash4Life"){
  //             //     // Log Lotto data with more specific checks
  //                 data.plays.forEach((play, index) => {
  //                       console.log("Play: ", play)
  //                      play.draws.map(a =>  {
  //                         const numbersArray = a.numbers.map(a => Number(a.value));

  //                         let updatePick10 = {
  //                                 date: a.date,
  //                                 one: numbersArray[0],
  //                                 two: numbersArray[1],
  //                                 three: numbersArray[2],
  //                                 four: numbersArray[3],
  //                                 five: numbersArray[4],
  //                                 cashball: numbersArray[5],
  //                                 amount: 1000,
  //                                 image: 'https://www.mynylottery.org/portal/portal/static/img/game-logos/lotto.png'
  //                              };

  //                              console.log("Cash4Life: ", updatePick10)

  //                       axios.post('http://localhost:9080/cash4Life', updatePick10)
  //                            .then( response =>  console.log(response.data))
                       

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


  module.exports = cashForLifeUpdate;