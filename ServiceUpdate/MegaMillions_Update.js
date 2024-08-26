const { default: axios } = require("axios");


const megaMillionsUpdate = async () => {
    const options = {
        method: 'GET',
        url: 'https://mega-millions.p.rapidapi.com/latest',
        headers: {
          'x-rapidapi-key': '4be35f9dcbmshc5f07ead15abe9ep1399e7jsn4fb04336cc72',
          'x-rapidapi-host': 'mega-millions.p.rapidapi.com'
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
            mega_millions_lucky: dataConvertToArray[5],
            megaplier:  Number(lastDigitConvert),
            amount: amount,
            image: 'https://upload.wikimedia.org/wikipedia/en/a/a0/Mega_Millions_Lottery_logo.svg'
          };

                
            axios.post('http://localhost:9001/megamillions', updatePick10)
                .then( response =>  console.log(response.data))
    
        } );
    } catch (error) {
        console.error(error);
    }
    

}



  module.exports = megaMillionsUpdate;