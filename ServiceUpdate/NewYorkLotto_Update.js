// const { default: axios } = require("axios");


// const newYorkLottoUpdate = async () => {
//     const options = {
//         method: 'GET',
//         url: 'https://new-york-lottery.p.rapidapi.com/get_draw_results',
//         headers: {
//         'x-rapidapi-key': '4be35f9dcbmshc5f07ead15abe9ep1399e7jsn4fb04336cc72',
//         'x-rapidapi-host': 'new-york-lottery.p.rapidapi.com'
//         }
//     };


//     try {
//         axios.request(options)
//         .then(response => {
//           const newDataMegaMillions = response.data.data[0]


//           console.log("newDataMegaMillions: ", newDataMegaMillions)

//         //   const newDateReady = `${newDataMegaMillions.DrawingDate.slice(5,7)}/${newDataMegaMillions.DrawingDate.slice(8, 10)}/${newDataMegaMillions.DrawingDate.slice(0,4)}`;

//         //   let updatePick10 = {
//         //     date: newDateReady,
//         //     one: newDataMegaMillions.FirstNumber,
//         //     two: newDataMegaMillions.SecondNumber,
//         //     three: newDataMegaMillions.ThirdNumber,
//         //     four: newDataMegaMillions.FourthNumber,
//         //     five: newDataMegaMillions.FifthNumber,
//         //     cashball: newDataMegaMillions.CashBall,
//         //     amount: 1000,
//         //     image: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Cash4Life_logo.png'
//         //   };

//         //   console.log("updatePick10: ", updatePick10)
    
// // axios.post('http://localhost:9080/cash4Life')
// //      .then( response =>  console.log(response.data))
    
//         } );
//     } catch (error) {
//         console.error(error);
//     }
    

// }


//   module.exports = newYorkLottoUpdate;