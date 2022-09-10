const { MongoClient } = require('mongodb');
const csvtojson = require("csvtojson");

const url = "mongodb://localhost:2717";
const mongo = new MongoClient(url);
const db_name = "airdb"
const collection_name = "history"

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
        const mongoCol = database.collection(collection_name);
        // this option prevents additional documents from being inserted if one fails
        const options = { ordered: true };
        const result = await mongoCol.insertMany(csvData, options);
        console.log(`\n[--+--] ${result.insertedCount} documents were inserted\n`);
    } finally {
        await mongo.close();
    }
}

async function insertOne(doc) {
    try {
        await mongo.connect();
        const database = mongo.db(db_name);
        const mongoCol = database.collection(collection_name);
        const result = await mongoCol.insertOne(doc);
        console.log(`\n[--+--] A document was inserted with the _id: ${result.insertedId}\n`);
    } finally {
       await mongo.close();
    }
}


async function findExample() {
    try {
        await mongo.connect();
        const database = mongo.db(db_name);
        const mongoCol = database.collection(collection_name);
        // Query for a movie that has the title 'The Room'
        const query = { YEAR: '2015' };
        // const options = {
        // // sort matched documents in descending order by rating
        // sort: { "imdb.rating": -1 },
        // // Include only the `title` and `imdb` fields in the returned document
        // projection: { _id: 0, title: 1, imdb: 1 },
        // };
        const movie = await mongoCol.findOne(query);
        // since this method returns the matched document, not a cursor, print it directly
        console.log(`\n[--+--]A document was found with id: ${movie._id}\n`);
    } finally {
        await mongo.close();
    }
}


async function initMongo() {
    try {
        await mongo.connect();
        const database = mongo.db(db_name);
        const mongoCol = database.collection(collection_name);
        const count = await mongoCol.countDocuments();
        if (count == 0) {
            csvtojson()
                .fromFile(__dirname + "/../Datasets/1000-data.csv")
                .then(csvData => {
                    inserJson(csvData).catch(console.dir);
            });
            console.log(`\n[--+--] Collection was initialized from file: currnet coun = ${count}\n`);
        }
        else {
            console.log(`\n[--+--] Collection is already initialized: currnet coun = ${count}\n`);
        }
    } finally {
        await mongo.close();
    }
}


// insertOne(exampple_doc).catch(console.dir);
// findExample().catch(console.dir);

module.exports = {initMongo}