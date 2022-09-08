const express = require("express");
const bodyParser = require("body-parser");
const redis = require('redis');

const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

async function nodeRedisDemo() {
  try {
    await redisClient.connect();
    await redisClient.set('takeoff', 13);
    await redisClient.set('landing', 13);
    const myKeyValue1 = await redisClient.get('takeoff');
    console.log(myKeyValue1);
    const myKeyValue2 = await redisClient.get('landing');
    console.log(myKeyValue2);

    // const numAdded = await redisClient.zAdd('flights', [
    //   {
    //     score: 4,
    //     value: 'car',
    //   },
    //   {
    //     score: 2,
    //     value: 'bike',
    //   },
    // ]);
    // console.log(`Added ${numAdded} items.`);

    // for await (const { score, value } of redisClient.zScanIterator('flights')) {
    //   console.log(`${value} -> ${score}`);
    // }

    await redisClient.quit();
  } catch (e) {
    console.error(e);
  }
}

nodeRedisDemo();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/" , function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.listen(55552, function() {
});