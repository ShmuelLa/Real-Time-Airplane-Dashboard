const express = require("express");
const bodyParser = require("body-parser");
const redis = require('redis');
const mongo = require('mongodb').MongoClient;


var url = "mongodb://localhost:2717/airdb";
const redisClient = redis.createClient(6379,'127.0.0.1');

redisClient.on('error', (err) => {
    console.log('Error occured while connecting or accessing redis server');
});


// if(!redisClient.get('customer_name',redis.print)) {
//     //create a new record
//     redisClient.set('customer_name','John Doe', redis.print);
//     console.log('Writing Property : customer_name');
// } else {
//     let val = redisClient.get('customer_name',redis.print);
//     console.log(`Reading property : customer_name - ${val}`);
// }


// // https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp
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

mongo.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("airdb");
    dbo.collection("customers").findOne({}, function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/" , function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.listen(5544, function() {
});