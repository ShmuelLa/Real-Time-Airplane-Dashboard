const weather_api_API_KEY = "ca4ab3174e3340468f1192548220409"
const redis_op = require("./../redis/redis_op");

//const air_labs_API_KEY = require('./real_time.js').air_labs_API_KEY
const air_labs_API_KEY ='6e6b9c47-3260-4d1e-909c-21375f29557d'
const dayjs = require('dayjs');
const axios = require('axios');
//-------DATES------:

function isSummerVacation(utc_date) {
    /**
     * Get date in '2022-08-30 16:00' format' utc and returns weather it's during summer vacation
     */
   
    date =  convertUtcStrToDateType(utc_date);
    if(date!=null)
    {var start_vic = new Date(date.getFullYear() + '-06-20');
    var end_vic = new Date(date.getFullYear() + '-09-01');
    return date > start_vic && date < end_vic;
}
return null;
}


function padTo2Digits(num) {
    /*
    * Date helper functions, convert number to 2 number format (from 1 to 01)
    */
    return num.toString().padStart(2, '0');
}
function formatDateYMD(day,month,year)
{
    

    return [
        year,
        padTo2Digits(month),
        padTo2Digits(day)

        
    ].join('-');

}

function formatDate(date) {
    /* 
    * Format a date  (type Date) to YYYY-MM-DD format.
    * examples:
    console.log(formatDate(new Date()));//for today
    * >> 2022-01-18 (yyyy-mm-dd)
    console.log(formatDate(new Date(2025, 4, 9)));
    * >> 2025-05-09 
    */

    date.setHours(0, 0, 0, 0);

    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}

function getPreviousDay(date) {
    /**
     * Get a date in Date type, and return the Previous date in YYYY-MM-DD format.
     * examples:
     console.log(getPreviousDay(new Date())); // yesterday
     >> 2022-09-06
     console.log(getPreviousDay(new Date('2022-12-24')));
     >> 2022-12-23
     console.log(getPreviousDay(new Date('2023-01-01')));
     >> 2022-12-31
     */
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);

    return formatDate(previous);
}

async function checkPreviousDay(date, word) {
    /**
     * Helper function for is_jewish_israely_holyday.
     * Check if the given word apper in the holyday info of the previus day,
     * to check if the current day is a holyday.
     */

    try {
        let previous = getPreviousDay(new Date(date));
        const response = await axios.get("https://www.hebcal.com/converter?cfg=json&date=" + previous + "&g2h=1&strict=1");
            for (const element of response.data.events) {
            if (!element.includes('Parashat')) {
                if (element.includes(word)) { return true; }
            }
        }       
        return false;
    }
    catch (err) { console.log(err); }

}


async function isJewishIsraelyHolyday(date) {
    /**
     * recives date in Date type' and return if it's a jewish holyday
     */
    try {
        date=formatDate(convertUtcStrToDateType(date))
        const response = await axios.get("https://www.hebcal.com/converter?cfg=json&date=" + date + "&g2h=1&strict=1");
        /**
         * for each event which isn't "Parashat", if the first word appear the previes day/ or the previes day has "erev" it's an holyday.
         * */
        for (const element of response.data.events) {

            if ((!element.includes('Parashat')) && (!element.includes('Chodesh'))) {
                let first = element.split(' ')[0];
                if (element.includes("Erev")) {//if erev chag
                    return [true,"https://www.hebcal.com/converter?cfg=json&date=" + date + "&g2h=1&strict=1",response];
                }
                if (await checkPreviousDay(date, first))// check if yestorday is another day of the same chag 
                {
                    console.log("True- first: " + element + " " + first)
                    return [true,"https://www.hebcal.com/converter?cfg=json&date=" + date + "&g2h=1&strict=1",response];
                }
                if (await checkPreviousDay(date, "Erev")) {//check if yestorday is erev chag
                    return [true,"https://www.hebcal.com/converter?cfg=json&date=" + date + "&g2h=1&strict=1",response];
                }
            }
        }
        return [false,"https://www.hebcal.com/converter?cfg=json&date=" + date + "&g2h=1&strict=1",response];

    }
    catch (err) { console.log(err); }

}
function getNow() {
    /**
     * get current time in the following format: 
     * 26-08-2022  18:04:10
     */
    let today = dayjs();
    return today.format("YYYY-MM-DDTHH:mm:ss");

}
function convertUtcStrToDateType(utc_date_str) {
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


function convertUtcToLoaclTime(utc_date) {
    /**
     * recive utc date in '2022-08-30 16:00' format
     * return  string of local time
     */
     utc_date=convertUtcStrToDateType(utc_date);
    if (utc_date != null) {
        return utc_date.toLocaleDateString() + ' ' + utc_date.toLocaleTimeString();
    }
    return null;
}


function minutesDifference(utc_date1, utc_date2) {
    /**
     * Return the minutes differense between 2 Date types containing utc time.
     */
    if (utc_date1 != null && utc_date2 != null) { return (utc_date1.getTime() - utc_date2.getTime()) / 60000; }
    return null;
}
function getYearMonthDay(utc_time)
{
    /**
     * Recive utc date in '2022-08-30 16:00' format
     * return array of year, month, day, day_of_the_week
     */
    var date=convertUtcStrToDateType(utc_time);
if(date!=null)
{
    return [date.getFullYear(),date.getMonth(),date.getDate(),date.getDay()+1];
}}

function getWeekDay(utc_time) 
{
    /**
     * Recive utc date in '2022-08-30 16:00' format
     * return the day of the week
     */
    return convertUtcStrToDateType(response.dep_time_utc).getDay() + 1;
}


//--------------Weather---------------
// info from: api.weatherapi
async function getWeatherForAirport(iata_code, date, hour) {
    /**
     * excpect date in '2022-09-07 14:58' format
     * Get aitport iata code, date, and hour, (Must be in 24 hour. For example 5 pm should be hour=17, 6 am as hour=6)
     *  for a date on or after 1st Jan, 2010
     *  and return weather description, code matchinfg to the description, and the deg in celsius for the time.
     *  https://api.weatherapi.com/v1/history.json?key=ca4ab3174e3340468f1192548220409&q=TLV&dt=2015-05-27&hour=7  
     * 
     */
    
    try {
        date=date.split(" ")[0];
        const response = await axios.get(`https://api.weatherapi.com/v1/history.json?key=${weather_api_API_KEY}&q=${iata_code}&dt=${date}&hour=${hour}`);
        var desc = response.data.forecast.forecastday[0].hour[0].condition.text;
        var desc_code = response.data.forecast.forecastday[0].hour[0].condition.code;
        var deg = response.data.forecast.forecastday[0].hour[0].feelslike_c;
        return [desc, desc_code, deg,'https://api.weatherapi.com/v1/history.json',response];


        /*
        full info example:
        {
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





//------------------company name-----------------------
async function getCompanyName(iata, icao) {
    /**
     * get company name by its iata code or its icao code.
     */
    var res;
    var compony_name = null
    try {
        if (iata != null) {
            res = await axios.get(`https://airlabs.co/api/v9/airlines?iata_code=${iata}&api_key=${air_labs_API_KEY}`);
            compony_name = res.data.response[0].name;
        }
        else if (icao != null) {
            res = await axios.get(`https://airlabs.co/api/v9/airlines?icao_code=${icao}&api_key=${air_labs_API_KEY}`);
            compony_name = res.data.response[0].name;
        }
    } catch (error) {
        console.log(error)
    }


    //console.log("company name: " + compony_name)
    return [compony_name,`https://airlabs.co/api/v9/airlines`,res];
}



// distanse, and country name by airport code from sqlite file
const sqlite3 = require('sqlite3').verbose();
const SphericalUtil=require( "node-geometry-library").SphericalUtil;

function getLatLonForAirport(iata_code, icao_code) {
    /**
     * Return the lat and lon of a given airport.
     * (if has only icao_code, expects null in iata code)
     */
  return new Promise((resolve, reject) => {
    var airports_type_string = null;
    var airports_code_string = null

    if (iata_code != null) {

      airports_type_string = "iata_code";
      airports_code_string = iata_code;
    }
    else if (icao_code != null) {
      airports_type_string = "icao_code";
      airports_code_string = icao_code;
    }
    else { reject(new Error("Hasn't recived any airport id.")); }

    const db = new sqlite3.Database('./global_airports_sqlite.db');
    db.get(`SELECT lat_decimal, lon_decimal FROM 'airports'  where "${airports_type_string}"='${airports_code_string}';`, function (err, row) {
      if (err) reject(err);
      resolve(row);
    });


  });
}


async function distanceFromTLV(iata_code, icao_code) {
  /*
  * Return distanse in km between the given airport from ben-gurion, isreal airport
  * (if has only icao_code, expects null in iata code)
  * examples:
  distanceFromTLV("TLV").then((ans)=>{console.log(ans)})
  *>> 0
  */
  var lat_lng=await getLatLonForAirport(iata_code, icao_code);

  
  //ISREAL- lat_decimal: 32.009, lon_decimal: 34.877
  const lat_TLV=32.009,lon_TLV=34.877;


  return SphericalUtil.computeDistanceBetween(
    {lat: lat_lng.lat_decimal, lng: lat_lng.lon_decimal}, //from object {lat, lng}
    {lat: lat_TLV, lng: lon_TLV} // to object {lat, lng}
  )/1000;
}
  
  
  


function getCountryNameForAirport(iata_code, icao_code) {
  /**
   * Return country name for airport code
   * (if has only icao_code, expects null in iata code)
   */
  return new Promise((resolve, reject) => {
    var airports_type_string = null;
    var airports_code_string = null

    if (iata_code != null) {

      airports_type_string = "iata_code";
      airports_code_string = iata_code;
    }
    else if (icao_code != null) {
      airports_type_string = "icao_code";
      airports_code_string = icao_code;
    }
    else { reject(new Error("Hasn't recived any airport id.")); }

    const db = new sqlite3.Database('./global_airports_sqlite.db');
    db.get(`SELECT country FROM 'airports'  where "${airports_type_string}"='${airports_code_string}';`, function (err, row) {
      if (err) reject(err);
      resolve(row);
    });


  });
}


function delayStatus(minutes) {
    if (minutes != null) {
        if (minutes <= 15) { return 'No Delay'; }
        else if ((minutes <= 60)) { return 'Delayed'; }
        else { return 'Heavy Delay'; }
    }
    else {
        return null;
    }
}
function distanseStatus(km) {
    if (km != null) {
        if (km <= 1500) { return 'Short'; }
        else if ((km <= 3500)) { return 'Median'; }
        else { return 'Long'; }
    }
    else {
        return null;
    }
}





async function update_redis(flight_json, arriving_flights, depurturing_flights) {
    console.log("-----------redis---------------")
    if (flight_json.DESTINATION_AIRPORT_IATA == 'TLV')//landing
    {
        if (flight_json.FLIGHT_STATUS == 'landed') {
            if (arriving_flights.has(flight_json.FLIGHT_IATA_CODE)) {
                arriving_flights.delete(flight_json.FLIGHT_IATA_CODE);
                await redisDel(flight_json.FLIGHT_IATA_CODE);
            }
        }

        else {
            var date_time_arr = flight_json.SCHEDULED_ARRIVAL.split(' ');
            var date = date_time_arr[0].split('.');
            var date_type = new Date(formatDateYMD(date[0], date[1], date[2]) + " " + date_time_arr[1]);

            console.log(date_type)
            if ((minutesDifference(date_type, new Date()) < 15) <= 15) {
                arriving_flights.set(flight_json.FLIGHT_IATA_CODE,flight_json);
                await redis_op.redisSetJson(flight_json.FLIGHT_IATA_CODE,flight_json);

            }
        }
        await redis_op.redisSet("landing",arriving_flights.size);

    }


    else if (flight_json.ORIGIN_AIRPORT_IATA == 'TLV')//depurtering
    {
        if (flight_json.FLIGHT_STATUS != 'scheduled') {
            if (depurturing_flights.has(flight_json.FLIGHT_IATA_CODE)) {
                depurturing_flights.delete(flight_json.FLIGHT_IATA_CODE);
                redisDel(flight_json.FLIGHT_IATA_CODE);
            }
        }

        else {
            var date_time_arr = flight_json.SCHEDULED_DEPARTURE.split(' ');
            var date = date_time_arr[0].split('.');
            var date_type = new Date(formatDateYMD(date[0], date[1], date[2]) + " " + date_time_arr[1]);

            console.log(date_type)
            if ((minutesDifference(date_type, new Date())) <= 15) {
                depurturing_flights.set(flight_json.FLIGHT_IATA_CODE,flight_json);
                await redis_op.redisSetJson(flight_json.FLIGHT_IATA_CODE,flight_json);

            }
        }
        await redis_op.redisSet("takeoff",depurturing_flights.size);


    }
}

module.exports = { 
       
    isSummerVacation,
    isJewishIsraelyHolyday,
    getWeatherForAirport,
    getNow,
    getCompanyName,
    getYearMonthDay,
    minutesDifference,
    distanceFromTLV,
    convertUtcStrToDateType,
    convertUtcToLoaclTime,
    delayStatus,
    getCountryNameForAirport,
    distanceFromTLV,
    distanseStatus,
    formatDateYMD,
    update_redis
 };
