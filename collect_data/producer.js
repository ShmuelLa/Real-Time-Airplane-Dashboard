//export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
//docker-compose up

const ip = require('ip')

const { Kafka, CompressionTypes, logLevel } = require('kafkajs')

const host = process.env.HOST_IP || ip.address()

const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${host}:9092`],
  clientId: 'data_collecter-producer',
})

//const topic = 'real-time-data'
const producer = kafka.producer()

//const getRandomNumber = () => Math.round(Math.random(10) * 1000)
// const createMessage = num => ({
//   key: `key-${num}`,
//   value: "hello"
//   // value: `value-${num}-${new Date().toISOString()}`,
// })

async function sendMessage(str_message,topic) {
  await producer.connect();
  //setInterval(async () => {
    try {
      const message = await producer
        .send({
          topic,
          compression: CompressionTypes.GZIP,
          messages: [{value: str_message}],
        })
      return console.log(message)
    } catch (e) {
      return console.error(`[example/producer] ${e.message}`, e)
    }
  //}, 3000)
}
module.exports = {sendMessage}

// const run = async () => {
//   await producer.connect()
//   setInterval(sendMessage, 3000)
// }

//run().catch(e => console.error(`[example/producer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async () => {
    try {
      console.log(`process.on ${type}`)
      await producer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await producer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})
// {
//   YEAR: 2022,
//   MONTH: 8,
//   DAY: 8,
//   DAY_OF_WEEK: 5,
//   AIRLINE_NAME: 'Lufthansa',
//   AIRLINE_IATA_CODE: 'LH',
//   FLIGHT_NUMBER: '684',
//   FLIGHT_IATA_CODE: 'LH684',
//   ORIGIN_AIRPORT_IATA: 'MUC',
//   DESTINATION_AIRPORT_IATA: 'TLV',
//   SCHEDULED_DEPARTURE: '8.9.2022 23:15:00',
//   DEPARTURE_TIME: null,
//   UPDATED_DEPARTURE_TIME: null,
//   SCHEDULED_ARRIVAL: '9.9.2022 3:05:00',
//   ARRIVAL_TIME: null,
//   UPDATED_ARRIVAL_TIME: null,
//   DEPARTURE_DELAY: null,
//   ARRIVAL_DELAY: null,
//   FLIGHT_STATUS: 'en-route',
//   DELAY_TYPE: null,
//   DISTANCE_TYPE: 'Median',
//   IS_HOLYDAY: false,
//   IS_VICATION: false,
//   WEATHER_DEP_DESC: 'Clear',
//   WEATHER_DEP_DESC_CODE: 1000,
//   WEATHER_DEP_DEG: 12.7,
//   WEATHER_ARR_DESC: 'Clear',
//   WEATHER_ARR_DESC_CODE: 1000,
//   WEATHER_ARR_DEG: 25.4,
//   DEPARTURE_COUNTRY: 'GERMANY',
//   ARRIVAL_COUNTRY: 'ISRAEL',
//   LAT: 34.154068,
//   LNG: 32.635281
// }