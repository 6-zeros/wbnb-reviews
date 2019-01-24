const redis = require('redis');
const util = require('util');
const REDIS_PW = require('./keys.js')

const client = redis.createClient('6379','13.57.41.24', {password: REDIS_PW});
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