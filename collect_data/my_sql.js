// ///SET SQL_SAFE_UPDATES = 0 to allow delete without using primary key


// function create_sql_connection() {
//   var mysql = require('mysql2');
//   var con = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     password: "root"
//   });
//   return con;
// }
// function add_row_info(con, info) {
//   try {
//     /**
//      * add info to database, date_time need to be in "YYYY-MM-DDTHH:MM:SS" format.
//       con=create_sql_connection()
//       add_row_info(con, { "webcite": "hello.com", "date_time": "2022-09-09T12:41:13", "data": { hay: "you" } });
//      * 
//      */
//     con.connect(function (err) {
//       if (err) throw err;
//       console.log("Connected!");
//       con.query("USE flights_db;", function (err, result) {
//         if (err) throw err;
//       });

//       con.query(`INSERT INTO taken_info(webcite,time_info_taken,info) VALUES ('${info.webcite}','${info.date_time}','${JSON.stringify(info.data)}');`,
//         function (err, result) {
//           if (err) throw err;
//           console.log("Result: " + result.affectedRows + " rows changed.");
//         });

//     });
//   }
//   catch (err) { console.log(err); }
// }

// module.exports={create_sql_connection,add_row_info}

