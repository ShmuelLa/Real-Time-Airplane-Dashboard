const ip = require('ip')
const { Kafka, CompressionTypes, logLevel } = require('kafkajs')

const host = process.env.HOST_IP || ip.address()

async function sendMessage(str_message, topic,clientId) {
  if (clientId === null) {
    clientId= 'data_collecter-producer';
  }
  const kafka = new Kafka({
    logLevel: logLevel.DEBUG,
    brokers: [`${host}:9092`],
    clientId: clientId
  })
  const producer = kafka.producer()
  await producer.connect();
  //setInterval(async () => {
    try {
      const message = await producer
        .send({
          topic,
          compression: CompressionTypes.GZIP,
          messages: [{value: str_message}],
        })
        console.log(`\n[--+--] Sending for prediction:`);
        return console.log(message);
    } catch (e) {
      return console.error(`[example/producer] ${e.message}`, e);
    }
  //}, 3000)
}
module.exports = {sendMessage}

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