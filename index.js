const express = require("express");
const bodyParser = require("body-parser");
// const redis = require('redis');


// const redisClient = redis.createClient(6379,'127.0.0.1');

// redisClient.on('error', (err) => {
//     console.log('Error occured while connecting or accessing redis server');
// });


// if (!redisClient.get('dest_airport',redis.print)) {
//     //create a new record
//     redisClient.set('dest_airport','TLV', redis.print);
//     console.log('Writing Property : dest_airport');
// } else {
//     let val = redisClient.get('dest_airport',redis.print);
//     console.log(`Reading property : dest_airport - ${val}`);
// }



const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/" , function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.listen(55552, function() {
});