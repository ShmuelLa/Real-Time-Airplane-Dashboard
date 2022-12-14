
const ip = require('ip')

const { Kafka, logLevel, Partitioners } = require('kafkajs')
const { sendMessage } = require('./producer')

const host = process.env.HOST_IP || ip.address()

const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: [`${host}:9092`],
    clientId: 'big-ml-consumer'
})


function bigmlModelConsume(localModel) {
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
                        console.log('\n[--+--]' + prediction.prediction + '\n\n\n');
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
                console.log(`- ${prefix} #${in_json} \n${airline}`);
                console.log('\n\n\n' + result + '\n\n\n');
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

module.exports = { bigmlModelConsume, consumePrediction }
