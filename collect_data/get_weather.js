//airports db taken from: http://www.partow.net/miscellaneous/airportdatabase/index.html#Downloads
//online viewer for sqlite: https://sqliteviewer.flowsoft7.com/
const open_weather_API_KEY= '11c3ed82ecfb174aba5afa2fa6c57d15'
//http://api.weatherapi.com/v1/history.json?key=ca4ab3174e3340468f1192548220409&q=TLV&dt=2015-05-27
const sqlite3 = require('sqlite3').verbose();
const axios=require('axios')


//https://api.weatherapi.com/v1/history.json?key=ca4ab3174e3340468f1192548220409&q=TLV&dt=2015-05-27&hour=7
//Must be in 24 hour. For example 5 pm should be hour=17, 6 am as hour=6
// {"location":{"name":"Ben Gurion Airport","region":"Tel Aviv","country":"Israel","lat":32.01,"lon":34.89,"tz_id":"Asia/Jerusalem","localtime_epoch":1662320693,"localtime":"2022-09-04 22:44"},"forecast":{"forecastday":[{"date":"2015-05-27","date_epoch":1432684800,"day":{"maxtemp_c":40.1,"maxtemp_f":104.2,"mintemp_c":23.4,"mintemp_f":74.2,"avgtemp_c":36.5,"avgtemp_f":97.8,"maxwind_mph":13.4,"maxwind_kph":21.6,"totalprecip_mm":0.8,"totalprecip_in":0.03,"avgvis_km":9.9,"avgvis_miles":6.0,"avghumidity":29.0,"condition":{"text":"Patchy rain possible","icon":"//cdn.weatherapi.com/weather/64x64/day/176.png","code":1063},"uv":0.0},"astro":{"sunrise":"05:37 AM","sunset":"07:39 PM","moonrise":"01:59 PM","moonset":"01:46 AM","moon_phase":"First Quarter","moon_illumination":"60"},"hour":[{"time_epoch":1432699200,"time":"2015-05-27 07:00","temp_c":34.9,"temp_f":94.8,"is_day":1,"condition":{"text":"Sunny","icon":"//cdn.weatherapi.com/weather/64x64/day/113.png","code":1000},"wind_mph":7.8,"wind_kph":12.5,"wind_degree":154,"wind_dir":"SSE","pressure_mb":1009.0,"pressure_in":29.81,"precip_mm":0.0,"precip_in":0.0,"humidity":23,"cloud":4,"feelslike_c":33.7,"feelslike_f":92.7,"windchill_c":34.9,"windchill_f":94.8,"heatindex_c":33.7,"heatindex_f":92.7,"dewpoint_c":10.8,"dewpoint_f":51.4,"will_it_rain":0,"chance_of_rain":0,"will_it_snow":0,"chance_of_snow":0,"vis_km":10.0,"vis_miles":6.0,"gust_mph":9.4,"gust_kph":15.1}]}]}}
function get_lat_lon_for_airport(iata_code, icao_code) {
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
        console.log("SELECT lat_decimal, lon_decimal FROM 'airports'  where " + airports_type_string + " ='" + airports_code_string + "';");
        db.get(`SELECT lat_decimal, lon_decimal FROM 'airports'  where "${airports_type_string}"='${airports_code_string}';`, function (err, row) {
            if (err) reject(err);
            console.log(row.lat_decimal + ": " + row.lon_decimal);
            resolve(row);
        });


    });
}

get_lat_lon_for_airport("TLV").then((row) => { console.log(row.lat_decimal, row.lon_decimal); });

// get_lat_lon_for_airport(null,"LLBG");
// get_lat_lon_for_airport("TLV","LLBG");
// get_lat_lon_for_airport();

function get_weather_for_airport(iata_code, icao_code,date)
{
    https://api.weatherapi.com/v1/history.json?key=ca4ab3174e3340468f1192548220409&q=TLV&dt=2015-05-27&hour=7
    
}

get_weather_for_airport("TLV",null);

