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

  module.exports = Object.freeze({
    kafkaConf : kafkaConf,
    topic : topic
})