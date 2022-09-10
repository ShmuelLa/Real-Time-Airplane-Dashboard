const express = require("express");
const bodyParser = require("body-parser");
const { disconnect } = require('process');
const ip = require('ip');
const { Kafka, CompressionTypes, logLevel } = require('kafkajs');
const { Server } = require("socket.io");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
const http = require('http').Server(app);
// const server = http.createServer(app);
const io = require('socket.io')(http);

const redis = require("./redis/redis_op");
const producer = require("./Kakfa/producer");
// const consumer = require("./Kakfa/consumer");
const html_generator = require("./html_build")

const host = process.env.HOST_IP || ip.address()
const port = process.env.PORT || 55552


const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${host}:9092`],
  clientId: 'data_collecter-producer'
})

const arr_j2 =
    [{
        YEAR: 2022,
        MONTH: 8,
        DAY: 10,
        DAY_OF_WEEK: 7,
        AIRLINE_NAME: 'EL AL Israel Airlines',
        AIRLINE_IATA_CODE: 'LY',
        FLIGHT_NUMBER: '340',
        FLIGHT_IATA_CODE: 'LY340',
        ORIGIN_AIRPORT_IATA: 'ZRH',
        DESTINATION_AIRPORT_IATA: 'TLV',
        SCHEDULED_DEPARTURE: '10.9.2022 23:30:00',
        DEPARTURE_TIME: null,
        UPDATED_DEPARTURE_TIME: null,
        SCHEDULED_ARRIVAL: '11.9.2022 3:25:00',
        ARRIVAL_TIME: null,
        UPDATED_ARRIVAL_TIME: null,
        DEPARTURE_DELAY: null,
        ARRIVAL_DELAY: null,
        FLIGHT_STATUS: 'en-route',
        DELAY_TYPE: null,
        DISTANCE_TYPE: 'Median',
        IS_HOLYDAY: false,
        IS_VICATION: false,
        WEATHER_DEP_DESC: 'Mist',
        WEATHER_DEP_DESC_CODE: 1030,
        WEATHER_DEP_DEG: 12,
        WEATHER_ARR_DESC: 'Clear',
        WEATHER_ARR_DESC_CODE: 1000,
        WEATHER_ARR_DEG: 25.1,
        DEPARTURE_COUNTRY: 'SWITZERLAND',
        ARRIVAL_COUNTRY: 'ISRAEL',
        LAT: 47.426304,
        LNG: 9.427467,
        DIR: 91,
        PREDICTION: 'Calculating'
    },
    {
        YEAR: 2022,
        MONTH: 8,
        DAY: 10,
        DAY_OF_WEEK: 7,
        AIRLINE_NAME: 'EL AL Israel Airlines',
        AIRLINE_IATA_CODE: 'LY',
        FLIGHT_NUMBER: '384',
        FLIGHT_IATA_CODE: 'LY384',
        ORIGIN_AIRPORT_IATA: 'FCO',
        DESTINATION_AIRPORT_IATA: 'TLV',
        SCHEDULED_DEPARTURE: '10.9.2022 23:35:00',
        DEPARTURE_TIME: '10.9.2022 23:37:00',
        UPDATED_DEPARTURE_TIME: '10.9.2022 23:37:00',
        SCHEDULED_ARRIVAL: '11.9.2022 2:55:00',
        ARRIVAL_TIME: null,
        UPDATED_ARRIVAL_TIME: null,
        DEPARTURE_DELAY: 2,
        ARRIVAL_DELAY: null,
        FLIGHT_STATUS: 'en-route',
        DELAY_TYPE: null,
        DISTANCE_TYPE: 'Median',
        IS_HOLYDAY: false,
        IS_VICATION: false,
        WEATHER_DEP_DESC: 'Clear',
        WEATHER_DEP_DESC_CODE: 1000,
        WEATHER_DEP_DEG: 25.3,
        WEATHER_ARR_DESC: 'Clear',
        WEATHER_ARR_DESC_CODE: 1000,
        WEATHER_ARR_DEG: 25.4,
        DEPARTURE_COUNTRY: 'ITALY',
        ARRIVAL_COUNTRY: 'ISRAEL',
        LAT: 41.635803,
        LNG: 12.594514,
        DIR: 107,
        PREDICTION: 'Calculating'
    },
    {
        YEAR: 2022,
        MONTH: 8,
        DAY: 10,
        DAY_OF_WEEK: 7,
        AIRLINE_NAME: 'Transavia France',
        AIRLINE_IATA_CODE: 'TO',
        FLIGHT_NUMBER: '3459',
        FLIGHT_IATA_CODE: 'TO3459',
        ORIGIN_AIRPORT_IATA: 'TLV',
        DESTINATION_AIRPORT_IATA: 'ORY',
        SCHEDULED_DEPARTURE: '10.9.2022 18:25:00',
        DEPARTURE_TIME: '10.9.2022 20:12:00',
        UPDATED_DEPARTURE_TIME: '10.9.2022 20:12:00',
        SCHEDULED_ARRIVAL: '10.9.2022 23:25:00',
        ARRIVAL_TIME: null,
        UPDATED_ARRIVAL_TIME: null,
        DEPARTURE_DELAY: 107,
        ARRIVAL_DELAY: null,
        FLIGHT_STATUS: 'en-route',
        DELAY_TYPE: null,
        DISTANCE_TYPE: 'Short',
        IS_HOLYDAY: false,
        IS_VICATION: false,
        WEATHER_DEP_DESC: 'Sunny',
        WEATHER_DEP_DESC_CODE: 1000,
        WEATHER_DEP_DEG: 28.4,
        WEATHER_ARR_DESC: 'Partly cloudy',
        WEATHER_ARR_DESC_CODE: 1003,
        WEATHER_ARR_DEG: 18,
        DEPARTURE_COUNTRY: 'ISRAEL',
        ARRIVAL_COUNTRY: 'FRANCE',
        LAT: 44.972534,
        LNG: 10.597184,
        DIR: 302,
        PREDICTION: 'Calculating'
    }]

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
const ex_list = [exampple_doc, exampple_doc, exampple_doc]

redis.redisInit();

producer.sendMessage(JSON.stringify(exampple_doc), 'prediction_request');

app.get("/" , function(req, res){
    res.sendFile(__dirname + "/index.html");
});

async function consumePrediction() {
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

http.listen(port, function() {
  console.log(`\n[--+--] App started and listening on port: ${port} \n`);
});

io.sockets.on('connection', function (socket){
    setInterval(function () {
        console.log("\n[--+--] Updating page\n");
        redis.redisGet('landing').then((res) => {
            io.sockets.emit('lanCount', {lanCount:res});
        })
        redis.redisGet('takeoff').then((res) => {
            io.sockets.emit('takeCount', {takeCount:res});
        })
        html_generator.generateHTML(arr_j2, "landing", "Awaiting Langing List");
        html_generator.generateHTML(arr_j2, "takeoff", "Awaiting Take-Off List");
    }, 4000)
    socket.on('disconnect', function(){
        console.log('disconnect');
    })
})