/*YEAR,MONTH,DAY,DAY_OF_WEEK,AIRLINE,FLIGHT_NUMBER,ORIGIN_AIRPORT,
DESTINATION_AIRPORT,SCHEDULED_DEPARTURE,DEPARTURE_TIME,DEPARTURE_DELAY,
TAXI_OUT,WHEELS_OFF,SCHEDULED_TIME,ELAPSED_TIME,AIR_TIME,DISTANCE,
WHEELS_ON,TAXI_IN,SCHEDULED_ARRIVAL,ARRIVAL_TIME,ARRIVAL_DELAY,DELAY_TYPE,DISTANCE_TYPE
*/

const http = require('http');
const https = require('https');
const fs = require('fs');//.promises;
const axios = require('axios');
const { read } = require('fs');
const { rejects } = require('assert');
axios.default.timeout === 60000;
const weather_api_API_KEY = "ca4ab3174e3340468f1192548220409"
function padTo2Digits(num) {
    //date helper functions
    return num.toString().padStart(2, '0');
}
function is_summer_vacation(date) {
    /**
     * 
     */
    date = new Date(date);
    var start_vic = new Date(date.getFullYear() + '-06-20');
    var end_vic = new Date(date.getFullYear() + '-09-01');
    return date > start_vic && date < end_vic;

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

async function check_previous_day(date, word, httpAgent, httpsAgent) {

    try {
        let previous = getPreviousDay(new Date(date));
        const response = await axios.get("https://www.hebcal.com/converter?cfg=json&date=" + previous + "&g2h=1&strict=1"/*, { httpAgent: httpAgent, httpsAgent: httpsAgent }*/);

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



async function isJewishIsraelyHolyday(date/*, httpAgent, httpsAgent*/) {
    try {
        const response = await axios.get("https://www.hebcal.com/converter?cfg=json&date=" + date + "&g2h=1&strict=1"/*, { httpAgent: httpAgent, httpsAgent: httpsAgent }*/)

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
                if (await check_previous_day(date, first/*, httpAgent, httpsAgent*/))//check if yestorday is erev chag, or another day of the same chag 
                {
                    console.log("True- first: " + element + " " + first)
                    return true;
                }
                if (await check_previous_day(date, "Erev"/*, httpAgent, httpsAgent*/)) {

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



async function get_weather_for_airport(iata_code, date, hour/*, httpAgent, httpsAgent*/) {
    try {
        const response = await axios.get(`https://api.weatherapi.com/v1/history.json?key=${weather_api_API_KEY}&q=${iata_code}&dt=${date}&hour=${hour}`/*, { httpAgent: httpAgent, httpsAgent: httpsAgent }*/);
        var desc = response.data.forecast.forecastday[0].hour[0].condition.text;
        var desc_code = response.data.forecast.forecastday[0].hour[0].condition.code;
        var deg = response.data.forecast.forecastday[0].hour[0].feelslike_c;
        console.log(desc, desc_code, deg);
        return [desc, desc_code, deg];


        /*{
            time_epoch: 1422795600,
            time: '2015-02-01 08:00',
            temp_c: -0.7,
            temp_f: 30.7,
            is_day: 0,
            condition: {
              text: 'Cloudy',
              icon: '//cdn.weatherapi.com/weather/64x64/night/119.png',
              code: 1006
            },
            wind_mph: 5.1,
            wind_kph: 8.3,
            wind_degree: 218,
            wind_dir: 'SW',
            pressure_mb: 1025,
            pressure_in: 30.27,
            precip_mm: 0,
            precip_in: 0,
            humidity: 63,
            cloud: 61,
            feelslike_c: -3.9,
            feelslike_f: 25,
            windchill_c: -3.9,
            windchill_f: 25,
            heatindex_c: -0.7,
            heatindex_f: 30.7,
            dewpoint_c: -6.9,
            dewpoint_f: 19.6,
            will_it_rain: 0,
            chance_of_rain: 2,
            will_it_snow: 0,
            chance_of_snow: 0,
            vis_km: 10,
            vis_miles: 6,
            gust_mph: 7.9,
            gust_kph: 12.7
          }*/
    }
    catch (err) {
        console.log(err);
    }
}
// function start() {


//     //axios set to keep alive
//     const httpAgent = new http.Agent({ keepAlive: true,agent: false });
//     const httpsAgent = new https.Agent({ keepAlive: true,agent: false });

//     // on the instance
//     axios.create({
//         httpAgent,  // httpAgent: httpAgent -> for non es6 syntax
//         httpsAgent,
//     });

//     return httpAgent, httpsAgent;
// }

// async function read_write(/*httpAgent, httpsAgent*/) {


//     var stream = fs.createReadStream("f2.csv");
//     var reader = require("readline").createInterface({ input: stream });
//     var i = 0
//     reader.on("line", async (row) => {
//         //    i+=1;
//         //    if(i===10)  { reader.cancel();         return;}
//         //     console.log(row);
//         var split_row = row.split(',');
//         if (split_row[0] != "YEAR") {
//             //console.log(split_row[0], split_row[1], split_row[2]);
//             var date = formatDate(new Date(split_row[0], split_row[1], split_row[2]));
//             //console.log(split_row[9])
//             var hour = Math.floor((parseInt(split_row[9]) / 100));
//             var origin_air = split_row[6];
//             var dest_air = split_row[7];

//             // console.log(date, hour);
//             // console.log(origin_air, dest_air);
//             var is_holyday = await isJewishIsraelyHolyday(date/*, httpAgent, httpsAgent*/);
//             var is_summer_vic = is_summer_vacation(date);
//             var weather_dep = await get_weather_for_airport(origin_air, date, hour/*, httpAgent, httpsAgent*/);
//             console.log(weather_dep, is_holyday)
//             var weather_arr = await get_weather_for_airport(dest_air, date, hour/*, httpAgent, httpsAgent*/);
//             //desc,desc_code,deg
//             split_row.push(is_holyday);
//             split_row.push(is_summer_vic);
//             split_row.push(weather_dep[2])
//             split_row.push(weather_dep[0])
//             split_row.push(weather_dep[1])
//             split_row.push(weather_arr[2])
//             split_row.push(weather_arr[0])
//             split_row.push(weather_arr[1])
//             console.log(split_row.join(',') + "\r\n");
//             console.log(is_holyday, is_summer_vic, weather_dep, weather_arr);
//             fs.appendFile("data.csv", split_row.join(',') + "\r\n")


//         }
//         else {
//             split_row.push("IS_HOLYDAY");
//             //                 split_row.push("IS_VICATION");
                            
//             //                 split_row.push("WEATHER_DEP_DESC");
//             //                 split_row.push("WEATHER_DEP_DESC_CODE");
//             //                 split_row.push("WEATHER_DEP_DEG");
                            
//             //                 split_row.push("WEATHER_ARR_DESC");
//             //                 split_row.push("WEATHER_ARR_DESC_CODE");
//             //                 split_row.push("WEATHER_ARR_DEG");
//             fs.writeFile("data.csv", split_row.join(',') + "\r\n");
//         }




//     });
//     console.log("done");

// }
// var httpAgent, httpsAgent=start();
// const throttledQueue = require('throttled-queue');
// const throttle = throttledQueue(1, 1000); // at most make 1 request every second.
// throttle(() => {read_write(start());});
//read_write(start());
//read_write();

async function read2() {
    var LineByLineReader = require('line-by-line'),
        lr = new LineByLineReader('f.csv');

    lr.on('error', function (err) {
        // 'err' contains error object
    });

    lr.on('line', async function (line) {
        // pause emitting of lines...
        lr.pause();

        // ...do your asynchronous line processing..
        //  setTimeout(async function () {
            var split_row = line.split(',');
            if (split_row[0] != "YEAR") {
                //console.log(split_row[0], split_row[1], split_row[2]);
                var date = formatDate(new Date(split_row[0], split_row[1], split_row[2]));
                //console.log(split_row[9])
                var hour = Math.floor((parseInt(split_row[9]) / 100));
                var origin_air = split_row[6];
               var  dest_air = split_row[7];
    
                // console.log(date, hour);
                // console.log(origin_air, dest_air);
                var is_holyday = await isJewishIsraelyHolyday(date/*, httpAgent, httpsAgent*/);
                var is_summer_vic = is_summer_vacation(date);
                var weather_dep = await get_weather_for_airport(origin_air, date, hour/*, httpAgent, httpsAgent*/);
                
                var weather_arr = await get_weather_for_airport(dest_air, date, hour/*, httpAgent, httpsAgent*/);
                //desc,desc_code,deg
                console.log(split_row.join(',') + "\r\n");
                console.log( split_row.join(',') + `,${is_holyday},${is_summer_vic},${weather_dep[0]},${weather_dep[1]},${weather_dep[2]},${weather_arr[0]},${weather_arr[1]},${weather_arr[2]}\r\n`);
                fs.appendFileSync("data2.csv",split_row.join(',') + `,${is_holyday},${is_summer_vic},${weather_dep[0]},${weather_dep[1]},${weather_dep[2]},${weather_arr[0]},${weather_arr[1]},${weather_arr[2]}\r\n`)
    
    
            }
            else {
                split_row.push("IS_HOLYDAY");
                split_row.push("IS_VICATION");
                
                split_row.push("WEATHER_DEP_DESC");
                split_row.push("WEATHER_DEP_DESC_CODE");
                split_row.push("WEATHER_DEP_DEG");
                
                split_row.push("WEATHER_ARR_DESC");
                split_row.push("WEATHER_ARR_DESC_CODE");
                split_row.push("WEATHER_ARR_DEG");
                fs.writeFileSync("data2.csv", split_row.join(',') + "\r\n");
            }
            // ...and continue emitting lines.
            lr.resume();
         //}, 100);
     });

    lr.on('end', function () {
        // All lines are read, file is closed now.
    });
}
read2()