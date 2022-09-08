//big ML
const uuid = require("uuid");
const Kafka = require("node-rdkafka");

const kafkaConf = require('../../Kafka/kafkaInfo')

class Kafka {
    constructor(content_cb) {
    this.consumer = new rdkafka.KafkaConsumer(kafkaInfo.kafkaConf, {
        "auto.offset.reset": "beginning"
    })
    this.consumer.on("error", function(err) {
        console.error(err);
      });
      this.consumer.on("ready", function(arg) {
        console.log(`Consumer ${arg.name} ready`);
        this.subscribe([kafkaInfo.topic]);
        this.consume();
      });
      this.consumer.on("data", function (m) {
        // console.log(m.value.toString())
        // console.log("calling commit")
        this.commit(m)
        // console.log("The value is : " + m.value.toString())
        const s = m.value.toString()
        let content = JSON.parse(s)
        console.log(content);
        content_cb(content)  // send the content 
    })
    this.consumer.on("disconnected", function (arg) {
        process.exit()
    })
    this.consumer.on('event.error', function (err) {
        console.error(err)
        process.exit(1)
    })
    this.consumer.on('event.log', function (log) {
        // console.log(log)
    })
    this.consumer.connect()
}
}

module.exports = Kafka