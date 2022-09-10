const bigml = require('bigml');
const express = require("express");
const { MongoClient } = require('mongodb');
const csvtojson = require("csvtojson");
const app = express();
const ip = require('ip');
const { Kafka, logLevel, Partitioners } = require('kafkajs')
const { sendMessage } = require('./producer')

const consumer = require("./consumer");
const redis = require("./../redis/redis_op");


const connection = new bigml.BigML('ShmuelLa', '1bbe994797b5fb7637e4590aa3c11bff420a548e');
const model = new bigml.Model(connection);
bigml.Prediction(connection)
const localModel = new bigml.LocalModel('model/6318d5768be2aa4bb80001e8', connection);

const host = process.env.HOST_IP || ip.address()

const kafka = new Kafka({
    // logLevel: logLevel.INFO,
    brokers: [`${host}:9092`],
    clientId: 'big-ml-consumer'
})


const url = "mongodb://localhost:2717";
const mongo = new MongoClient(url);
const db_name = "airdb"

// model.get('model/6318d5768be2aa4bb80001e8',
//     true,
//     'only_model=true;limit=-1',
//     function (error, resource) {
//     if (!error && resource) {
//     console.log(resource);
//     }
// })

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

const exampple_doc_for_prediction =   {
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

const ans={
    YEAR: 2022,
    MONTH: 8,
    DAY: 9,
    DAY_OF_WEEK: 6,
    AIRLINE_NAME: 'Arkia Israeli Airlines',
    AIRLINE_IATA_CODE: 'IZ',
    FLIGHT_NUMBER: '336',
    FLIGHT_IATA_CODE: 'IZ336',
    ORIGIN_AIRPORT_IATA: 'FCO',
    DESTINATION_AIRPORT_IATA: 'TLV',
    SCHEDULED_DEPARTURE: '9.9.2022 12:05:00',
    DEPARTURE_TIME: null,
    UPDATED_DEPARTURE_TIME: null,
    SCHEDULED_ARRIVAL: '9.9.2022 15:25:00',
    ARRIVAL_TIME: null,
    UPDATED_ARRIVAL_TIME: null,
    DEPARTURE_DELAY: null,
    ARRIVAL_DELAY: null,
    FLIGHT_STATUS: 'en-route',
    DELAY_TYPE: null,
    DISTANCE_TYPE: 'Median',
    IS_HOLYDAY: false,
    IS_VICATION: false,
    WEATHER_DEP_DESC: 'Patchy rain possible',
    WEATHER_DEP_DESC_CODE: 1063,
    WEATHER_DEP_DEG: 34.6,
    WEATHER_ARR_DESC: 'Sunny',
    WEATHER_ARR_DESC_CODE: 1000,
    WEATHER_ARR_DEG: 37.6,
    DEPARTURE_COUNTRY: 'ITALY',
    ARRIVAL_COUNTRY: 'ISRAEL',
    LAT: 33.140446,
    LNG: 33.058479,
    DIR: 123
}

// consumer.consume(localModel);

// localModel.predict(ans, 
//     function(error, prediction) {console.log(prediction)});
// localModel.predict(exampple_doc_for_prediction, 
//     function(error, prediction) {console.log(prediction)});
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

// csvtojson()
//     .fromFile(__dirname + "/../Datasets/1000-data.csv")
//     .then(csvData => {
//         inserJson(csvData).catch(console.dir);
// });


// insertOne(exampple_doc).catch(console.dir);
// findExample().catch(console.dir);

function consumePredict(localModel) {
    const topic = 'prediction_request'
    const consumer = kafka.consumer({ groupId: 'big-ml-pred' })
    const run = async () => {
        await consumer.connect()
        await consumer.subscribe({ topic, fromBeginning: true })
        await consumer.run({
            // eachBatch: async ({ batch }) => {
            //   console.log(batch)
            // },
            eachMessage: async ({ topic, partition, message }) => {
                const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
                try {
                    var in_json = JSON.parse(message.value);
                    var airline = in_json.AIRLINE_NAME;
                }
                catch (err) {
                    //console.log(err);
                    var in_json = message.value;
                    var airline = null;
                }
                console.log(`- ${prefix} #${in_json} \n${airline}`);
                localModel.predict(in_json,
                    function (error, prediction) {
                        console.log('\n\n\n' + prediction.prediction + '\n\n\n');
                        sendMessage(prediction.prediction, 'prediction');
                    });
            },
        })
    }
    run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

    const errorTypes = ['unhandledRejection', 'uncaughtException']
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

    errorTypes.forEach(type => {
        process.on(type, async e => {
            try {
                console.log(`process.on ${type}`)
                console.error(e)
                await consumer.disconnect()
                process.exit(0)
            } catch (_) {
                process.exit(1)
            }
        })
    })

    signalTraps.forEach(type => {
        process.once(type, async () => {
            try {
                await consumer.disconnect()
            } finally {
                process.kill(process.pid, type)
            }
        })
    })
}

consumePredict(localModel);

app.listen(55553, function() {
});

