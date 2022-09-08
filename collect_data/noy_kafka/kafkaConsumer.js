const Kafka = require("node-rdkafka");

const kafkaConf = {
    "group.id": "cloudkarafka-example",
    "metadata.broker.list": "moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094".split(","),
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "mo0oa5gi",
    "sasl.password": "4ozx-X3Eaj0H9bvA96qmmD9MY-WRMkIA",
    "debug": "generic,broker,security"
  };
  
  const prefix = "";
  const topic = `${prefix}e1e41mbp-default`;

  const consumer = new Kafka.KafkaConsumer(kafkaConf, {
    "auto.offset.reset": "beginning"
  }); 
  const fetchData = callback => {
      consumer.connect();
  
      consumer.on("ready",() =>{
          console.log('Consumer ready');
          consumer.subscribe([topic]);
          consumer.consume();
      }).on("data", m => {
          console.log("to redis",m.value.toString());
          //var messageToRedis = m.value.toString()
          var messageToRedis = JSON.parse(m.value);
          callback(null,messageToRedis) //need to change
      }).on('event.error', err => {
        console.log(err);
        callback(err); //need to change
      });
  
  
  }
  
  module.exports = {
      fetchData: fetchData,
    };