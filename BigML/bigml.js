const bigml = require('bigml');
const express = require("express");
const { MongoClient } = require('mongodb');
const csvtojson = require("csvtojson");
const app = express();
const ip = require('ip');
const { Kafka, logLevel, Partitioners } = require('kafkajs')

const { sendMessage } = require('./../Kakfa/producer')
const consumer = require("./../Kakfa/consumer");
const redis = require("./../redis/redis_op");
const mongo = require("./../mongodb/mongoDB_op");


const connection = new bigml.BigML('ShmuelLa', '1bbe994797b5fb7637e4590aa3c11bff420a548e');
const model = new bigml.Model(connection);
bigml.Prediction(connection)
const localModel = new bigml.LocalModel('model/6318d5768be2aa4bb80001e8', connection);

const host = process.env.HOST_IP || ip.address()

const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: [`${host}:9092`],
    clientId: 'big-ml-consumer'
})

mongo.initMongo();

// model.get('model/6318d5768be2aa4bb80001e8',
//     true,
//     'only_model=true;limit=-1',
//     function (error, resource) {
//     if (!error && resource) {
//     console.log(resource);
//     }
// })

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

// consumer.bigmlModelConsume(localModel);

// localModel.predict(ans, 
//     function(error, prediction) {console.log(prediction)});
// localModel.predict(exampple_doc_for_prediction, 
//     function(error, prediction) {console.log(prediction)});


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
                    console.log(`\n[--+--] Received for prediction:\n ${in_json}\n`);
                }
                catch (err) {
                    //console.log(err);
                    var in_json = message.value;
                    var airline = null;
                }
                console.log(`- ${prefix} #${in_json} \n${airline}`);
                localModel.predict(in_json,
                    function (error, prediction) {
                        console.log(`\nResulting prediction: \n${prediction.prediction} for:\n${prediction}\n`);
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

