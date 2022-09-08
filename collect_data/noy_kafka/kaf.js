//models/kafkaConf.js

const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const { kafkaConf } = require("./kafkaInfo");

class Kafka {
    constructor() {
        this.producer = new rdkafka.Producer(kafkaInfo.kafkaConf)
        this.producer.on("ready", function (arg) {
            console.log(`producer ${arg.name} ready.`)
        })
        this.producer.connect()
    }

    genMessage(m) {
        return new Buffer.alloc(m.length, m)
    } 

    publish(msg) {
        const m = JSON.stringify(msg)
        this.producer.produce(kafkaInfo.topic, -1, this.genMessage(m), uuid.v4())
    }

    //need to change
    async send(s) {
        this.publish(s)
        return true
    }
}

module.exports = Kafka