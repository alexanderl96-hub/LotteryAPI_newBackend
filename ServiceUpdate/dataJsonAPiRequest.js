const { default: axios } = require("axios");
const { response } = require("express");

// Helper: optional delay to avoid rate limits
const wait = ms => new Promise(res => setTimeout(res, ms));

const dataJsonRequest = async () => {
    const gameSeparateByState = [];

    const allState = [
        'NY', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'IA', 'ID',
        'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MT', 
        'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 
        'RI', 'SC', 'SD', 'TN', 'TX', 'VA', 'VT', 'WA', 'WI', 'WV'
    ];

    for (let stateIndex = 0; stateIndex < allState.length; stateIndex++) {
        const state = allState[stateIndex];

        const options = {
            method: 'GET',
            url: `https://lottery-results.p.rapidapi.com/games-by-state/us/${state}`,
            headers: {
              'x-rapidapi-key': '4be35f9dcbmshc5f07ead15abe9ep1399e7jsn4fb04336cc72',
              'x-rapidapi-host': 'lottery-results.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            const allStateLotteryData = response.data;

            const gameEntries = Object.entries(allStateLotteryData)
                .filter(([key, value]) => key !== 'status' && value && Array.isArray(value.plays));

            const gameConstants = {};
            const enrichedDraws = [];

       
            Object.entries(allStateLotteryData)
                .filter(([key, value]) => key !== 'status' && value && value.name)
                .forEach(([_, value]) => {
                    const constName = value.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '_');
                    gameConstants[constName.toLowerCase()] = [];
                });

      
            for (const [key, game] of gameEntries) {
                const gameName = game.name;

                for (const play of (game.plays || [])) {
                    const playName = play.name || game.name;

                    for (const draw of play.draws || []) {
                        enrichedDraws.push({
                            ...draw,
                            numbers: draw.numbers.map(n => n.value),
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

            gameSeparateByState.push({ state, draw: gameConstants });

        } catch (error) {
            console.error(`Error fetching state ${state}:`, error.message);
        }

        await wait(6000); 
    }

    return gameSeparateByState;
};

function splitLotteryDataUnique(data_, gamesToPick) {
    const selectedGames = [];
    const seen = new Set(); // to track duplicates
    const remainingData = JSON.parse(JSON.stringify(data_)); // deep copy
  
    remainingData.forEach(stateEntry => {
      Object.keys(stateEntry.draw).forEach(gameKey => {
        const gameArray = stateEntry.draw[gameKey];
  
        // Filter games that match the ones we want
        const matched = gameArray.filter(draw => gamesToPick.includes(draw.gameName));
  
        matched.forEach(draw => {
          const uniqueKey = `${draw.gameName}`;
          if (!seen.has(uniqueKey)) {
            selectedGames.push(draw);
            seen.add(uniqueKey);
          }
        });
  
        // Remove matched games from remaining data
        const remainingGames = gameArray.filter(draw => !gamesToPick.includes(draw.gameName));
        if (remainingGames.length > 0) {
          stateEntry.draw[gameKey] = remainingGames; // keep array if anything left
        } else if (matched.length > 0) {
          // replace with string of removed game's name
          stateEntry.draw[gameKey] = matched.map(d => d.gameName).join(', ');
        }
      });
    });
  
    return { selectedGames, remainingData };
  }

const storedData = async () => {
    const todayStr = new Date().toDateString();
    const all_data = await dataJsonRequest();

    const gamesToPick = ['Powerball', 'Pick 10', 'Mega Millions', "Cashforlife",
          'Lucky For Life', 'Powerball Double Play', 'Natural State Jackpot', "Take 5",
          "2 by 2", "Luckyday Lotto", "Daily Derby", "Multi-Win Lotto", "The Pick", " Triple Twist",
          "Play4", "Play3", "DC 5", "DC 4", "DC 3", "DC 2", "Play 4", "Play 3", "Play 5", 
         "Jackpot Triple Play", 'SuperLotto Plus', 'Lotto America'];
    const { selectedGames, remainingData } = splitLotteryDataUnique(all_data, gamesToPick);

    const remain = {
        date: todayStr,
        data_: remainingData
    }

    const powerBall = selectedGames.filter(a => a.gameName === "Powerball")
    const megaMillion = selectedGames.filter(a => a.gameName === "Mega Millions")
    const lottoAmerica = selectedGames.filter(a => a.gameName === "Lotto America")
    const luckyforLife = selectedGames.filter(a => a.gameName === "Lucky For Life")
    const naturalStateJackpot = selectedGames.filter(a => a.gameName === "Natural State Jackpot")
    const powerballDoublePlay = selectedGames.filter(a => a.gameName === "Powerball Double Play")
    const superlottoPlus = selectedGames.filter(a => a.gameName === "SuperLotto Plus")


    axios.post('http://localhost:9001/remainData', remain)
    axios.post('http://localhost:9001/new-Powerball', powerBall[0]);
    axios.post('http://localhost:9001/new-MegaMillions', megaMillion[0]);
    axios.post('http://localhost:9001/new-LottoAmerica', lottoAmerica[0]);
    axios.post('http://localhost:9001/new-LuckyforLife', luckyforLife[0]);
    axios.post('http://localhost:9001/new-NaturalStateJackpot', naturalStateJackpot[0]);
    axios.post('http://localhost:9001/new-PowerballDoublePlay', powerballDoublePlay[0]);
    axios.post('http://localhost:9001/new-SuperlottoPlus', superlottoPlus[0]);
                            
}

module.exports =  storedData;