
//if not working, try running in your mysql: ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'passward';
//Where root as your user localhost as your URL and password as your password

// setInterval(() => {
  
// }, 1000);
function create_sql_connection()
{
  var mysql = require('mysql');
  var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root"
  });
  return con;
}
function add_row_flight(con, info)
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("USE flights_db;", function (err, result) {
      if (err) throw err;
    });
    
    con.query(`INSERT INTO taken_info(webcite,time_info_taken,data) VALUES (${info.webcite},${info.date_time},${info.data});`,
     function (err, result) {
      if (err) throw err;
      console.log("Result: " + result.affectedRows+" rows changed." );
    });

});

create_sql_connection().then((con)=>{add_row_flight(con,{"webcite":"hello.com","date_time":"26-08-2022  18:04:10","data":{"hay":"you"}})}); 

function update_row_flight(con, flight)//need to fix
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("USE flights_db;", function (err, result) {
      if (err) throw err;
    });
    con.query(" INSERT INTO flights_history(is_summer_vacation,is_holyday,f_month, week_day , company , departure, arrival, flight_type, weather_dep ,weather_arr ,punctuality  )  VALUES (false,true,1, 1,'ell','isreal','america',0,'cold','warm',0);", function (err, result) {
      if (err) throw err;
      console.log("Result: " + result.affectedRows+" rows changed." );
    });

});
    //con.query("use flights_db;     INSERT INTO flights_history ( is_summer_vacation,is_holyday,f_month, week_day , company , departure, arrival, flight_type, weather_dep ,weather_arr ,punctuality  )  VALUES ('0','0','1', '1','ell','isreal','america','0','cold','warm','0');",
     //time_period 0-holiday 1-summer vication 2
     //