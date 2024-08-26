const { default: axios } = require("axios");


const updatePick10API = async () => {
     
axios.get("https://data.ny.gov/resource/bycu-cw7c.json")
.then(response => {
   const newData =  response.data[0];
   const dataConvertToArray = newData.winning_numbers.split(" ")
                                                      .map(num => parseInt(num, 10));

   const newDateReady = formatDate(newData.draw_date);

   let updatePick10 = {
       date: newDateReady,
       one: dataConvertToArray[0],
       two: dataConvertToArray[1],
       three: dataConvertToArray[2],
       four: dataConvertToArray[3],
       five: dataConvertToArray[4],
       six: dataConvertToArray[5],
       seven: dataConvertToArray[6],
       eight: dataConvertToArray[7],
       nine: dataConvertToArray[8],
       ten: dataConvertToArray[9],
       eleven: dataConvertToArray[10],
       twelve: dataConvertToArray[11],
       thirteen: dataConvertToArray[12],
       fourteen: dataConvertToArray[13],
       fifteen: dataConvertToArray[14],
       sixteen: dataConvertToArray[15],
       seventeen: dataConvertToArray[16],
       eighteen: dataConvertToArray[17],
       nineteen: dataConvertToArray[18],
       twenty: dataConvertToArray[19],
       amount: 500000,
       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCfHUupp_aPxgQ-XL47tt6G5wx6OnAisilvg&s'
     };

     axios.post('http://localhost:9080/pick10', updatePick10 )
          .then( response =>  console.log(response.data))
     axios.post('https://lotteryapi-newbackend2024.adaptable.app/pick10', updatePick10)
          .then( response =>  console.log(response.data))
   
}    
);
   
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
      





module.exports = updatePick10API;