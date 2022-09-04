
const axios = require('axios');
//date helper functions
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    /* Format a date to YYYY-MM-DD (or any other format)
    *examples
    // 2022-01-18 (yyyy-mm-dd)
    // console.log(formatDate(new Date()));
    // 2025-05-09 (yyyy-mm-dd)
    // console.log(formatDate(new Date(2025, 4, 9)));
*/

    date.setHours(0, 0, 0, 0);

    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}



function getPreviousDay(date) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);

    return formatDate(previous);
}

// console.log(getPreviousDay(new Date())); // 👉️ yesterday

// // Fri Dec 23 2022
// console.log(getPreviousDay(new Date('2022-12-24')));

//   // Sat Dec 31 2022
//   console.log(getPreviousDay(new Date('2023-01-01')).getDate());

async function check_previous_day(date, word) {

    try {
        let previous = getPreviousDay(new Date(date));
        const response = await axios.get("https://www.hebcal.com/converter?cfg=json&date=" + previous + "&g2h=1&strict=1");

        //console.log("inside");


        response.data.events.forEach(element => {

            if (!element.includes('Parashat'))
            { //console.log(element)
                if (element.includes(word)) 
                {/*console.log("word1");*/ return true; }
            }
        });

        //console.log("false-previoes  " + word)
        return false;
    }
    catch (err) { console.log(err); }

}



async function isJewishIsraelyHolyday(date) {
    const response= await axios.get("https://www.hebcal.com/converter?cfg=json&date=" + date + "&g2h=1&strict=1")
       
            console.log(date + ": " + response.data.events)
            /**
             * for each event which isn't "Parashat", if the first word appear the previes day/ or the previes day has "erev" it's an holyday.
             * */
            await response.data.events.forEach(async element => {
                if ((!element.includes('Parashat')) && (!element.includes('Chodesh'))) {
                    let first = element.split(' ')[0]

                    if (element.includes("Erev")) {
                        console.log(element + " " + date + " true")
                        // console.log
                        return true;
                    }
                    if (await check_previous_day(date, first))//check if yestorday is erev chag, or another day of the same chag 
                    {
                         console.log("True- first: " + element + " " + first)
                        return true;
                    }
                    if (await check_previous_day(date, "Erev")) {

                         console.log("True- erev: " + element + " " + first)
                        return true;

                    }


                }

            });
            console.log("--false")
            return false;

        })
        .catch((err) => console.log(err));

}
// /**2022-08-27: Rosh Chodesh Elul,Parashat Re'eh
// 2022-08-06: Shabbat Chazon,Erev Tish'a B'Av,Parashat Devarim
// 2022-09-25: Erev Rosh Hashana,Parashat Vayeilech
// 2022-08-07: Tish'a B'Av (observed),Parashat Vaetchanan
// 2022-09-26: Rosh Hashana 5783,Parashat Vayeilech
// 2022-04-20: Pesach V (CH''M),Parashat Pesach,4th day of the Omer
// 2022-09-27: Rosh Hashana II,Parashat Vayeilech
// 2022-09-28: Tzom Gedaliah,Parashat Vayeilech
// 2022-07-16: Parashat Balak
// 2022-07-17: Tzom Tammuz,Parashat Pinchas
// 2022-06-04: Erev Shavuot,Parashat Bamidbar,49th day of the Omer
// 2022-06-05: Shavuot I,Parashat Nasso
// 2022-04-16: Pesach I
// 2022-04-18: Pesach III (CH''M),Parashat Pesach,2nd day of the Omer
// 2022-04-15: Ta'anit Bechorot,Erev Pesach,Parashat Pesach
// 2022-04-17: Pesach II,Parashat Pesach,1st day of the Omer */
console.log(isJewishIsraelyHolyday("2022-08-06"))//ראש חודש
//console.log(isJewishIsraelyHolyday("2022-08-27"))//ראש חודש

// isJewishIsraelyHolyday("2022-08-06")//ערב תשעה באב
// isJewishIsraelyHolyday("2022-08-07")//רתשעה באב
// isJewishIsraelyHolyday("2022-09-25")//ערב ראש השנה
// isJewishIsraelyHolyday("2022-09-26")//ראש השנה 1
// isJewishIsraelyHolyday("2022-09-27")//ראש השנה 2
// isJewishIsraelyHolyday("2022-09-28")//גדליה
// isJewishIsraelyHolyday("2022-07-16")//ערב יז בתמוז
// isJewishIsraelyHolyday("2022-07-17")//יז בתמוז

// isJewishIsraelyHolyday("2022-06-04")//שבועות ערב
// isJewishIsraelyHolyday("2022-06-05")//שבועות
// isJewishIsraelyHolyday("2022-04-15")//פסח
// isJewishIsraelyHolyday("2022-04-16")//פסח
// isJewishIsraelyHolyday("2022-04-17")//פסח
// isJewishIsraelyHolyday("2022-04-18")//פסח
// isJewishIsraelyHolyday("2022-04-19")//פסח
// isJewishIsraelyHolyday("2022-04-20")//פסח
// isJewishIsraelyHolyday("2022-04-21")//פסח    