const express = require("express");
const bodyParser = require("body-parser");
const mongo = require('mongodb').MongoClient;

var url = "mongodb://localhost:2717/airdb";


//https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp
// mongo.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

// mongo.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("airdb");
//     dbo.createCollection("customers", function(err, res) {
//         if (err) throw err;
//         console.log("Collection created!");
//         db.close();
//     });
// });

// mongo.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("airdb");
//     var myobj = {name: "El-Al", address: "E7445"};
//     dbo.collection("customers").insertOne(myobj, function(err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//     });
// });

// mongo.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("airdb");
//     dbo.collection("customers").findOne({}, function(err, result) {
//         if (err) throw err;
//         console.log(result);
//         db.close();
//     });
// });

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/" , function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.listen(5544, function() {
});