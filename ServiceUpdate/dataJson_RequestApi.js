var express = require('express');
var router = express.Router();
const { default: axios } = require("axios");

const dataJsonRequest = async () => {
   const gameSeparateByState = []

   const allState = [
    'NY', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'IA', 'ID',
    'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 
    // 'MD', 'ME', 'MI', 'MN', 'MO', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 
    // 'NM', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'VA', 'VT', 
    // 'WA', 'WI', 'WV'
]

const wait = ms => new Promise(res => setTimeout(res, ms)); // optional delay function

   for(let state = 0; state < allState.length; state++){

        const options = {
          method: 'GET',
          url: `https://lottery-results.p.rapidapi.com/games-by-state/us/${allState[state]}`,
          headers: {
            'x-rapidapi-key': '4be35f9dcbmshc5f07ead15abe9ep1399e7jsn4fb04336cc72',
            'x-rapidapi-host': 'lottery-results.p.rapidapi.com'
          }
        };

       try {
          axios.request(options)
          .then(response => {
            const allStateLoteryDataState = response.data
            const gameStateKeys = Object.keys(allStateLoteryDataState);
            const gameEntries = Object.entries(allStateLoteryDataState)
                                      .filter(([key, value]) => key !== 'status' 
                                       && value && Array.isArray(value.plays));
            const gameConstants = {}
            const enrichedDraws = [];

            Object.entries(allStateLoteryDataState)
            .filter(([key, value]) => key !== 'status' && value && value.name)
            .forEach(([_, value]) => {
            const constName = value.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '_');
            gameConstants[constName.toLowerCase()] = [];
            });


            for (const [key, game] of gameEntries) {
                const gameName = game.name;

                for (const play of (game.plays || [])){
                    const playName = play.name || game.name; 
                     
                    for (const draw of play.draws || []) {
                        enrichedDraws.push({
                          ...draw,
                          numbers: draw.numbers.map(n => n.value), // ✅ flatten numbers
                          gameName,
                          playName,
                        });
                      }
                }
            }

            for (const draw of enrichedDraws) {
                const normalizedKey = draw.gameName
                  .replace(/\s+/g, '_')
                  .replace(/[^a-zA-Z0-9_]/g, '_')
                  .toLowerCase();
              
                if (gameConstants.hasOwnProperty(normalizedKey)) {
                  gameConstants[normalizedKey].push(draw);
                } else {
                  console.warn('Unknown game:', draw.gameName);
                }
              }
              
            gameSeparateByState.push({state: `${allState[state]}`, draw : gameConstants })
          } );
      } catch (error) {
          console.error(error);
         
      }
      await wait(6000); // optional: wait 500ms to avoid rate-limiting

    }

    console.log(gameSeparateByState)
    return gameSeparateByState; 
}

router.get('/', async function (req, res, next) {
    try {
        const all_data =  await dataJsonRequest()
        // console.log(all_data)
        res.json({ data_: all_data });
    } catch (error) {
        res.send({
            status : 404,
            message : error.message
        })
    }
})

module.exports = router;

