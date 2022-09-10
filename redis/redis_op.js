const redis = require('redis');

const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});
redisClient.connect();

async function redisSet(keystr, val) {
  try {
    // await redisClient.connect();
    await redisClient.set(keystr, val);
    // await redisClient.quit();
  } catch (e) {
    console.error(e);
  }
}

async function redisGet(keystr) {
  try {
    // await redisClient.connect();
    const result = await redisClient.get(keystr);
    // await redisClient.quit();
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
    // await redisClient.connect();
    await redisClient.set(keystr, JSON.stringify(jsonDict));
    // await redisClient.quit();
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
    // await redisClient.connect();
    const result = await redisClient.get(keystr);
    console.log('JSON Read successfuly from key: ' + keystr);
    // await redisClient.quit();
    return JSON.parse(result);
  } catch (e) {
    console.error(e);
  }
}

module.exports = {redisGetJson,
                  redisSetJson,
                  redisSetList,
                  redisGet,
                  redisSet}
// Test run for JSON getting:
// redisGetJson('test').then(console.log);