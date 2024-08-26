const { default: axios } = require("axios");


const cashForLifeUpdate = async () => {
    const options = {
        method: 'GET',
        url: 'https://cash4life.p.rapidapi.com/latest',
        headers: {
          'x-rapidapi-key': '4be35f9dcbmshc5f07ead15abe9ep1399e7jsn4fb04336cc72',
          'x-rapidapi-host': 'cash4life.p.rapidapi.com'
        }
    };


    try {
        axios.request(options)
        .then(response => {
          const newDataMegaMillions = response.data.data[0]

          const newDateReady = `${newDataMegaMillions.DrawingDate.slice(5,7)}/${newDataMegaMillions.DrawingDate.slice(8, 10)}/${newDataMegaMillions.DrawingDate.slice(0,4)}`;

          let updatePick10 = {
            date: newDateReady,
            one: newDataMegaMillions.FirstNumber,
            two: newDataMegaMillions.SecondNumber,
            three: newDataMegaMillions.ThirdNumber,
            four: newDataMegaMillions.FourthNumber,
            five: newDataMegaMillions.FifthNumber,
            cashball: newDataMegaMillions.CashBall,
            amount: 1000,
            image: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Cash4Life_logo.png'
          };


            axios.post('http://localhost:9001/cash4Life', updatePick10)
                .then( response =>  console.log(response.data))
    
        } );
    } catch (error) {
        console.error(error);
    }
    

}


  module.exports = cashForLifeUpdate;