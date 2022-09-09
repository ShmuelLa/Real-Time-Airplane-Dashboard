const express = require("express");
const bodyParser = require("body-parser");
const redis = require('redis');

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

const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

async function redisSet(keystr, val) {
  try {
    await redisClient.connect();
    await redisClient.set(keystr, val);
    await redisClient.quit();
  } catch (e) {
    console.error(e);
  }
}

async function redisGet(keystr) {
  try {
    await redisClient.connect();
    const result = await redisClient.get(keystr);
    await redisClient.quit();
    return result;
  } catch (e) {
    console.error(e);
  }
}

async function redisSetList(keystr, lst) {
  /*
  Inserts a list to the current redis client session

  Example: 
      const numAdded = await redisClient.zAdd(keystr, [
      {
        score: 4,
        value: 'car',
      },
      {
        score: 2,
        value: 'bike',
      },
    ]);
  */
  try {
    await redisClient.connect();
    console.log(`Added ${numAdded} items.`);
    const numAdded = await redisClient.zAdd(keystr, lst);
    await redisClient.quit();
  } catch (e) {
    console.error(e);
  }
}

async function redisSetJson(keystr, jsonDict) {
  /*
  Inserts a JSON / Dictionary object to the current connected Redis client
  session by turning the object to a string and storing it on a single key
  */
  try {
    await redisClient.connect();
    await redisClient.set(keystr, JSON.stringify(jsonDict));
    await redisClient.quit();
    console.log('JSON Inserted successfuly to key: ' + keystr);
  } catch (e) {
    console.error(e);
  }
}

async function redisGetJson(keystr) {
  /*
  Reads a JSON / Dictionary object from the current connected Redis client
  session by parsing the received string to a JSON object
  */
  try {
    await redisClient.connect();
    const result = await redisClient.get(keystr);
    console.log('JSON Read successfuly from key: ' + keystr);
    await redisClient.quit();
    return JSON.parse(result);
  } catch (e) {
    console.error(e);
  }
}

// Test run for JSON getting:
// redisGetJson('test').then(console.log);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/" , function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.listen(55552, function() {
});