const { default: axios } = require("axios");


const threeAtOnceDay = async () => {
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

                if(data.name === "Take 5"){
         
                    data.plays.forEach((play, index) => {

                        if(play.name === "Midday"){

                            play.draws.map(a =>  {
                                const numbersArray = a.numbers.map(a => Number(a.value));
    
                                let updatePick10 = {
                                        date: a.date,
                                        one: numbersArray[0],
                                        two: numbersArray[1],
                                        three: numbersArray[2],
                                        four: numbersArray[3],
                                        five: numbersArray[4],
                                        amount: 50000,
                                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6yh5J5pan_VYWX-t5-2djq9Qhiw4ZTT8qaA&s',
                                        timedate: "Midday"
                                     };
    
                                     console.log("Check the structure of Take 5: ", updatePick10)
    
                                     axios.post('http://localhost:9080/take5Day', updatePick10 )
                                          .then( response =>  console.log(response.data))
    
                             });

                        }
                         
                    });
                }

                if(data.name === "Win 4" ){
                    data.plays.forEach((play, index) => {

                       if(play.name === "Midday"){

                           play.draws.map(a =>  {
                               const numbersArray = a.numbers.map(a => Number(a.value));
   
                               let updatePick10 = {
                                       date: a.date,
                                       one: numbersArray[0],
                                       two: numbersArray[1],
                                       three: numbersArray[2],
                                       four: numbersArray[3],
                                       amount: 5000,
                                       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc5SWwSOzYVYZXzzplmtks70J5txRgXbhKxA&s',
                                       timedate: "Midday"
                                    };
   
                                    console.log("Check the structure of Win 4: ", updatePick10)
   
                                    axios.post('http://localhost:9080/win4Day', updatePick10 )
                                         .then( response =>  console.log(response.data))

   
                            });

                       }
                        
                   });
                }

                if(data.name === "Numbers" ){
                    data.plays.forEach((play, index) => {

                       if(play.name === "Midday"){

                           play.draws.map(a =>  {
                               const numbersArray = a.numbers.map(a => Number(a.value));
   
                               let updatePick10 = {
                                       date: a.date,
                                       one: numbersArray[0],
                                       two: numbersArray[1],
                                       three: numbersArray[2],
                                       amount: 500,
                                       image: 'https://nylottery.ny.gov/static/logo-numbers-068f7b366978bb7f87a7174067a9344b.png',
                                       timedate: "Midday"
                                    };
   
                                    console.log("Check the structure of Numbers: ", updatePick10)
   
                                    axios.post('http://localhost:9080/numbersday', updatePick10 )
                                         .then( response =>  console.log(response.data))
                            
   
                            });

                       }
                        
                   });
                }


            
            }
          }

    
        } );
    } catch (error) {
        console.error(error);
    }
    

}


  module.exports = threeAtOnceDay;
