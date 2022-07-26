const redis = require("redis");

const redisClient = redis.createClient(process.env.REDIS_PORT);

async function run() {
  await redisClient.connect();
}

run();

module.exports = redisClient;
