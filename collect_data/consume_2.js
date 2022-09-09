const ip = require('ip')

const { Kafka, logLevel } = require('kafkajs')

const host = process.env.HOST_IP || ip.address()


function consume(client_id, group_id, topic) {
    const kafka = new Kafka({
        logLevel: logLevel.INFO,
        brokers: [`${host}:9092`],
        clientId: client_id,
    })



    const topic = topic
    const consumer = kafka.consumer({ groupId: group_id })

    const run = async () => {
        await consumer.connect()
        await consumer.subscribe({ topic, fromBeginning: true })
        await consumer.run({
            // eachBatch: async ({ batch }) => {
            //   console.log(batch)
            // },
            eachMessage: async ({ topic, partition, message }) => {
                const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
                // try {
                //     var in_json = JSON.parse(message.value);
                //     var airline = in_json.AIRLINE_NAME;
                // }
                // catch (err) {
                //     //console.log(err);
                //     var in_json = message.value;
                //     var airline = null;
                // }
                console.log(message.value);
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
module.exports={consume}
// function do_something()
