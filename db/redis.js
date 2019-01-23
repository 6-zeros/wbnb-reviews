const redis = require('redis');
const util = require('util');

const client = redis.createClient();
redis_set = util.promisify(client.set).bind(client);
redis_get = util.promisify(client.get).bind(client);
redis.debug = true;

client.on('error', err => {
  console.log("Error ", err);
})

client.on('connect', () => {
  console.log('Redis caching...');
})

module.exports = {
    redis_get, //takes key
    redis_set, //key, value
}