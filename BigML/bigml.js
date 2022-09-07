bigml = require('bigml');
const mongo = require('mongodb').MongoClient;
const csvtojson = require("csvtojson");

// csvtojson()
//     .fromFile(__dirname + "/../Datasets/1000-data.csv")
//     .then(csvData => {
//         console.log(csvData);
// });


const url = "mongodb://localhost:2717/airdb";
const db_name = "airdb"

// // https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp
// mongo.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Connected to MongoDB airdb!");
//   db.close();
// });

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

// mongo.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db(db_name);
//     dbo.collection("test1").findOne({}, function(err, result) {
//         if (err) throw err;
//         console.log(result);
//         db.close();
//     });
// });


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
  .finally(() => client.close());