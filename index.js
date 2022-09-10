const express = require("express");
const bodyParser = require("body-parser");
const ip = require('ip');
const { Kafka, CompressionTypes, logLevel } = require('kafkajs');
const { Server } = require("socket.io");
const app = express();
const http = require('http');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
const server = http.createServer(app);

const redis = require("./redis/redis_op");
const producer = require("./Kakfa/producer");
// const consumer = require("./Kakfa/consumer");

const host = process.env.HOST_IP || ip.address()
const io = new Server(server);
const port = process.env.PORT || 55552


const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${host}:9092`],
  clientId: 'data_collecter-producer'
})

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

producer.sendMessage(JSON.stringify(exampple_doc), 'prediction_request');

app.get("/" , function(req, res){
    res.sendFile(__dirname + "/index.html");
});

function consumePrediction() {
  const topic = 'prediction'
  const consumer = kafka.consumer({ groupId: 'big-ml-pred' })
  const run = async () => {
      await consumer.connect()
      await consumer.subscribe({ topic, fromBeginning: true })
      await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
              const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
              try {
                  var result = JSON.parse(message.value);
              }
              catch (err) {
                  var in_json = message.value;
                  var airline = null;
              }
              // console.log(`- ${prefix} #${in_json} \n${airline}`);
              console.log('\n[--+--]Received prediction:\n');
              console.log(result);
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

consumePrediction();

app.listen(port, function() {
  console.log(`\n[--+--] App started and listening on port: ${port} \n`);
});