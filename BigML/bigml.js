const bigml = require('bigml');
const express = require("express");
const { MongoClient } = require('mongodb');
const csvtojson = require("csvtojson");
const app = express();

const url = "mongodb://localhost:2717";
const mongo = new MongoClient(url);
const db_name = "airdb"

const exampple_doc =   {
    YEAR: '2015',
    MONTH: '1',
    DAY: '1',
    DAY_OF_WEEK: '4',
    AIRLINE: 'WN',
    FLIGHT_NUMBER: '473',
    ORIGIN_AIRPORT: 'FLL',
    DESTINATION_AIRPORT: 'TLV',
    SCHEDULED_DEPARTURE: '1045',
    DEPARTURE_TIME: '1046',
    DEPARTURE_DELAY: '1',
    TAXI_OUT: '19',
    WHEELS_OFF: '1105',
    SCHEDULED_TIME: '115',
    ELAPSED_TIME: '118',
    AIR_TIME: '89',
    DISTANCE: '581',
    WHEELS_ON: '1234',
    TAXI_IN: '10',
    SCHEDULED_ARRIVAL: '1240',
    ARRIVAL_TIME: '1244',
    ARRIVAL_DELAY: '4',
    DELAY_TYPE: 'No Delay',
    DISTANCE_TYPE: 'Short',
    IS_HOLYDAY: 'false',
    IS_VICATION: 'false',
    WEATHER_DEP_DESC: 'Sunny',
    WEATHER_DEP_DESC_CODE: '1000',
    WEATHER_DEP_DEG: '21.2',
    WEATHER_ARR_DESC: 'Sunny',
    WEATHER_ARR_DESC_CODE: '1000',
    WEATHER_ARR_DEG: '23.5'
}

/*
MongoDB code snippet, base function:

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
*/


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


async function insertOne(doc) {
    try {
        await mongo.connect();
        const database = mongo.db(db_name);
        const haiku = database.collection("test2");
        const result = await haiku.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
       await mongo.close();
    }
}


async function findExample() {
    try {
        await mongo.connect();
        const database = mongo.db(db_name);
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
        console.log(`A document was found with id: ${movie._id}`);
    } finally {
        await mongo.close();
    }
}

csvtojson()
    .fromFile(__dirname + "/../Datasets/1000-data.csv")
    .then(csvData => {
        inserJson(csvData).catch(console.dir);
});

// async function run() {
//     try {
//         // await mongo.connect();
//         const database = mongo.db(db_name);
//         const movies = database.collection("test2");
//         // query for movies that have a runtime less than 15 minutes
//         const query = { YEAR: { $lt: 2500 } };
//         const cursor = movies.find(query);
//         // print a message if no documents were found
//         if ((await cursor.count()) === 0) {
//             console.log("No documents found!");
//         }
//         // replace console.dir with your callback to access individual elements
//         await cursor.forEach(console.dir);
//     } finally {
//         await mongo.close();
//     }
// }
// run().catch(console.dir);




// insertOne(exampple_doc).catch(console.dir);
// findExample().catch(console.dir);



app.listen(55551, function() {
});

