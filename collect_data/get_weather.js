//airports db taken from: http://www.partow.net/miscellaneous/airportdatabase/index.html#Downloads
//online viewer for sqlite: https://sqliteviewer.flowsoft7.com/
const sqlite3 = require('sqlite3').verbose();
const axios=require('axios')



function get_country_lat_lon_for_airport(iata_code, icao_code) {
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
        db.get(`SELECT country,lat_decimal, lon_decimal FROM 'airports'  where "${airports_type_string}"='${airports_code_string}';`, function (err, row) {
            if (err) reject(err);
            resolve(row);
        });


    });
}

get_country_lat_lon_for_airport("TLV").then((row) => { console.log(row.country,row.lat_decimal, row.lon_decimal); });

// get_lat_lon_for_airport(null,"LLBG");
// get_lat_lon_for_airport("TLV","LLBG");
// get_lat_lon_for_airport();











function getCountryName(iata_code, icao_code) {
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