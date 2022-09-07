// const axios = require('axios');
// const google_API_KEY = 'AIzaSyBt9glf5ArfXN4iiEdRJZNjisyVP0O8s5M'



const sqlite3 = require('sqlite3').verbose();
const SphericalUtil=require( "node-geometry-library").SphericalUtil;

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
    db.get(`SELECT lat_decimal, lon_decimal FROM 'airports'  where "${airports_type_string}"='${airports_code_string}';`, function (err, row) {
      if (err) reject(err);
      resolve(row);
    });


  });
}


async function distance_from_TLV(iata_code, icao_code) {
  /*
  * Return distanse in km between the given airport from ben-gurion, isreal airport
  * examples:
  distance_from_TLV("TLV").then((ans)=>{console.log(ans)})
  *>> 0
  */
  var lat_lng=await get_lat_lon_for_airport(iata_code, icao_code);

  
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
      resolve(row.country);
    });


  });
}
distance_from_TLV("TLV").then((ans)=>{console.log(ans)})

distance_from_TLV("JJU").then((ans)=>{console.log(ans)})
