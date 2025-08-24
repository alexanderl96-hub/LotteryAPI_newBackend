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
                const gamesNotWanted = ["5 Star Draw", "Weekly Grand", "Racetrax", 
                                        "Kentucky 5", "5 Card Cash", "World Poker Tour",
                                        "Lucky Lines"]

                if(!gamesNotWanted.includes(gameName)) {

                    for (const play of (game.plays || [])) {
                        const playName = play.name || game.name;

                       if(!gamesNotWanted.includes(playName)) {

                            for (const draw of play.draws || []) {
                                enrichedDraws.push({
                                    ...draw,
                                    date: isoToMMDDYYYY(draw.date),
                                    nextDrawDate: isoToMMDDYYYY(draw.nextDrawDate),
                                    numbers: draw.numbers.map(n => n.value),
                                    gameName,
                                    playName,
                                });
                            }
                        }
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
    // const remainingData = JSON.parse(JSON.stringify(data_)); // deep copy
    const remainingData = JSON.parse(JSON.stringify(data_))
  
    remainingData.forEach(stateEntry => {
      Object.keys(stateEntry.draw).forEach(gameKey => {
        const gameArray = stateEntry.draw[gameKey];
  
        // Filter games that match the ones we want
        const matched = gameArray.filter(draw => gamesToPick.includes(draw.gameName));
  
        matched.forEach(draw => {
           const uniqueKey = `${draw.gameName + "_" + draw.playName}`;
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

// Returns true if a is exactly one day before b (by calendar date)
function isOneDayBefore(a, b) {
  const toUtcDateOnly = (input) => {
    if (input == null) throw new Error("Missing date");
    const s = String(input).trim();

    // MM/DD/YYYY  -> YYYY,MM,DD
    let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) {
      const [, mm, dd, yyyy] = m;
      return new Date(Date.UTC(+yyyy, +mm - 1, +dd));
    }

    // e.g., "Tue Aug 19 2025"
    m = s.match(/^[A-Za-z]{3}\s+([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})$/);
    if (m) {
      const [, monStr, dStr, yStr] = m;
      const months = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
      const mon = months[monStr];
      if (mon == null) throw new Error("Bad month: " + monStr);
      return new Date(Date.UTC(+yStr, mon, +dStr));
    }

    // Fallback: let Date parse it, then strip time to UTC date
    const d = new Date(s);
    if (!isNaN(d)) {
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    }

    throw new Error("Unparseable date: " + input);
  };

  const d1 = toUtcDateOnly(a);
  const d2 = toUtcDateOnly(b);

  const ONE_DAY = 24 * 60 * 60 * 1000;
  return (d2 - d1) === ONE_DAY;
}


function isoToMMDDYYYY(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso).trim());
  if (!m) throw new Error("Expected YYYY-MM-DD");
  const [, yyyy, mm, dd] = m;

  // Validate (rejects things like 2025-02-30)
  const d = new Date(Date.UTC(+yyyy, +mm - 1, +dd));
  if (
    d.getUTCFullYear() !== +yyyy ||
    d.getUTCMonth() !== (+mm - 1) ||
    d.getUTCDate() !== +dd
  ) {
    throw new Error("Invalid date");
  }
  return `${mm}/${dd}/${yyyy}`;
}


const storedData = async () => {
    const todayStr = new Date().toDateString();
    const all_data = await dataJsonRequest();

    const gamesToPick = [
        'Powerball', 'Mega Millions', 'Lotto America', 'Lucky For Life',  'Natural State Jackpot',
        'Powerball Double Play', 'SuperLotto Plus', "Cash4Life", 'Pick 10', "Take 5", "2 By 2", 
        "LuckyDay Lotto", "Daily Derby", "Multi-Win Lotto", "The Pick", "Triple Twist", "Play4", 
        "Play3", "DC 5", "DC 4", "DC 3", "DC 2", "Play 4", "Play 3", "Play 5", "Jackpot Triple Play", 
        "Gimme 5", "Megabucks Plus", "Win 4", "Win for Life",  "Match 6 Lotto", "Treasure Hunt", 
        "Derby Cash", "Pega 2", "Pega 3", "Pega 4", "Loto Plus", "Wild Money", "Palmetto Cash 5", 
        "Dakota Cash", "Tennessee Cash",  "Daily Tennessee", "Two Step", "Bank a Million", "Hit 5", 
        "Match 4", "Daily Game", "Badger 5", "Cash 25",  "Georgia FIVE", 
    ];
    const { selectedGames, remainingData } = splitLotteryDataUnique(all_data, gamesToPick);

    const remain = {
        date: todayStr,
        dateSelect: selectedGames,
        data_: remainingData
    }

    const powerBall = selectedGames.filter(a => a.gameName === "Powerball")
    const megaMillion = selectedGames.filter(a => a.gameName === "Mega Millions")
    const lottoAmerica = selectedGames.filter(a => a.gameName === "Lotto America")
    const luckyforLife = selectedGames.filter(a => a.gameName === "Lucky For Life")
    const naturalStateJackpot = selectedGames.filter(a => a.gameName === "Natural State Jackpot")
    const powerballDoublePlay = selectedGames.filter(a => a.gameName === "Powerball Double Play")
    const superlottoPlus = selectedGames.filter(a => a.gameName === "SuperLotto Plus")
    const cashforlife = selectedGames.filter(a => a.gameName === "Cash4Life")
    const pick10 = selectedGames.filter(a => a.gameName === "Pick 10")
    const take5 = selectedGames.filter(a => a.gameName === "Take 5")
    const twoby2 = selectedGames.filter(a => a.gameName === "2 By 2")
    const luckydayLotto = selectedGames.filter(a => a.gameName === "LuckyDay Lotto")
    const dailyDerby = selectedGames.filter(a => a.gameName === "Daily Derby")
    const multiWinLotto = selectedGames.filter(a => a.gameName === "Multi-Win Lotto")
    const thePick = selectedGames.filter(a => a.gameName === "The Pick")
    const tripleTwist = selectedGames.filter(a => a.gameName === "Triple Twist") 
    const play4 = selectedGames.filter(a => a.gameName === "Play4")
    const play3 = selectedGames.filter(a => a.gameName === "Play3")
    const dc5 = selectedGames.filter(a => a.gameName === "DC 5")
    const dc4 = selectedGames.filter(a => a.gameName === "DC 4")
    const dc3 = selectedGames.filter(a => a.gameName === "DC 3")
    const dc2 = selectedGames.filter(a => a.gameName === "DC 2")
    const play_5 = selectedGames.filter(a => a.gameName === "Play 5")
    const play_4 = selectedGames.filter(a => a.gameName === "Play 4")
    const play_3 = selectedGames.filter(a => a.gameName === "Play 3")
    const jackpotTriplePlay = selectedGames.filter(a => a.gameName === "Jackpot Triple Play")
    const gimme_5 = selectedGames.filter(a => a.gameName === "Gimme 5")
    const megabucks_Plus = selectedGames.filter(a => a.gameName === "Megabucks Plus")
    const win_4 = selectedGames.filter(a => a.gameName === "Win 4")
    const winforLife = selectedGames.filter(a => a.gameName === "Win for Life")
    const match6lotto = selectedGames.filter(a => a.gameName === "Match 6 Lotto")
    const treasure_hunt = selectedGames.filter(a => a.gameName === "Treasure Hunt")
    const derby_cash = selectedGames.filter(a => a.gameName === "Derby Cash")
    const pega_2 = selectedGames.filter(a => a.gameName === "Pega 2")
    const pega_3 = selectedGames.filter(a => a.gameName === "Pega 3")
    const pega_4 = selectedGames.filter(a => a.gameName === "Pega 4")
    const loto_Plus = selectedGames.filter(a => a.gameName === "Loto Plus")
    const wildMoney = selectedGames.filter(a => a.gameName === "Wild Money")
    const palmettoCash_5 = selectedGames.filter(a => a.gameName === "Palmetto Cash 5")
    const dakota_Cash = selectedGames.filter(a => a.gameName === "Dakota Cash")
    const tennessee_Cash = selectedGames.filter(a => a.gameName === "Tennessee Cash")
    const daily_Tennessee = selectedGames.filter(a => a.gameName === "Daily Tennessee")
    const two_Step = selectedGames.filter(a => a.gameName === "Two Step")
    const bank_a_Million = selectedGames.filter(a => a.gameName === "Bank a Million")
    const hit_5 = selectedGames.filter(a => a.gameName === "Hit 5") 
    const match_4 = selectedGames.filter(a => a.gameName === "Match 4")
    const daily_game = selectedGames.filter(a => a.gameName === "Daily Game")
    const badger_5 = selectedGames.filter(a => a.gameName === "Badger 5")
    const cash_25 = selectedGames.filter(a => a.gameName === "Cash 25")
    const georgia_five = selectedGames.filter(a => a.gameName === "Georgia FIVE")


    if(powerBall && isOneDayBefore(powerBall[0].date, todayStr)){
       axios.post('http://localhost:9001/new-Powerball', powerBall[0]);
     } else {
        console.log("Failed to post Powerball")
    }

    if(megaMillion && isOneDayBefore(megaMillion[0].date, todayStr)){
       axios.post('http://localhost:9001/new-MegaMillions', megaMillion[0]);
    } else {
        console.log("Failed to post MegaMillion");
    }

    if(lottoAmerica && isOneDayBefore(lottoAmerica[0].date, todayStr)){
       axios.post('http://localhost:9001/new-LottoAmerica', lottoAmerica[0]);
    } else{
        console.log("Failed to post LottoAmerica")
    }

     if(jackpotTriplePlay && isOneDayBefore(jackpotTriplePlay[0].date, todayStr)){
       axios.post('http://localhost:9001/new-JackpotTriplePlays', jackpotTriplePlay[0]);
    } else{
        console.log("Failed to post JackpotTriplePlay")
    }

    if(superlottoPlus && isOneDayBefore(superlottoPlus[0].date, todayStr)){
       axios.post('http://localhost:9001/new-SuperlottoPlus', superlottoPlus[0]);
    } else{
        console.log("Failed to post SuperlottoPlus")
    }

     if(powerballDoublePlay && isOneDayBefore(powerballDoublePlay[0].date, todayStr)){
       axios.post('http://localhost:9001/new-PowerballDoublePlay', powerballDoublePlay[0]);
    } else{
        console.log("Failed to post PowerballDoublePlay")
    }

    if(thePick && isOneDayBefore(thePick[0].date, todayStr)){
       axios.post('http://localhost:9001/new-ThePick', thePick[0]);
    } else{
        console.log("Failed to post ThePick")
    }

    if(megabucks_Plus && isOneDayBefore(megabucks_Plus[0].date, todayStr)){
       axios.post('http://localhost:9001/new-Megabucks_Plus', megabucks_Plus[0]);
    } else{
        console.log("Failed to post Megabucks Plus")
    }

    if(winforLife && isOneDayBefore(winforLife[0].date, todayStr)){
       axios.post('http://localhost:9001/new-Win_for_Life', winforLife[0]);
    } else{
        console.log("Failed to post win for Life")
    }

     if(loto_Plus && isOneDayBefore(loto_Plus[1].date, todayStr)){
       axios.post('http://localhost:9001/new-Loto_Plus', loto_Plus);
    } else{
        console.log("Failed to post Loto Plus")
    }

    if(dakota_Cash && isOneDayBefore(dakota_Cash[0].date, todayStr)){
       axios.post('http://localhost:9001/new-Dakota_Cash', dakota_Cash[0]);
    } else{
        console.log("Failed to post Dakota Cash")
    }

    if(tennessee_Cash && isOneDayBefore(tennessee_Cash[0].date, todayStr)){
       axios.post('http://localhost:9001/new-Tennessee_Cash', tennessee_Cash[0]);
    } else{
        console.log("Failed to post Tennessee Cash")
    }

    if(two_Step && isOneDayBefore(two_Step[0].date, todayStr)){
       axios.post('http://localhost:9001/new-Two_Step', two_Step[0]);
    } else{
        console.log("Failed to post Two_Step")
    }

    if(bank_a_Million && isOneDayBefore(bank_a_Million[0].date, todayStr)){
       axios.post('http://localhost:9001/new-Bank_a_Million', bank_a_Million[0]);
    } else{
        console.log("Failed to post Bank a Million")
    }

     if(cash_25 && isOneDayBefore(cash_25[0].date, todayStr)){
       axios.post('http://localhost:9001/new-Cash_25', cash_25[0]);
    } else{
        console.log("Failed to post Cash 25")
    }

    if(gimme_5 && isOneDayBefore(gimme_5[0].date, todayStr)){
       axios.post('http://localhost:9001/new-Gimme_Five', gimme_5[0]);
    } else{
        console.log("Failed to post gimme 5")
    }




    axios.post('http://localhost:9001/new-LuckyforLife', luckyforLife[0]);
    axios.post('http://localhost:9001/new-NaturalStateJackpot', naturalStateJackpot[0]);
    axios.post('http://localhost:9001/new-Pick10', pick10[0]);
    axios.post('http://localhost:9001/new-CashForLife', cashforlife[0]);
    axios.post('http://localhost:9001/new-DailyDerby', dailyDerby[0]);
    axios.post('http://localhost:9001/new-DC2', dc2);
    axios.post('http://localhost:9001/new-DC3', dc3);
    axios.post('http://localhost:9001/new-DC4', dc4);
    axios.post('http://localhost:9001/new-DC5', dc5);
    axios.post('http://localhost:9001/new-LuckydayLotto', luckydayLotto);
    axios.post('http://localhost:9001/new-MultiWinLotto', multiWinLotto[0]);
    axios.post('http://localhost:9001/new-Play_3', play_3);
    axios.post('http://localhost:9001/new-Play_4', play_4);
    axios.post('http://localhost:9001/new-Play_5', play_5);
    axios.post('http://localhost:9001/new-Play3', play3);
    axios.post('http://localhost:9001/new-Play4', play4);
    axios.post('http://localhost:9001/new-Take5', take5);
    axios.post('http://localhost:9001/new-TripleTwist', tripleTwist[0]);
    axios.post('http://localhost:9001/new-TwoBy2', twoby2[0]);
    axios.post('http://localhost:9001/new-Win_4', win_4);
    axios.post('http://localhost:9001/new-Derby_Cash', derby_cash[0]);
    axios.post('http://localhost:9001/new-Match_6_Lotto', match6lotto[0]);
    axios.post('http://localhost:9001/new-Treasure_Hunt', treasure_hunt[0]);
    axios.post('http://localhost:9001/new-Pega_2', pega_2);
    axios.post('http://localhost:9001/new-Pega_3', pega_3);
    axios.post('http://localhost:9001/new-Pega_4', pega_4);
    axios.post('http://localhost:9001/new-Wild_Money', wildMoney[0]);
    axios.post('http://localhost:9001/new-Palmetto_Cash_5', palmettoCash_5[0]);
    axios.post('http://localhost:9001/new-Daily_Tennessee', daily_Tennessee[0]);
    axios.post('http://localhost:9001/new-Hit_5', hit_5[0]);
    axios.post('http://localhost:9001/new-Match_4', match_4[0]);
    axios.post('http://localhost:9001/new-Daily_Game', daily_game[0]);
    axios.post('http://localhost:9001/new-Badger_5', badger_5[0]); 
    axios.post('http://localhost:9001/new-Georgia_Five', georgia_five);

    axios.post('http://localhost:9001/remainData', remain)
                            
}

module.exports =  storedData;