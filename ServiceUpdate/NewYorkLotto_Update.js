const { default: axios } = require("axios");


const newYorkLottoUpdate = async () => {
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


          console.log("newDataMegaMillions: ", newDataMegaMillions)
        //    console.log("newDataMegaMillions: ", newDataMegaMillions)

          for(const key in newDataMegaMillions){
            if(key !== "status"){
                const data = newDataMegaMillions[key];
                console.log("Data Names: ", data.name)
                console.log("Data plays: ",  data.plays)
            }
          }

        //   const newDateReady = `${newDataMegaMillions.DrawingDate.slice(5,7)}/${newDataMegaMillions.DrawingDate.slice(8, 10)}/${newDataMegaMillions.DrawingDate.slice(0,4)}`;

        //   let updatePick10 = {
        //     date: newDateReady,
        //     one: newDataMegaMillions.FirstNumber,
        //     two: newDataMegaMillions.SecondNumber,
        //     three: newDataMegaMillions.ThirdNumber,
        //     four: newDataMegaMillions.FourthNumber,
        //     five: newDataMegaMillions.FifthNumber,
        //     cashball: newDataMegaMillions.CashBall,
        //     amount: 1000,
        //     image: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Cash4Life_logo.png'
        //   };

        //   console.log("updatePick10: ", updatePick10)
    
// axios.post('http://localhost:9080/cash4Life')
//      .then( response =>  console.log(response.data))
    
        } );
    } catch (error) {
        console.error(error);
    }
    

}


  module.exports = newYorkLottoUpdate;




