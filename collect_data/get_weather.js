//airports db taken from: http://www.partow.net/miscellaneous/airportdatabase/index.html#Downloads
//online viewer for sqlite: https://sqliteviewer.flowsoft7.com/

const sqlite3 = require('sqlite3').verbose();



function get_lat_lon_for_airport(iata_code,icao_code){
    var airports_type_string=null;
    var airports_code_string=null
    try {
        if (iata_code != null) {
           
            airports_type_string="iata_code";
            airports_code_string=iata_code;
        }
        else if (icao_code != null) {
            airports_type_string="icao_code";
            airports_code_string=icao_code;
        }
        else {return (null,null);}

        const db = new sqlite3.Database('./global_airports_sqlite.db');  
        console.log("SELECT lat_decimal, lon_decimal FROM 'airports'  where "+airports_type_string+" ='"+airports_code_string+"';");                                                                                                                    
        db.each(`SELECT lat_decimal, lon_decimal FROM 'airports'  where "${airports_type_string}"='${airports_code_string}';`, function(err, row) {
            if(err) return console.log(err.message);
            console.log(row.lat_decimal + ": " + row.lon_decimal);
        });


    } catch (error) {
        console.log(error)
    }
   
}
// get_lat_lon_for_airport("TLV");
// get_lat_lon_for_airport(null,"LLBG");
// get_lat_lon_for_airport("TLV","LLBG");
// get_lat_lon_for_airport();