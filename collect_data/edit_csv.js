/*YEAR,MONTH,DAY,DAY_OF_WEEK,AIRLINE,FLIGHT_NUMBER,ORIGIN_AIRPORT,
DESTINATION_AIRPORT,SCHEDULED_DEPARTURE,DEPARTURE_TIME,DEPARTURE_DELAY,
TAXI_OUT,WHEELS_OFF,SCHEDULED_TIME,ELAPSED_TIME,AIR_TIME,DISTANCE,
WHEELS_ON,TAXI_IN,SCHEDULED_ARRIVAL,ARRIVAL_TIME,ARRIVAL_DELAY,DELAY_TYPE,DISTANCE_TYPE
*/
const weather_api_API_KEY="ca4ab3174e3340468f1192548220409"
function padTo2Digits(num) {
    //date helper functions
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


        for (const element of response.data.events) {

            if (!element.includes('Parashat')) { //console.log(element)
                if (element.includes(word)) {/*console.log("word1");*/ return true; }
            }
        }

        //console.log("false-previoes  " + word)
        return false;
    }
    catch (err) { console.log(err); }

}



async function isJewishIsraelyHolyday(date) {
    try {
        const response = await axios.get("https://www.hebcal.com/converter?cfg=json&date=" + date + "&g2h=1&strict=1")

        //console.log(date + ": " + response.data.events);
        /**
         * for each event which isn't "Parashat", if the first word appear the previes day/ or the previes day has "erev" it's an holyday.
         * */
        for (const element of response.data.events) {
                          
            if ((!element.includes('Parashat')) && (!element.includes('Chodesh'))) {
                let first = element.split(' ')[0]

                if (element.includes("Erev")) {
                   // console.log(element + " " + date + " true")
                    return true;
                }
                if (await check_previous_day(date, first))//check if yestorday is erev chag, or another day of the same chag 
                {
                    console.log("True- first: " + element + " " + first)
                    return true;
                }
                if (await check_previous_day(date, "Erev")) {

                   // console.log("True- erev: " + element + " " + first)
                    return true;

                }


            }

        }
       // console.log("--false")
        return false;

    }
    catch (err) { console.log(err); }

}



function convert_utc_str_to_date_type(utc_date_str) {
    /**
     * console.log(convert_utc_to_isreal_time('2022-08-30 16:00'))
     * >> 2022-08-30T16:00:00.000Z
     */
    if (utc_date_str != null) {
        const date_time = utc_date_str.split(" ");
        utc_date_str = date_time[0] + "T" + date_time[1] + "Z";
        return new Date(utc_date_str);
    }
    return null;

}
function convert_utc_to_loacl_time(utc_date) {
    /**
     * recive utc date in Date type
     * return  string of local time
     */
    if (utc_date != null) {
        return utc_date.toLocaleDateString() + ' ' + utc_date.toLocaleTimeString();
    }
    return null;
}

async function get_weather_for_airport(iata_code,date,hour)
{
    const response = await axios.get(`https://api.weatherapi.com/v1/history.json?key="${weather_api_API_KEY}"&q="${iata_code}"&dt="${date}"&hour=${hour}`);
    console.log(response)
}
async function read_write() {
    var stream = require("fs").createReadStream("flights_for_BigML.csv");
    var reader = require("readline").createInterface({ input: stream });
    var arr = [];
    reader.on("line", async (row) => { 
        // console.log(row);
        simple_row=row.split(',');
        if(simple_row[0]!="YEAR")
        {
            //console.log(simple_row[0], simple_row[1], simple_row[2]);
            var date=formatDate(new Date(simple_row[0], simple_row[1], simple_row[2]));
            //console.log(simple_row[9])
            var hour=Math.floor((parseInt(simple_row[9])/100));
            origin_air=simple_row[6];
            dest_air=simple_row[7];

            //console.log(date,hour);
            console.log(origin_air,dest_air);

            await get_weather_for_airport(origin_air,date,hour);
            await get_weather_for_airport(dest_air,date,hour);

        }
        else
        {

        }
        
        
        
        arr.push(row.split(",")) });
}

// var csv1 = "flight_number,is_summer_vacation,is_holyday,f_month,week_day,company,arrival_country,depurture_country,flight_type,weather_dep,weather_arr,punctuality,f_status,scheduled_arr_time,scheduled_dep_time,updated_arr_time,updated_dep_time,webcite,time_info_taken";

// // (B) WRITE TO FILE
// fs.writeFileSync("arrive.csv", csv1);
// fs.writeFileSync("depurture.csv", csv1);
// fs.appendFileSync("arrive3.csv", csv);
read_write()