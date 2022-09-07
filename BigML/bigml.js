const bigml = require('bigml');
const express = require("express");
const { MongoClient } = require('mongodb');
const csvtojson = require("csvtojson");
const app = express();

const url = "mongodb://localhost:2717";
const mongo = new MongoClient(url);
const db_name = "airdb"


async function inserJson(csvData) {
    try {
        await mongo.connect();
        const database = mongo.db(db_name);
        const foods = database.collection("test2");
        // this option prevents additional documents from being inserted if one fails
        const options = { ordered: true };
        const result = await foods.insertMany(csvData, options);
        console.log(`${result.insertedCount} documents were inserted`);
    } finally {
        await mongo.close();
    }
}
// // https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp

// mongo.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db(db_name);
//     dbo.createCollection("test1", function(err, res) {
//         if (err) throw err;
//         console.log("test1 Collection created!");
//         db.close();
//     });
// });

// mongo.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("airdb");
//     var myobj = {name: "El-Al", address: "E7445"};
//     dbo.collection("test1").insertOne(myobj, function(err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//     });
// });

// mongodb.connect(
//     url,
//     // { useNewUrlParser: true, useUnifiedTopology: true },
//     (err, client) => {
//       if (err) throw err;
//       client
//         .collection("test1")
//         .insertMany(csvData, (err, res) => {
//           if (err) throw err;
//           console.log(`Inserted: ${res.insertedCount} rows`);
//           client.close();
//         });
//     }
// );



async function mongo_main() {
    // Use connect method to connect to the server
    await mongo.connect();
    console.log('Connected successfully to server');
    const db = mongo.db(db_name);
    const collection = db.collection('test2');
  
    // the following code examples can be pasted here...
  
    return 'done.';
}

mongo_main()
  .then(console.log)
  .catch(console.error)
  .finally(() => mongo.close());


csvtojson()
    .fromFile(__dirname + "/../Datasets/1000-data.csv")
    .then(csvData => {
        inserJson(csvData).catch(console.dir);
});


async function findExample() {
    try {
        await mongo.connect();
        const database = client.db(db_name);
        const movies = database.collection("test2");
        // Query for a movie that has the title 'The Room'
        const query = { YEAR: '2015' };
        // const options = {
        // // sort matched documents in descending order by rating
        // sort: { "imdb.rating": -1 },
        // // Include only the `title` and `imdb` fields in the returned document
        // projection: { _id: 0, title: 1, imdb: 1 },
        // };
        const movie = await movies.findOne(query);
        // since this method returns the matched document, not a cursor, print it directly
        console.log(movie);
    } finally {
        await mongo.close();
    }
}
findExample().catch(console.dir);

app.listen(55551, function() {
});

